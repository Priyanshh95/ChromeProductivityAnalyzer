// Dashboard script for Chrome Productivity Analyzer 

function getTimeData(callback) {
  fetch('http://localhost:3000/stats')
    .then(res => res.json())
    .then(data => callback(data.stats || {}))
    .catch(() => callback({}));
}

function getClassifications(callback) {
  fetch('http://localhost:3000/classify')
    .then(res => res.json())
    .then(data => callback({
      productive: data.productive || [],
      unproductive: data.unproductive || []
    }))
    .catch(() => callback({ productive: [], unproductive: [] }));
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function renderAnalytics(timeData, classifications) {
  let total = 0, productive = 0, unproductive = 0;
  const prodSet = new Set(classifications.productive);
  const unprodSet = new Set(classifications.unproductive);
  const rows = [];

  for (const [domain, seconds] of Object.entries(timeData)) {
    total += seconds;
    let type = 'Neutral';
    if (prodSet.has(domain)) {
      productive += seconds;
      type = 'Productive';
    } else if (unprodSet.has(domain)) {
      unproductive += seconds;
      type = 'Unproductive';
    }
    rows.push({ domain, seconds, type });
  }

  const prodPercent = total ? Math.round((productive / total) * 100) : 0;
  const unprodPercent = total ? Math.round((unproductive / total) * 100) : 0;

  let html = `<h2>Total Time: ${formatTime(total)}</h2>`;
  html += `<h3>Productive: ${formatTime(productive)} (${prodPercent}%)</h3>`;
  html += `<h3>Unproductive: ${formatTime(unproductive)} (${unprodPercent}%)</h3>`;
  html += '<table><tr><th>Domain</th><th>Time</th><th>Type</th></tr>';
  rows.sort((a, b) => b.seconds - a.seconds).forEach(row => {
    html += `<tr><td>${row.domain}</td><td>${formatTime(row.seconds)}</td><td>${row.type}</td></tr>`;
  });
  html += '</table>';

  document.getElementById('analytics').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  getTimeData((timeData) => {
    getClassifications((classifications) => {
      renderAnalytics(timeData, classifications);
    });
  });
}); 