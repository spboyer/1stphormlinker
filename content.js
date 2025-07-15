// content.js - Runs on 1stphorm.com pages to add quick link functionality

(function() {
  'use strict';

  let affiliateCode = '';
  let quickLinkButton = null;

  // Load affiliate code from storage
  chrome.storage.sync.get(['affiliateCode'], function(result) {
    if (result.affiliateCode) {
      affiliateCode = result.affiliateCode;
      createQuickLinkButton();
    }
  });

  // Listen for storage changes
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.affiliateCode) {
      affiliateCode = changes.affiliateCode.newValue || '';
      if (affiliateCode && !quickLinkButton) {
        createQuickLinkButton();
      } else if (!affiliateCode && quickLinkButton) {
        removeQuickLinkButton();
      }
    }
  });

  function createQuickLinkButton() {
    // Only create if we're on a product page and don't already have a button
    if (quickLinkButton || !isProductPage()) {
      return;
    }

    // Create the floating quick link button
    quickLinkButton = document.createElement('div');
    quickLinkButton.id = 'phorm-quick-link';
    quickLinkButton.innerHTML = `
      <div class="phorm-button-content">
        <span class="phorm-icon">🔗</span>
        <span class="phorm-text">Quick Share</span>
      </div>
      <div class="phorm-dropdown" id="phorm-dropdown">
        <button class="phorm-share-btn" data-platform="facebook">📘 Facebook</button>
        <button class="phorm-share-btn" data-platform="twitter">🐦 Twitter</button>
        <button class="phorm-share-btn" data-platform="instagram">📷 Instagram</button>
        <button class="phorm-share-btn" data-platform="copy">📋 Copy Link</button>
      </div>
    `;

    document.body.appendChild(quickLinkButton);

    // Add click event to toggle dropdown
    quickLinkButton.addEventListener('click', function(e) {
      e.stopPropagation();
      const dropdown = document.getElementById('phorm-dropdown');
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Add click events to share buttons
    const shareButtons = quickLinkButton.querySelectorAll('.phorm-share-btn');
    shareButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        const platform = this.getAttribute('data-platform');
        handleShare(platform);
        document.getElementById('phorm-dropdown').style.display = 'none';
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      const dropdown = document.getElementById('phorm-dropdown');
      if (dropdown) {
        dropdown.style.display = 'none';
      }
    });
  }

  function removeQuickLinkButton() {
    if (quickLinkButton) {
      quickLinkButton.remove();
      quickLinkButton = null;
    }
  }

  function isProductPage() {
    // Check if we're on a product page (contains /products/ in URL)
    return window.location.pathname.includes('/products/');
  }

  function generateAffiliateLink() {
    const url = new URL(window.location.href);
    url.searchParams.set('a_aid', affiliateCode);
    return url.toString();
  }

  function handleShare(platform) {
    const affiliateLink = generateAffiliateLink();
    
    switch (platform) {
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateLink)}`;
        window.open(facebookUrl, '_blank');
        break;
      
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(affiliateLink)}&text=Check out this product from 1st Phorm!`;
        window.open(twitterUrl, '_blank');
        break;
      
      case 'instagram':
        // Copy to clipboard for Instagram
        navigator.clipboard.writeText(affiliateLink).then(function() {
          showNotification('Link copied! Paste it in your Instagram post');
        });
        break;
      
      case 'copy':
        navigator.clipboard.writeText(affiliateLink).then(function() {
          showNotification('Affiliate link copied to clipboard!');
        });
        break;
    }
  }

  function showNotification(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'phorm-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Hide and remove notification
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Initialize when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (affiliateCode) {
        createQuickLinkButton();
      }
    });
  } else {
    if (affiliateCode) {
      createQuickLinkButton();
    }
  }

  // Handle navigation changes (for single-page applications)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      removeQuickLinkButton();
      if (affiliateCode && isProductPage()) {
        setTimeout(createQuickLinkButton, 1000); // Delay for page content to load
      }
    }
  }).observe(document, { subtree: true, childList: true });

})();
