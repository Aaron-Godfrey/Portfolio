// Attach carousel caption update for all carousels
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

// Load pages dynamically and scroll to section if hash exists
function loadPage(pageWithHash, link = null) {
  const [page, hash] = pageWithHash.split('#');

  fetch(page)
    .then(response => response.text())
    .then(data => {
      document.getElementById('content').innerHTML = data;

      // Remove 'active' class from all nav links
      let navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(l => l.classList.remove('active'));
      if (link) link.classList.add('active');

      // Wait for content to render, then scroll to anchor if needed
      setTimeout(() => {
        setupAllCarouselCaptions();
        if (hash) {
          const target = document.getElementById(hash);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    })
    .catch(error => {
      console.error('Error loading page:', error);
    });
}

// Load default section (with support for hash)
window.onload = () => {
  const hash = window.location.hash; // ex: #project2
  const firstLink = document.querySelector('a.nav-link');

  if (hash) {
    loadPage('software.html' + hash);  // Load with anchor
  } else if (firstLink) {
    loadPage('software.html', firstLink);
  }
};
