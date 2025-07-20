// Dashboard script for Chrome Productivity Analyzer 

function setLoading(isLoading) {
  const analyticsDiv = document.getElementById('analytics');
  if (isLoading) {
    analyticsDiv.innerHTML = '<div class="loading">Loading your productivity data...</div>';
  }
}

function setError(msg) {
  const errorDiv = document.getElementById('dashboard-error');
  if (msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
  } else {
    errorDiv.style.display = 'none';
  }
}

function getTimeData(callback, errorCallback) {
  fetch('http://localhost:3000/stats')
    .then(res => res.json())
    .then(data => callback(data.stats || {}))
    .catch(() => errorCallback('Failed to fetch analytics from backend.'));
}

function getClassifications(callback, errorCallback) {
  fetch('http://localhost:3000/classify')
    .then(res => res.json())
    .then(data => callback({
      productive: data.productive || [],
      unproductive: data.unproductive || []
    }))
    .catch(() => errorCallback('Failed to fetch site classifications from backend.'));
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function getFriendlyDomainName(domain) {
  // Extension pages
  if (domain.includes('hndipnoalnggmljbgblmipinmopkfjlb')) {
    return 'Chrome Extension Pages';
  }
  if (domain === 'extensions') {
    return 'Chrome Extensions Manager';
  }
  if (domain === 'newtab') {
    return 'New Tab Page';
  }
  
  // Common domains
  const friendlyNames = {
    'www.google.com': 'Google Search',
    'google.com': 'Google Search',
    'mail.google.com': 'Gmail',
    'drive.google.com': 'Google Drive',
    'docs.google.com': 'Google Docs',
    'github.com': 'GitHub',
    'www.github.com': 'GitHub',
    'stackoverflow.com': 'Stack Overflow',
    'www.stackoverflow.com': 'Stack Overflow',
    'leetcode.com': 'LeetCode',
    'www.leetcode.com': 'LeetCode',
    'udemy.com': 'Udemy',
    'www.udemy.com': 'Udemy',
    'coursera.org': 'Coursera',
    'www.coursera.org': 'Coursera',
    'youtube.com': 'YouTube',
    'www.youtube.com': 'YouTube',
    'music.youtube.com': 'YouTube Music',
    'facebook.com': 'Facebook',
    'www.facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'www.instagram.com': 'Instagram',
    'twitter.com': 'Twitter',
    'www.twitter.com': 'Twitter',
    'linkedin.com': 'LinkedIn',
    'www.linkedin.com': 'LinkedIn',
    'chatgpt.com': 'ChatGPT',
    'www.chatgpt.com': 'ChatGPT',
    'web.whatsapp.com': 'WhatsApp Web',
    'notion.so': 'Notion',
    'www.notion.so': 'Notion',
    'trello.com': 'Trello',
    'www.trello.com': 'Trello',
    'slack.com': 'Slack',
    'www.slack.com': 'Slack',
    'zoom.us': 'Zoom',
    'www.zoom.us': 'Zoom',
    'teams.microsoft.com': 'Microsoft Teams',
    'discord.com': 'Discord',
    'www.discord.com': 'Discord',
    'netflix.com': 'Netflix',
    'www.netflix.com': 'Netflix',
    'amazon.com': 'Amazon',
    'www.amazon.com': 'Amazon',
    'reddit.com': 'Reddit',
    'www.reddit.com': 'Reddit'
  };
  
  return friendlyNames[domain] || domain;
}

function normalizeDomain(domain) {
  return domain.replace(/^www\./, '').toLowerCase();
}

function renderAnalytics(timeData, classifications) {
  let total = 0, productive = 0, unproductive = 0;
  // Normalize classification sets
  const prodSet = new Set(classifications.productive.map(normalizeDomain));
  const unprodSet = new Set(classifications.unproductive.map(normalizeDomain));
  const rows = [];

  for (const [domain, seconds] of Object.entries(timeData)) {
    total += seconds;
    let type = 'Neutral';
    const normDomain = normalizeDomain(domain);
    if (prodSet.has(normDomain)) {
      productive += seconds;
      type = 'Productive';
    } else if (unprodSet.has(normDomain)) {
      unproductive += seconds;
      type = 'Unproductive';
    }
    rows.push({ domain, seconds, type });
  }

  const prodPercent = total ? Math.round((productive / total) * 100) : 0;
  const unprodPercent = total ? Math.round((unproductive / total) * 100) : 0;
  const neutralPercent = 100 - prodPercent - unprodPercent;

  let html = `
    <div class="card">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${formatTime(total)}</div>
          <div class="stat-label">Total Time</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${prodPercent}%</div>
          <div class="stat-label">Productive</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${unprodPercent}%</div>
          <div class="stat-label">Unproductive</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${Object.keys(timeData).length}</div>
          <div class="stat-label">Sites Visited</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Detailed Breakdown</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Website</th>
              <th>Time Spent</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
  `;
  
  rows.sort((a, b) => b.seconds - a.seconds).forEach(row => {
    html += `
      <tr>
        <td class="domain-cell">${getFriendlyDomainName(row.domain)}</td>
        <td class="time-cell">${formatTime(row.seconds)}</td>
        <td class="type-cell">
          <span class="productivity-indicator ${row.type.toLowerCase()}">${row.type}</span>
        </td>
      </tr>
    `;
  });
  
  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('analytics').innerHTML = html;
}

// Update stats on popup open
document.addEventListener('DOMContentLoaded', () => {
  setLoading(true);
  setError('');
  getTimeData((timeData) => {
    getClassifications((classifications) => {
      setLoading(false);
      renderAnalytics(timeData, classifications);
    }, (err) => {
      setLoading(false);
      setError(err);
    });
  }, (err) => {
    setLoading(false);
    setError(err);
  });

  // Handle clear data button
  document.getElementById('clear-data-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all time tracking data? This cannot be undone.')) {
      // Clear backend data first
      fetch('http://localhost:3000/logs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(data => {
        console.log('Backend data cleared:', data);
        
        // Then clear Chrome storage
        chrome.storage.local.clear(() => {
          console.log('Chrome storage cleared');
          
          // Show success message
          alert('All data cleared successfully! Refreshing dashboard...');
          
          // Refresh the page to show empty data
          window.location.reload();
        });
      })
      .catch(error => {
        console.error('Failed to clear backend data:', error);
        // Fallback: just clear Chrome storage
        chrome.storage.local.clear(() => {
          alert('Chrome data cleared. Backend data will be cleared on server restart.');
          window.location.reload();
        });
      });
    }
  });
}); 