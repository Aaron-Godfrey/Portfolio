
// Setup carousel captions for all Bootstrap carousels on the page
function setupAllCarouselCaptions() {
  $('.carousel').each(function () {
    const carousel = $(this);
    const captionText = carousel.parent().find('.carousel-caption-below .caption-text');

    // Update caption on slide change
    carousel.on('slide.bs.carousel', function (e) {
      const newCaption = $(e.relatedTarget).data('caption-text');
      if (newCaption) {
        captionText.text(newCaption);
      }
    });

    // Set initial caption
    const activeSlide = carousel.find('.carousel-item.active');
    if (activeSlide.length) {
      const initialCaption = activeSlide.data('caption-text');
      captionText.text(initialCaption || '');
    }
  });
}

// Load page content dynamically into #content and update active nav link
function loadPage(page, link) {
  return fetch(page)
    .then(response => {
      if (!response.ok) throw new Error('Page not found');
      return response.text();
    })
    .then(data => {
      document.getElementById('content').innerHTML = data;

      // Remove 'active' from all nav links
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

      // Add 'active' to the clicked/loaded link
      if (link) link.classList.add('active');

      // Initialize Bootstrap carousels and captions after content is loaded
      setTimeout(() => {
        $('.carousel').carousel();
        setupAllCarouselCaptions();
      }, 100);
    })
    .catch(error => {
      console.error('Error loading page:', error);
      document.getElementById('content').innerHTML = '<p>Sorry, content could not be loaded.</p>';
    });
}

// Handle changes in URL hash to load appropriate page and scroll
function handleHashChange() {
  const hash = window.location.hash.substring(1); // remove '#'

  // Determine which page to load based on hash prefix
  let pageFile;
  if (hash.startsWith('project')) {
    pageFile = 'data.html';
  } else if (hash.startsWith('proj')) {
    pageFile = 'software.html';
  } else {
    // Default page
    pageFile = 'software.html';
  }

  // Find nav link with matching data-page attribute
  const navLinkToActivate = Array.from(document.querySelectorAll('a.nav-link'))
    .find(link => link.dataset.page === pageFile);

  // Load the page, then scroll to the element with the hash ID
  loadPage(pageFile, navLinkToActivate).then(() => {
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// Called when nav link is clicked — loads page, updates active state, scrolls if needed
function onNavLinkClick(page, link, anchor = '') {
  // Update active class on nav links
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
  link.classList.add('active');

  // Scroll to top immediately before loading
  window.scrollTo({ top: 0, behavior: 'auto' });

  // Load page content
  loadPage(page, link).then(() => {
    // Scroll to anchor if provided
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  });

  // Update URL hash without jumping
  history.replaceState(null, '', anchor ? `#${anchor}` : '');

  return false; // Prevent default link behavior
}

// Listen for page load and hash changes
window.addEventListener('load', handleHashChange);
window.addEventListener('hashchange', handleHashChange);

