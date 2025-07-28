// Attach carousel caption update for all carousels
function setupAllCarouselCaptions() {
  $('.carousel').each(function () {  // Select all carousel elements on the page
    const carousel = $(this);  // Current carousel
    const captionText = carousel.parent().find('.carousel-caption-below .caption-text');

    // Update the caption when the carousel slide changes
    carousel.on('slide.bs.carousel', function (e) {
      const newCaption = $(e.relatedTarget).data('caption-text');
      if (newCaption) {
        captionText.text(newCaption);
      }
    });

    // Set initial caption (in case it's not slide-triggered yet)
    const activeSlide = carousel.find('.carousel-item.active');
    if (activeSlide.length) {
      const initialCaption = activeSlide.data('caption-text');
      captionText.text(initialCaption || '');  // Use empty string if no caption is found
    }
  });
}

// Load pages dynamically and add 'active' class to clicked link
function loadPage(page, link) {
  return fetch(page)
    .then(response => {
      if (!response.ok) throw new Error('Page not found');
      return response.text();
    })
    .then(data => {
      // Update content of the #content div with the fetched page data
      document.getElementById('content').innerHTML = data;

      // Remove 'active' class from all links
      let navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(l => l.classList.remove('active'));

      // Add 'active' class to the clicked link
      if (link) link.classList.add('active');

      // Re-initialize carousel caption listeners after slight delay to ensure DOM is ready
      setTimeout(() => {
        setupAllCarouselCaptions();
      }, 100);
    })
    .catch(error => {
      console.error('Error loading page:', error);
      document.getElementById('content').innerHTML = '<p>Sorry, content could not be loaded.</p>';
    });
}

function handleHashChange() {
  const hash = window.location.hash.substring(1); // e.g., "proj1" or "project1"

  // If no hash, load default page and highlight first nav link
  if (!hash) {
    const firstNavLink = document.querySelector('a.nav-link');
    if (firstNavLink) {
      loadPage('software.html', firstNavLink);
    }
    return;
  }

  // Map hash prefixes or values to page files
  let pageFile;
  if (hash.startsWith('project')) {
    pageFile = 'data.html';
  } else if (hash.startsWith('proj')) {
    pageFile = 'software.html';
  } else {
    // Fallback default
    pageFile = 'software.html';
  }

  // Find nav link whose href matches the page file (assuming nav links use href="software.html" etc.)
  const navLinkToActivate = Array.from(document.querySelectorAll('a.nav-link'))
    .find(link => link.getAttribute('href') === pageFile);

  // Load the page, then scroll to the element with the hash ID inside the loaded content
  loadPage(pageFile, navLinkToActivate).then(() => {
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// Listen for page load and hash changes
window.addEventListener('load', handleHashChange);
window.addEventListener('hashchange', handleHashChange);