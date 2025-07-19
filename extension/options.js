// Options script for Chrome Productivity Analyzer 

const defaultProductive = [
  'github.com',
  'stackoverflow.com',
  'leetcode.com',
  'docs.google.com',
  'notion.so'
];
const defaultUnproductive = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'youtube.com',
  'reddit.com'
];

function getClassifications(callback) {
  chrome.storage.local.get(['productiveSites', 'unproductiveSites'], (result) => {
    const productive = result.productiveSites || defaultProductive;
    const unproductive = result.unproductiveSites || defaultUnproductive;
    callback({ productive, unproductive });
  });
}

function saveClassifications(productive, unproductive) {
  chrome.storage.local.set({
    productiveSites: productive,
    unproductiveSites: unproductive
  });
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
  getClassifications(({ productive, unproductive }) => {
    productiveSites = [...productive];
    unproductiveSites = [...unproductive];
    updateUI();
  });
}); 