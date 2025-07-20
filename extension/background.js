// Background script for Chrome Productivity Analyzer
// ... will implement time tracking logic here ...

let currentTabId = null;
let currentDomain = null;
let startTime = null;

// Helper to get domain from URL
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Save time spent on a domain
function saveTime(domain, timeSpent) {
  if (!domain || !timeSpent) return;
  chrome.storage.local.get(['timeData'], (result) => {
    const timeData = result.timeData || {};
    timeData[domain] = (timeData[domain] || 0) + timeSpent;
    chrome.storage.local.set({ timeData });
  });
  // Sync to backend
  fetch('http://localhost:3000/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain, seconds: timeSpent })
  }).catch(() => {});
}

// Handle tab or window change
function handleTabChange(tabId, url) {
  const now = Date.now();
  if (currentDomain && startTime) {
    const timeSpent = Math.floor((now - startTime) / 1000); // seconds
    saveTime(currentDomain, timeSpent);
  }
  currentTabId = tabId;
  currentDomain = getDomain(url);
  startTime = now;
}

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.active && tab.url && tab.status === 'complete') {
      handleTabChange(tab.id, tab.url);
    }
  });
});

// Listen for tab updates (URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    handleTabChange(tabId, changeInfo.url);
  }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // User left Chrome, save time for current domain
    handleTabChange(null, null);
    currentTabId = null;
    currentDomain = null;
    startTime = null;
  } else {
    // Refocus: get active tab in this window
    chrome.windows.get(windowId, { populate: true }, (window) => {
      if (window && window.focused) {
        const activeTab = window.tabs.find((t) => t.active);
        if (activeTab && activeTab.url) {
          handleTabChange(activeTab.id, activeTab.url);
        }
      }
    });
  }
});

// On extension startup, initialize tracking
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  if (Array.isArray(tabs) && tabs.length > 0) {
    handleTabChange(tabs[0].id, tabs[0].url);
  } else {
    // Defensive: do nothing or log a warning
    console.warn('No active tab found or tabs is undefined:', tabs);
  }
}); 