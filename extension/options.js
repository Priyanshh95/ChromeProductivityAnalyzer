// Options script for Chrome Productivity Analyzer 

const defaultProductive = [
  'github.com',
  'stackoverflow.com',
  'leetcode.com',
  'docs.google.com',
  'notion.so',
  'medium.com',
  'dev.to',
  'freecodecamp.org',
  'udemy.com',
  'coursera.org',
  'edx.org',
  'khanacademy.org',
  'w3schools.com',
  'mdn.io',
  'css-tricks.com',
  'smashingmagazine.com',
  'sitepoint.com',
  'web.dev',
  'developer.mozilla.org',
  'reactjs.org',
  'vuejs.org',
  'angular.io',
  'nodejs.org',
  'python.org',
  'java.com',
  'microsoft.com',
  'apple.com',
  'adobe.com',
  'figma.com',
  'trello.com',
  'asana.com',
  'slack.com',
  'zoom.us',
  'teams.microsoft.com',
  'linkedin.com',
  'indeed.com',
  'glassdoor.com',
  'stackoverflow.com',
  'reddit.com/r/programming',
  'reddit.com/r/webdev',
  'reddit.com/r/learnprogramming'
];

const defaultUnproductive = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'youtube.com',
  'reddit.com',
  'tiktok.com',
  'snapchat.com',
  'pinterest.com',
  'tumblr.com',
  'vine.co',
  'twitch.tv',
  'discord.com',
  'telegram.org',
  'whatsapp.com',
  'netflix.com',
  'hulu.com',
  'disneyplus.com',
  'amazon.com',
  'ebay.com',
  'etsy.com',
  'aliexpress.com',
  'wish.com',
  'buzzfeed.com',
  '9gag.com',
  'imgur.com',
  'giphy.com',
  'memecenter.com',
  'knowyourmeme.com',
  'urbanoutfitters.com',
  'hollisterco.com',
  'abercrombie.com',
  'forever21.com',
  'zara.com',
  'hm.com',
  'uniqlo.com',
  'gap.com',
  'oldnavy.com',
  'bananarepublic.com',
  'jcrew.com',
  'anthropologie.com',
  'freepeople.com',
  'nordstrom.com',
  'macys.com',
  'bloomingdales.com',
  'saksfifthavenue.com',
  'neimanmarcus.com',
  'barneys.com',
  'bergdorfgoodman.com',
  'saks.com',
  'nordstromrack.com',
  'tjmaxx.com',
  'marshalls.com',
  'ross.com',
  'burlington.com',
  'kohls.com',
  'jcpenney.com',
  'sears.com',
  'target.com',
  'walmart.com',
  'costco.com',
  'samsclub.com',
  'bjs.com',
  'kroger.com',
  'safeway.com',
  'albertsons.com',
  'publix.com',
  'wegmans.com',
  'wholefoodsmarket.com',
  'traderjoes.com',
  'sprouts.com',
  'freshmarket.com',
  'groceryoutlet.com',
  'food4less.com',
  'savealot.com',
  'dollartree.com',
  'familydollar.com',
  'dollargeneral.com',
  'fivebelow.com',
  'biglots.com',
  'olliesbargainoutlet.com',
  'gabes.com',
  'steveandbarrys.com',
  'aeropostale.com',
  'americanapparel.com',
  'express.com',
  'guess.com',
  'levis.com',
  'calvinklein.com',
  'tommyhilfiger.com',
  'ralphlauren.com',
  'nike.com',
  'adidas.com',
  'underarmour.com',
  'puma.com',
  'reebok.com',
  'converse.com',
  'vans.com',
  'skechers.com',
  'newbalance.com',
  'asics.com',
  'mizuno.com',
  'brooksrunning.com',
  'saucony.com',
  'hoka.com',
  'on-running.com',
  'altra.com',
  'topoathletic.com',
  'merrell.com',
  'keen.com',
  'columbia.com',
  'northface.com',
  'patagonia.com',
  'arcteryx.com',
  'marmot.com',
  'mountainhardwear.com',
  'outdoorresearch.com',
  'blackdiamond.com',
  'petzl.com',
  'grivel.com',
  'camp-usa.com',
  'msrgear.com',
  'bigagnes.com',
  'thermarest.com',
  'sea-to-summit.com',
  'osprey.com',
  'gregory.com',
  'deuter.com',
  'kelty.com',
  'rei.com',
  'backcountry.com',
  'moosejaw.com',
  'steepandcheap.com',
  'sierratradingpost.com',
  'campsaver.com',
  'gearx.com',
  'ems.com',
  'dickssportinggoods.com',
  'academy.com',
  'basspro.com',
  'cabelas.com',
  'scheels.com',
  'fieldandstream.com',
  'sportsmanswarehouse.com',
  'ganderoutdoors.com',
  'dunhamssports.com',
  'big5sportinggoods.com',
  'modells.com',
  'sportchek.ca',
  'mec.ca',
  'atmosphere.ca',
  'sportsexpert.ca',
  'sail.ca',
  'basspro.com',
  'cabelas.com',
  'scheels.com',
  'fieldandstream.com',
  'sportsmanswarehouse.com',
  'ganderoutdoors.com',
  'dunhamssports.com',
  'big5sportinggoods.com',
  'modells.com',
  'sportchek.ca',
  'mec.ca',
  'atmosphere.ca',
  'sportsexpert.ca',
  'sail.ca'
];

function setLoading(isLoading) {
  document.getElementById('options-loading').style.display = isLoading ? 'block' : 'none';
  document.getElementById('productive-list').style.display = isLoading ? 'none' : 'block';
  document.getElementById('unproductive-list').style.display = isLoading ? 'none' : 'block';
}

function setError(msg) {
  document.getElementById('options-error').textContent = msg || '';
}

function getClassifications(callback, errorCallback) {
  fetch('http://localhost:3000/classify')
    .then(res => res.json())
    .then(data => callback({
      productive: data.productive || defaultProductive,
      unproductive: data.unproductive || defaultUnproductive
    }))
    .catch(() => errorCallback('Failed to fetch site classifications from backend.'));
}

function saveClassifications(productive, unproductive) {
  chrome.storage.local.set({
    productiveSites: productive,
    unproductiveSites: unproductive
  });
  // Sync to backend
  fetch('http://localhost:3000/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productive, unproductive })
  }).catch(() => {});
}

function renderList(list, containerId, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  list.forEach((domain, idx) => {
    const div = document.createElement('div');
    div.className = 'site-item';
    div.textContent = domain;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => {
      list.splice(idx, 1);
      updateUI();
    };
    div.appendChild(removeBtn);
    container.appendChild(div);
  });
  // Add input for new domain
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Add domain...';
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add';
  addBtn.className = 'add-btn';
  addBtn.onclick = () => {
    const val = input.value.trim();
    if (val && !list.includes(val)) {
      list.push(val);
      input.value = '';
      updateUI();
    }
  };
  container.appendChild(input);
  container.appendChild(addBtn);
}

let productiveSites = [];
let unproductiveSites = [];

function updateUI() {
  renderList(productiveSites, 'productive-list', 'productive');
  renderList(unproductiveSites, 'unproductive-list', 'unproductive');
  saveClassifications(productiveSites, unproductiveSites);
}

document.addEventListener('DOMContentLoaded', () => {
  setLoading(true);
  setError('');
  getClassifications(({ productive, unproductive }) => {
    productiveSites = [...productive];
    unproductiveSites = [...unproductive];
    setLoading(false);
    updateUI();
  }, (err) => {
    setLoading(false);
    setError(err);
  });
}); 