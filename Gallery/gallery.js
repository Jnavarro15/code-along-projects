function Gallery(gallery) {
  if (!gallery) {
    throw new Error('No Gallery Found');
  }
  // Select the elements we need
  const images = Array.from(gallery.querySelectorAll('img'));
  const modal = document.querySelector('.modal');
  const prevButton = modal.querySelector('.prev');
  const nextButton = modal.querySelector('.next');
  let currentImage;

  function openModal() {
    console.info('opening Modal...');
    // First check if the modal is already open
    if (modal.matches('.open')) {
      console.info('Modal already open');
      return; // Stop the function from running
    }
    modal.classList.add('open');

    // Event Listeners to be bound when we open the modal:
    window.addEventListener('keyup', handleKeyup);
    nextButton.addEventListener('click', showNextImage);
    prevButton.addEventListener('click', showPrevImage);
  }

  function closeModal() {
    modal.classList.remove('open');
    // Todo: add event listeners for clicks and keyboard...
    window.removeEventListener('keyup', handleKeyup);
    nextButton.removeEventListener('click', showNextImage);
    prevButton.removeEventListener('click', showPrevImage);
  }

  function handleClickOutside(e) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }

  function handleKeyup(e) {
    if (e.key === 'Escape') return closeModal();
    if (e.key === 'ArrowRight') return showNextImage();
    if (e.key === 'ArrowLeft') return showPrevImage();
  }

  function showPrevImage() {
    showImage(currentImage.previousElementSibling || gallery.lastElementChild);
  }

  function showNextImage() {
    showImage(currentImage.nextElementSibling || gallery.firstElementChild);
  }

  function showImage(el) {
    if (!el) {
      console.info('no image to show');
      return;
    }
    // update the modal with this info
    console.log(el);
    modal.querySelector('img').src = el.src;
    modal.querySelector('h2').textContent = el.title;
    modal.querySelector('figure p').textContent = el.dataset.description;
    currentImage = el;
    openModal();
  }

  // These are our Event listeners
  images.forEach(image =>
    image.addEventListener('click', e => showImage(e.currentTarget))
  );

  // loop over each image
  images.forEach(image => {
    // attach an event listener for each image
    image.addEventListener('keyup', e => {
      // when that is keyup'd check if it was enter
      if (e.key === 'Enter') {
        // if it was show that image
        showImage(e.currentTarget);
      }
    });
  });

  modal.addEventListener('click', handleClickOutside);
}

// Use it on the page

const gallery1 = Gallery(document.querySelector('.gallery1'));
const gallery2 = Gallery(document.querySelector('.gallery2'));
