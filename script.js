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

const videos = [...document.querySelectorAll('.video-card video')];

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
};

videos.forEach((video, index) => {
  const player = document.createElement('div');
  player.className = 'video-player';
  video.parentNode.insertBefore(player, video);
  player.appendChild(video);
  video.controls = false;

  player.insertAdjacentHTML('beforeend', `
    <button class="player-overlay" type="button" aria-label="Αναπαραγωγή βίντεο ${index + 1}"></button>
    <div class="player-controls">
      <button class="player-button player-toggle" type="button" aria-label="Αναπαραγωγή"></button>
      <input class="player-progress" type="range" min="0" max="1000" value="0" aria-label="Πρόοδος βίντεο" />
      <output class="player-time">0:00 / 0:00</output>
      <button class="player-button player-sound" type="button" aria-label="Σίγαση">
        <svg class="sound-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="M17 9a4 4 0 0 1 0 6"/><path d="M19 6a8 8 0 0 1 0 12"/></svg>
        <svg class="sound-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="m18 9 4 4m0-4-4 4"/></svg>
      </button>
    </div>
  `);

  const overlay = player.querySelector('.player-overlay');
  const toggle = player.querySelector('.player-toggle');
  const progress = player.querySelector('.player-progress');
  const time = player.querySelector('.player-time');
  const sound = player.querySelector('.player-sound');

  const togglePlayback = () => video.paused ? video.play() : video.pause();

  const updateProgress = () => {
    const ratio = video.duration ? video.currentTime / video.duration : 0;
    const value = Math.round(ratio * 1000);
    progress.value = String(value);
    progress.style.setProperty('--progress', `${ratio * 100}%`);
    progress.setAttribute('aria-valuetext', `${formatTime(video.currentTime)} από ${formatTime(video.duration)}`);
    time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  };

  overlay.addEventListener('click', togglePlayback);
  toggle.addEventListener('click', togglePlayback);
  video.addEventListener('click', togglePlayback);

  video.addEventListener('play', () => {
    videos.forEach((other) => {
      if (other !== video && !other.paused) other.pause();
    });
    player.classList.add('is-playing');
    toggle.setAttribute('aria-label', 'Παύση');
  });

  video.addEventListener('pause', () => {
    player.classList.remove('is-playing');
    toggle.setAttribute('aria-label', 'Αναπαραγωγή');
  });

  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('loadedmetadata', updateProgress);
  video.addEventListener('durationchange', updateProgress);

  progress.addEventListener('input', () => {
    if (video.duration) video.currentTime = (Number(progress.value) / 1000) * video.duration;
  });

  sound.addEventListener('click', () => {
    video.muted = !video.muted;
    player.classList.toggle('is-muted', video.muted);
    sound.setAttribute('aria-label', video.muted ? 'Ενεργοποίηση ήχου' : 'Σίγαση');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
