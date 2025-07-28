// Prevent browser from auto-restoring scroll on reload/navigation
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Setup carousel captions for all Bootstrap carousels on the page
function setupAllCarouselCaptions() {
  $('.carousel').each(function () {
    const carousel = $(this);
    const captionText = carousel.parent().find('.carousel-caption-below .caption-text');

    carousel.on('slide.bs.carousel', function (e) {
      const newCaption = $(e.relatedTarget).data('caption-text');
      if (newCaption) {
        captionText.text(newCaption);
      }
    });

    const activeSlide = carousel.find('.carousel-item.active');
    if (activeSlide.length) {
      const initialCaption = activeSlide.data('caption-text');
      captionText.text(initialCaption || '');
    }
  });
}

// Load page content dynamically into #content and update active nav link
function loadPage(page, link) {
  console.log('loadPage called with page:', page);
  return fetch(page)
    .then(response => {
      if (!response.ok) throw new Error('Page not found');
      return response.text();
    })
    .then(data => {
      document.getElementById('content').innerHTML = data;

      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      if (link) link.classList.add('active');

      // Initialize Bootstrap carousel and captions after content is loaded
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

// Called when nav or sidebar link is clicked — loads page, updates URL and scrolls if needed
function onNavLinkClick(page, link, anchor = '') {
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
  if (link) link.classList.add('active');

  // Scroll top immediately
  window.scrollTo({ top: 0, behavior: 'auto' });

  loadPage(page, link).then(() => {
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) {
          // Adjust scroll for fixed header height (change 80 if needed)
          const headerOffset = 80;
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  });

  // Update URL hash or clear it
  if (anchor) {
    history.replaceState(null, '', `#${anchor}`);
  } else {
    // Remove hash without reloading
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  return false; // Prevent default link behavior
}

// Handle hash changes and initial page load with hash
function handleHashChange() {
  const hash = window.location.hash.substring(1);
  console.log('handleHashChange called');
  console.log('Current hash:', hash);

  let pageFile;
  if (hash.startsWith('project')) {
    pageFile = 'data.html';
  } else if (hash.startsWith('proj')) {
    pageFile = 'software.html';
  } else {
    pageFile = 'software.html';
  }
  console.log('Determined pageFile:', pageFile);

  const navLinks = Array.from(document.querySelectorAll('a.nav-link'));
  const navLinkToActivate = navLinks.find(link => link.dataset.page === pageFile);

  loadPage(pageFile, navLinkToActivate).then(() => {
    if (hash) {
      setTimeout(() => {
        const target = document.getElementById(hash);
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  // On page load
  handleHashChange();

  // On hash changes later
  window.addEventListener('hashchange', () => {
    console.log('hashchange event fired');
    handleHashChange();
  });
});