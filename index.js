const loading = document.querySelector('.modal__overlay--loading');
const success = document.querySelector('.modal__overlay--success');
const form = document.getElementById('contact__form');
const submitButton = document.getElementById('contact__submit');
const modalOpenButton = document.querySelector('.mail__btn');
const modalCloseButton = document.querySelector('.modal__exit');
const themeToggle = document.querySelector('.theme-toggle');

function setTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
}

setTheme(localStorage.getItem('portfolio-theme') === 'dark');

themeToggle.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark-mode');
  setTheme(isDark);
  localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
});

if (window.emailjs) {
  window.emailjs.init({
    publicKey: '_EQjP9o0gbK0_y_HS'
  });
}

function showLoadingState() {
  loading.classList.add('modal__overlay--visible');
  success.classList.remove('modal__overlay--visible');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
}

function hideLoadingState() {
  loading.classList.remove('modal__overlay--visible');
  submitButton.disabled = false;
  submitButton.textContent = 'Send it my way!';
}

function contact(event) {
  event.preventDefault();

  if (!window.emailjs) {
    console.error('EmailJS is not loaded.');
    return;
  }

  showLoadingState();

  emailjs.sendForm('service_drfwb7k', 'template_l490n1m', form)
    .then(() => {
      hideLoadingState();
      success.classList.add('modal__overlay--visible');
      form.reset();
      setTimeout(() => success.classList.remove('modal__overlay--visible'), 3000);
    })
    .catch((error) => {
      hideLoadingState();
      console.error('EmailJS failed:', error);
      alert('Something went wrong while sending your message. Please try again.');
    });
}

if (form) {
  form.addEventListener('submit', contact);
}

function openModal(event) {
  event.preventDefault();
  event.stopPropagation();
  document.body.classList.add('modal--open');
}

function closeModal() {
  document.body.classList.remove('modal--open');
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
}

const contactLinks = [
  document.getElementById('nav-about'),
  document.getElementById('nav-contact'),
  document.getElementById('footer-contact')
];

function openContactModal(event) {
  event.preventDefault();

  const openModalAfterScroll = () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('scrollend', openModalAfterScroll);
    clearTimeout(scrollEndTimeout);
    clearTimeout(fallbackTimeout);
    document.body.classList.add('modal--open');
  };

  let scrollEndTimeout;
  let fallbackTimeout;
  const handleScroll = () => {
    clearTimeout(scrollEndTimeout);
    scrollEndTimeout = setTimeout(openModalAfterScroll, 150);
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.scrollY === 0) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.add('modal--open');
    return;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('scrollend', openModalAfterScroll);
  fallbackTimeout = setTimeout(openModalAfterScroll, 4000);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

modalOpenButton.addEventListener('click', openModal);
modalCloseButton.addEventListener('click', (event) => {
  event.stopPropagation();
  closeModal();
});
contactLinks.forEach((link) => {
  link.addEventListener('click', openContactModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('modal--open')) {
    closeModal();
  }
});

const shapeLayer = document.querySelector('.shape-layer');
const shapes = [...shapeLayer.querySelectorAll('.shape')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let pointerFrame;

function moveShapes(event) {
  if (reducedMotion.matches) return;

  cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => {
    shapes.forEach((shape, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const x = event.clientX / 20 * direction;
      const y = event.clientY / 20 * direction;
      shape.style.transform = `translate(${x}px, ${y}px) rotate(${x * 10}deg)`;
    });
  });
}

window.addEventListener('mousemove', moveShapes);