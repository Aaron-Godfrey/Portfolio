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
  fetch(page)
    .then(response => response.text())
    .then(data => {
      // Update content of the #content div with the fetched page data
      document.getElementById('content').innerHTML = data;

      // Remove 'active' class from all links
      let navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => link.classList.remove('active'));

      // Add 'active' class to the clicked link
      link.classList.add('active');

      // Re-initialize carousel caption listeners
      setTimeout(() => {
        setupAllCarouselCaptions();  // Re-initialize for all carousels
      }, 100); // slight delay ensures DOM is fully rendered
    })
    .catch(error => {
      console.error('Error loading page:', error);
      // Optionally, display an error message or fallback content
    });
}

// Load About Me by default
window.onload = () => {
  const firstNavLink = document.querySelector('a.nav-link');  // Get the first nav link (About Me) !!! Changed to software
  if (firstNavLink) {
    loadPage('software.html', firstNavLink);  // Load the default page (about.html) !!! Changed to software
  }
};

