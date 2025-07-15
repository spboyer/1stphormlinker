// popup.js - Handles the extension popup functionality

document.addEventListener('DOMContentLoaded', async function() {
  const affiliateCodeInput = document.getElementById('affiliateCode');
  const saveCodeButton = document.getElementById('saveCode');
  const saveMessage = document.getElementById('saveMessage');
  const linkSection = document.getElementById('linkSection');
  const generateLinkButton = document.getElementById('generateLink');
  const affiliateLinkDiv = document.getElementById('affiliateLink');
  const shareButtons = document.getElementById('shareButtons');
  
  let currentUrl = '';
  let affiliateLink = '';

  // Load saved affiliate code
  const result = await chrome.storage.sync.get(['affiliateCode']);
  if (result.affiliateCode) {
    affiliateCodeInput.value = result.affiliateCode;
  }

  // Check if we're on a 1st Phorm page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.url && tab.url.includes('1stphorm.com')) {
    currentUrl = tab.url;
    linkSection.style.display = 'block';
  }

  // Save affiliate code
  saveCodeButton.addEventListener('click', async function() {
    const code = affiliateCodeInput.value.trim();
    if (!code) {
      showMessage('Please enter an affiliate code', 'error');
      return;
    }

    await chrome.storage.sync.set({ affiliateCode: code });
    showMessage('Affiliate code saved!', 'success');
  });

  // Generate affiliate link
  generateLinkButton.addEventListener('click', function() {
    const code = affiliateCodeInput.value.trim();
    if (!code) {
      showMessage('Please enter and save your affiliate code first', 'error');
      return;
    }

    if (!currentUrl) {
      showMessage('Please navigate to a 1st Phorm product page', 'error');
      return;
    }

    // Generate the affiliate link
    const url = new URL(currentUrl);
    url.searchParams.set('a_aid', code);
    affiliateLink = url.toString();

    // Display the link
    affiliateLinkDiv.textContent = affiliateLink;
    shareButtons.style.display = 'grid';
  });

  // Share buttons
  document.getElementById('shareFacebook').addEventListener('click', function() {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateLink)}`;
    chrome.tabs.create({ url: shareUrl });
  });

  document.getElementById('shareTwitter').addEventListener('click', function() {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(affiliateLink)}&text=Check out this product from 1st Phorm!`;
    chrome.tabs.create({ url: shareUrl });
  });

  document.getElementById('shareInstagram').addEventListener('click', function() {
    // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
    navigator.clipboard.writeText(affiliateLink).then(function() {
      showMessage('Link copied! Paste it in your Instagram post', 'success');
    });
  });

  document.getElementById('copyLink').addEventListener('click', function() {
    navigator.clipboard.writeText(affiliateLink).then(function() {
      showMessage('Link copied to clipboard!', 'success');
    });
  });

  function showMessage(message, type) {
    saveMessage.textContent = message;
    saveMessage.className = type;
    setTimeout(() => {
      saveMessage.textContent = '';
      saveMessage.className = '';
    }, 3000);
  }
});
