// Popup script for Chrome Productivity Analyzer

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m}m`;
}

function updateStats() {
  fetch('http://localhost:3000/stats')
    .then(res => res.json())
    .then(data => {
      const stats = data.stats || {};
      const today = new Date().toDateString();
      let total = 0, productive = 0, unproductive = 0;
      
      // Get classifications
      fetch('http://localhost:3000/classify')
        .then(res => res.json())
        .then(classifications => {
          const prodSet = new Set(classifications.productive || []);
          const unprodSet = new Set(classifications.unproductive || []);
          
          // Calculate today's stats
          Object.entries(stats).forEach(([domain, seconds]) => {
            total += seconds;
            if (prodSet.has(domain)) {
              productive += seconds;
            } else if (unprodSet.has(domain)) {
              unproductive += seconds;
            }
          });
          
          // Update UI
          document.getElementById('total-time').textContent = formatTime(total);
          document.getElementById('productive-time').textContent = formatTime(productive);
          document.getElementById('unproductive-time').textContent = formatTime(unproductive);
        })
        .catch(() => {
          // Fallback if classifications fail
          Object.values(stats).forEach(seconds => total += seconds);
          document.getElementById('total-time').textContent = formatTime(total);
          document.getElementById('productive-time').textContent = '0m';
          document.getElementById('unproductive-time').textContent = '0m';
        });
    })
    .catch(() => {
      document.getElementById('total-time').textContent = '0m';
      document.getElementById('productive-time').textContent = '0m';
      document.getElementById('unproductive-time').textContent = '0m';
    });
}

// Handle reload button
document.getElementById('reload-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'reloadClassifications' }, (response) => {
    if (response && response.success) {
      updateStats(); // Refresh stats after reload
      // Show success feedback
      const btn = document.getElementById('reload-btn');
      const originalText = btn.textContent;
      btn.textContent = 'Reloaded!';
      btn.style.background = '#4CAF50';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2000);
    }
  });
});

// Update stats on popup open
document.addEventListener('DOMContentLoaded', updateStats); 