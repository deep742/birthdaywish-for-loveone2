// Rima's dreamy birthday website. Password: RIMA
const $ = (id) => document.getElementById(id);
const particleLayer = $('particleLayer');
let particlesStarted = false;
let confettiBusy = false;

function unlockWebsite() {
  if ($('password').value.trim().toUpperCase() !== 'RIMA') {
    $('error').textContent = 'Not quite, Baby. Try again ♡';
    $('password').focus();
    return;
  }
  $('error').textContent = '';
  $('lockScreen').classList.add('hidden');
  $('introScreen').classList.remove('hidden');
  startParticles();
}
$('unlockButton').addEventListener('click', unlockWebsite);
$('password').addEventListener('keydown', e => {
  if (e.key === 'Enter') unlockWebsite();
});

$('openEnvelope').addEventListener('click', () => {
  const button = $('openEnvelope');
  button.classList.add('open');
  button.querySelector('.tap-note').textContent = 'A little magic is on its way...';
  setTimeout(() => {
    $('introScreen').classList.add('hidden');
    $('mainWebsite').classList.remove('hidden');
    window.scrollTo({top: 0, behavior: 'instant'});
    observeReveals();
  }, 900);
});

function startParticles() {
  if (particlesStarted) return;
  particlesStarted = true;
  setInterval(() => makeParticle('heart'), 850);
  setInterval(() => makeParticle('petal'), 1600);
}
function makeParticle(type) {
  const item = document.createElement('span');
  item.className = type === 'heart' ? 'float-item' : 'fall-item';
  if (type === 'heart') {
    item.textContent = ['♡','♥','💕','✧','✨'][Math.floor(Math.random()*5)];
    item.style.left = Math.random()*100 + 'vw';
    item.style.fontSize = (14 + Math.random()*19) + 'px';
    item.style.color = ['#e69bc1','#c5a5df','#f1b6cf'][Math.floor(Math.random()*3)];
    item.style.animationDuration = (8 + Math.random()*6) + 's';
  } else {
    item.textContent = ['🌸','✿','❀'][Math.floor(Math.random()*3)];
    item.style.left = Math.random()*100 + 'vw';
    item.style.fontSize = (13 + Math.random()*12) + 'px';
    item.style.animationDuration = (8 + Math.random()*6) + 's';
  }
  particleLayer.appendChild(item);
  setTimeout(() => item.remove(), 15000);
}

// Scroll-in reveal effects
function observeReveals() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  elements.forEach(el => observer.observe(el));
}

// Gallery lightbox
document.querySelectorAll('.photo-card').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    if (!img || !img.complete || img.naturalWidth === 0) {
      showToast('Add your photo in the photos folder first ♡');
      return;
    }
    $('lightboxImage').src = card.dataset.photo;
    $('lightboxCaption').textContent = card.dataset.caption;
    $('lightbox').classList.remove('hidden');
  });
});
function closeLightbox() {
  $('lightbox').classList.add('hidden');
  $('lightboxImage').src = '';
}
$('lightboxClose').addEventListener('click', closeLightbox);
$('lightbox').addEventListener('click', e => {
  if (e.target === $('lightbox')) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// Love letter open / close
$('letterToggle').addEventListener('click', () => {
  const paper = $('letterPaper');
  const opening = paper.classList.contains('hidden');
  paper.classList.toggle('hidden');
  $('letterToggle').setAttribute('aria-expanded', String(opening));
  $('letterToggle').querySelector('.letter-open-hint').textContent =
    opening ? 'Tap to fold the letter ✧' : 'Tap to open ✧';
  if (opening) setTimeout(() => paper.scrollIntoView({behavior:'smooth',block:'center'}), 100);
});

// Music toggle. Browser music playback requires a user click.
const music = $('bgMusic');
$('musicButton').addEventListener('click', async () => {
  if (music.paused) {
    try {
      await music.play();
      $('musicButton').textContent = '♫';
      $('musicButton').setAttribute('aria-label','Pause music');
    } catch {
      showToast('Put your MP3 in music/love-song.mp3 ♡');
    }
  } else {
    music.pause();
    $('musicButton').textContent = '♪';
    $('musicButton').setAttribute('aria-label','Play music');
  }
});

// Blow candle
$('blowButton').addEventListener('click', () => {
  $('flame').classList.add('out');
  $('wishMessage').textContent = 'May every beautiful wish find its way to you, Rima! ✨❤️';
  $('blowButton').textContent = 'Wish sent into the universe ♡';
  $('blowButton').disabled = true;
  launchConfetti(90);
});

// Final surprise
$('finalSurprise').addEventListener('click', () => {
  launchConfetti(130);
  showToast('You are loved more than words can say, Baby ♡');
});

// Confetti
function launchConfetti(count = 70) {
  if (confettiBusy) return;
  confettiBusy = true;
  const symbols = ['❤️','💗','✨','🌸','💕','✦'];
  let finished = 0;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    piece.style.position = 'fixed';
    piece.style.left = Math.random()*100 + 'vw';
    piece.style.top = '-35px';
    piece.style.fontSize = (14 + Math.random()*16) + 'px';
    piece.style.zIndex = '80';
    piece.style.pointerEvents = 'none';
    document.body.appendChild(piece);
    const duration = 2200 + Math.random()*2200;
    piece.animate([
      {transform:'translateY(0) rotate(0deg)',opacity:1},
      {transform:`translateY(110vh) rotate(${Math.random()*700}deg)`,opacity:0}
    ], {duration,easing:'ease-in'});
    setTimeout(() => {
      piece.remove();
      finished++;
      if (finished === count) confettiBusy = false;
    }, duration);
  }
}

let toastTimer;
function showToast(message) {
  $('toast').textContent = message;
  $('toast').classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').classList.add('hidden'), 3000);
}

// Reveal animations are attached when the main page becomes visible.
