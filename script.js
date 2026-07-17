const body = document.body;
const topbar = document.getElementById('topbar');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.topbar nav');

window.addEventListener('load', () => body.classList.add('loaded'));

const updateHeader = () => topbar?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('show'));
}

document.querySelectorAll('video').forEach((video) => {
  video.addEventListener('play', () => {
    document.querySelectorAll('video').forEach((other) => {
      if (other !== video && !other.paused) other.pause();
    });
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
