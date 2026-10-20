const forwardVideo = document.getElementById('heroVideo');
const reverseVideo = document.getElementById('reverseVideo');
const videos = [forwardVideo, reverseVideo];
const toggle = document.getElementById('videoToggle');
const icon = document.getElementById('videoIcon');
const label = document.getElementById('videoLabel');
let activeVideo = forwardVideo;
document.getElementById('year').textContent = new Date().getFullYear();

// Autoplay must stay muted for modern browser compatibility.
videos.forEach(video => { video.muted = true; });

function updateVideoButton() {
  const paused = activeVideo.paused;
  icon.textContent = paused ? '▶' : 'Ⅱ';
  label.textContent = paused ? 'PLAY MOTION' : 'PAUSE MOTION';
  toggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
  toggle.setAttribute('aria-pressed', String(paused));
}

toggle.addEventListener('click', () => {
  if (activeVideo.paused) activeVideo.play().catch(() => {});
  else activeVideo.pause();
  updateVideoButton();
});

videos.forEach(video => {
  video.addEventListener('play', () => {
    if (video === activeVideo) updateVideoButton();
  });
  video.addEventListener('pause', () => {
    if (video === activeVideo) updateVideoButton();
  });
});

async function switchVideo(current, next) {
  if (activeVideo !== current) return;

  next.currentTime = 0;

  try {
    await next.play();
    activeVideo = next;
    next.classList.add('is-active');
    current.classList.remove('is-active');
    current.pause();
    updateVideoButton();
  } catch (error) {
    console.error('Video playback failed:', error);
    updateVideoButton();
  }
}

forwardVideo.addEventListener('ended', () => switchVideo(forwardVideo, reverseVideo));
reverseVideo.addEventListener('ended', () => switchVideo(reverseVideo, forwardVideo));

// Reduced motion visitors can opt into playback with the control.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  forwardVideo.pause();
  updateVideoButton();
} else {
  forwardVideo.play().catch(updateVideoButton);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.11 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const mouseLight = document.querySelector('.mouse-light');
if (window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    mouseLight.style.left = `${e.clientX}px`;
    mouseLight.style.top = `${e.clientY}px`;
  }, { passive: true });
}

