// Popup script for Chrome Productivity Analyzer

document.addEventListener('DOMContentLoaded', () => {
  // Get today's stats from storage
  chrome.storage.local.get(['timeData'], (result) => {
    const timeData = result.timeData || {};
    let totalTime = 0;
    
    // Calculate total time for today
    for (const [domain, seconds] of Object.entries(timeData)) {
      totalTime += seconds;
    }
    
    // Format time
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const secs = totalTime % 60;
    
    // Update the stats display
    const statsDiv = document.getElementById('stats');
    if (statsDiv) {
      statsDiv.innerHTML = `
        <div style="text-align: center; padding: 10px;">
          <h3>Today's Activity</h3>
          <p><strong>Total Time:</strong> ${hours}h ${minutes}m ${secs}s</p>
          <p><strong>Sites Visited:</strong> ${Object.keys(timeData).length}</p>
        </div>
      `;
    }
  });
}); 