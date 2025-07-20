# Chrome Productivity Analyzer

A Chrome extension to track your web activity, classify sites as productive or unproductive, and visualize your productivity with a modern dashboard.

## Features
- **Automatic time tracking** for every website you visit
- **Classify sites** as productive, unproductive, or neutral
- **Weekly and daily analytics dashboard** with clear stats and breakdowns
- **One-click data reset** to start fresh anytime
- **Friendly domain names** for popular sites and extension pages
- **Modern, clean UI** with readable stats and easy navigation
- **Backend API** for persistent data storage

## Getting Started

### 1. Clone the Repository
```
git clone <repo-url>
cd ChromeProductivityAnalyzer
```

### 2. Install Backend Dependencies
```
cd backend
npm install
```

### 3. Start the Backend Server
```
node server.js
```
The backend runs on [http://localhost:3000](http://localhost:3000)

### 4. Load the Extension in Chrome
1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `extension` folder

### 5. Use the Extension
- Click the extension icon to view today's stats
- Open the dashboard for detailed analytics
- Use the options page to edit productive/unproductive site lists
- Use the "Clear All Data" button on the dashboard to reset stats

## Customization
- **Add or remove sites** from productive/unproductive lists in the options page
- **All time tracking data** is stored locally and in the backend for analytics
- **Domain normalization** ensures "www." and non-www. sites are treated the same

## Project Structure
```
ChromeProductivityAnalyzer/
├── backend/
│   ├── db.json            # JSON database for logs and classifications
│   ├── server.js          # Express backend API
│   ├── package.json       # Backend dependencies
│   ├── package-lock.json  # Backend lockfile
│   └── node_modules/      # Backend dependencies
│
├── extension/
│   ├── manifest.json      # Chrome extension manifest (MV3)
│   ├── background.js      # Background service worker (time tracking logic)
│   ├── popup.html         # Popup UI
│   ├── popup.js           # Popup logic
│   ├── dashboard.html     # Analytics dashboard UI
│   ├── dashboard.js       # Dashboard logic
│   ├── options.html       # Site classification settings UI
│   ├── options.js         # Options/settings logic
│   ├── styles.css         # Shared modern CSS styles
│   ├── icon16.png         # Extension icon (16x16)
│   ├── icon48.png         # Extension icon (48x48)
│   ├── icon128.png        # Extension icon (128x128)
│
├── README.md              # This file
```

---

**Built for personal productivity and insight.**