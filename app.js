import { friendsData, galleryMemories, statistics } from './data.js';

let activeLetter = null;
let currentTypewriterToken = 0;
let currentSweetWordsToken = 0;
let isAudioPlaying = false;
let audioSynthCtx = null;
let audioInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  initHeartsCanvas();
  initCursorSparkles();
  renderStats();
  renderGallery();
  setupEventListeners();
  init4StageIntroFlow();
  initAudioPlayer();
});

/* ==========================================================
   ULTRA HD RADIAL HEART FIREWORKS BURST (50+ PARTICLES)
   ========================================================== */
function triggerHeartFireworksBurst(centerX, centerY) {
  const originX = centerX || window.innerWidth / 2;
  const originY = centerY || window.innerHeight / 2;
  const heartIcons = ['💖', '💕', '💗', '💓', '✨', '🌸', '⭐', '❤️'];

  for (let i = 0; i < 45; i++) {
    const particle = document.createElement('div');
    particle.className = 'heart-firework-particle';
    particle.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];

    const angle = (i / 45) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const velocity = Math.random() * 280 + 120;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1250);
  }
}

/* ==========================================================
   4-STAGE CINEMATIC INTERACTIVE STORY FLOW
   Sequence: 1. Kapsul -> 2. Kata-Kata Manis -> 3. 4 Foto Sejajar -> 4. Ketik Nama -> Surat
   ========================================================== */
function init4StageIntroFlow() {
  const giftIconBtn = document.getElementById('giftIconBtn');
  const introGiftBox = document.getElementById('introGiftBox');
  const sweetWordsStage = document.getElementById('sweetWordsStage');
  const sweetWordsText = document.getElementById('sweetWordsText');
  const nextToPhotosBtn = document.getElementById('nextToPhotosBtn');
  const photoParade = document.getElementById('photoParade');
  const paradePhotos = document.getElementById('paradePhotos');
  const nextToNameBtn = document.getElementById('nextToNameBtn');
  const introNameGate = document.getElementById('introNameGate');
  const introSearchForm = document.getElementById('introSearchForm');
  const introNameInput = document.getElementById('introNameInput');

  if (giftIconBtn && introGiftBox && sweetWordsStage) {
    giftIconBtn.addEventListener('click', (e) => {
      triggerHeartFireworksBurst(e.clientX, e.clientY);
      playChimeSound();
      
      introGiftBox.classList.add('hidden');
      sweetWordsStage.classList.remove('hidden');

      const emotionalText = "Dua bulan di BPS terasa cepet banget ya... Dari yang awalnya belum terlalu akrab, sampe akhirnya setiap hari diisi canda, tawa, dan perjuangan bareng. Makasih banyak ya udah jadi bagian paling manis di masa magang ini. Beneran bakal kangen banget sama momen-momen kecil yang kita lewatin bareng... Siap buat buka surat rahasiamu?";
      typeWriterSweetWords(sweetWordsText, emotionalText);
    });
  }

  if (nextToPhotosBtn && sweetWordsStage && photoParade) {
    nextToPhotosBtn.addEventListener('click', (e) => {
      triggerHeartFireworksBurst(e.clientX, e.clientY);
      sweetWordsStage.classList.add('hidden');
      photoParade.classList.remove('hidden');

      if (paradePhotos) {
        paradePhotos.innerHTML = galleryMemories.map(item => `
          <div class="parade-photo-item">
            <img src="${item.image}" alt="${item.title}">
            <span>${item.title}</span>
          </div>
        `).join('');
      }
    });
  }

  if (nextToNameBtn && photoParade && introNameGate) {
    nextToNameBtn.addEventListener('click', (e) => {
      triggerHeartFireworksBurst(e.clientX, e.clientY);
      photoParade.classList.add('hidden');
      introNameGate.classList.remove('hidden');
    });
  }

  if (introSearchForm && introNameInput) {
    const handleIntroUnlock = () => {
      const query = introNameInput.value.trim().toLowerCase();
      if (!query) return;

      // STRICT EXACT FULL-NAME MATCHING ONLY!
      const found = friendsData.find(f => 
        f.name.toLowerCase() === query ||
        f.fullName.toLowerCase() === query ||
        f.nicknames.some(nick => nick.toLowerCase() === query)
      );

      if (found) {
        triggerHeartFireworksBurst();
        document.getElementById('introStageOverlay')?.classList.remove('active');
        prepareEnvelopeOpeningStage(found);
      } else {
        showToast(`Oppss! Nama "${introNameInput.value}" belum tepat. Harus mengetik nama lengkap (Fachri, Ica, Cynthia, Nandra, atau Kalila) ya!`);
      }
    };

    introSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleIntroUnlock();
    });
  }
}

function typeWriterSweetWords(element, text) {
  if (!element) return;
  const myToken = ++currentSweetWordsToken;
  element.textContent = '';
  let index = 0;
  const speed = 20;

  function type() {
    if (myToken !== currentSweetWordsToken) return;

    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  type();
}

/* ==========================================================
   CURSOR SPARKLE TRAIL EFFECT
   ========================================================== */
function initCursorSparkles() {
  const sparkles = ['✨', '💖', '🌸', '💗', '⭐', '💕', '❤️'];
  let lastX = 0;
  let lastY = 0;

  window.addEventListener('mousemove', (e) => {
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist < 30) return;

    lastX = e.clientX;
    lastY = e.clientY;

    const sparkle = document.createElement('span');
    sparkle.className = 'cursor-sparkle';
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;

    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 900);
  });
}

/* ==========================================================
   FLOATING HEARTS & SAKURA CANVAS (CONTINUOUS RAIN FX)
   ========================================================== */
function initHeartsCanvas() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const hearts = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 18 + 8,
    speedY: Math.random() * 0.9 + 0.35,
    speedX: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.55 + 0.25,
    color: ['#ff477e', '#ff758f', '#ff8fa3', '#c084fc', '#f472b6', '#fbbf24'][Math.floor(Math.random() * 6)]
  }));

  function drawHeart(x, y, size, color, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    hearts.forEach(h => {
      h.y -= h.speedY;
      h.x += h.speedX;

      if (h.y < -30) {
        h.y = height + 20;
        h.x = Math.random() * width;
      }

      drawHeart(h.x, h.y, h.size, h.color, h.opacity);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================
   RENDER STATS & POLAROID GALLERY
   ========================================================== */
function renderStats() {
  const container = document.getElementById('statsGrid');
  if (!container) return;

  container.innerHTML = statistics.map(stat => `
    <div class="stat-card">
      <div class="stat-number">${stat.number}</div>
      <div class="stat-label">${stat.label}</div>
      <div class="stat-sub">${stat.sub}</div>
    </div>
  `).join('');
}

function renderGallery() {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  container.innerHTML = galleryMemories.map(item => `
    <div class="polaroid-card" data-id="${item.id}">
      <div class="polaroid-img-wrapper">
        <img 
          src="${item.image}" 
          alt="${item.title}" 
          loading="lazy" 
          data-prefix="${item.filePrefix}" 
          data-fallback="${item.fallback}"
          class="gallery-photo-img"
        >
      </div>
      <div class="polaroid-caption">
        <span class="polaroid-tag"><i class="fa-solid fa-tag"></i> ${item.tag}</span>
        <h3 class="polaroid-title">${item.title}</h3>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.gallery-photo-img').forEach(img => {
    img.addEventListener('error', function handleImgError() {
      const prefix = img.getAttribute('data-prefix');
      const fallback = img.getAttribute('data-fallback');
      const currentSrc = img.src;

      if (currentSrc.includes('.jpg')) {
        img.src = `${prefix}.png`;
      } else if (currentSrc.includes('.png')) {
        img.src = `${prefix}.jpeg`;
      } else if (currentSrc.includes('.jpeg')) {
        img.src = `${prefix}.webp`;
      } else {
        img.src = fallback;
      }
    });
  });

  container.querySelectorAll('.polaroid-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.getAttribute('data-id'));
      const item = galleryMemories.find(g => g.id === id);
      if (item) {
        const activeImg = card.querySelector('img').src;
        openLightbox({ ...item, currentActiveImg: activeImg });
      }
    });
  });
}

function openLightbox(item) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  const desc = document.getElementById('lightboxDesc');

  if (!modal) return;

  img.src = item.currentActiveImg || item.image;
  title.textContent = item.title;
  desc.textContent = item.desc;

  modal.classList.add('active');
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');
}

/* ==========================================================
   INTERACTIVE GIANT 3D ENVELOPE UNSEALING STAGE
   ========================================================== */
function setupEventListeners() {
  const searchForm = document.getElementById('searchForm');
  const nameInput = document.getElementById('nameInput');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const copyLetterBtn = document.getElementById('copyLetterBtn');
  const printCardBtn = document.getElementById('printCardBtn');

  if (searchForm) {
    const handleNameUnlock = () => {
      const query = nameInput.value.trim().toLowerCase();
      if (!query) return;

      // STRICT EXACT FULL-NAME MATCHING ONLY!
      const found = friendsData.find(f => 
        f.name.toLowerCase() === query ||
        f.fullName.toLowerCase() === query ||
        f.nicknames.some(nick => nick.toLowerCase() === query)
      );

      if (found) {
        triggerHeartFireworksBurst();
        prepareEnvelopeOpeningStage(found);
      } else {
        showToast(`Oppss! Nama "${nameInput.value}" belum tepat. Harus mengetik nama lengkap (Fachri, Ica, Cynthia, Nandra, atau Kalila) ya!`);
      }
    };

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleNameUnlock();
    });
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeLetterModal);
  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);

  document.getElementById('letterModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'letterModal') closeLetterModal();
  });

  document.getElementById('lightboxModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightboxModal') closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLetterModal();
      closeLightbox();
    }
  });

  if (copyLetterBtn) {
    copyLetterBtn.addEventListener('click', () => {
      if (!activeLetter) return;
      const textToCopy = `Surat dari Sobat BPS untuk ${activeLetter.name}:\n\n${activeLetter.letter}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Pesan ucapan berhasil disalin.');
      });
    });
  }

  if (printCardBtn) {
    printCardBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* INTERACTIVE CLICK-TO-UNSEAL GIANT ENVELOPE STAGE */
function prepareEnvelopeOpeningStage(friend) {
  const animOverlay = document.getElementById('envelopeAnimOverlay');
  const animEnvelopeObj = document.getElementById('animEnvelopeObj');
  const animReceiverName = document.getElementById('animReceiverName');
  const giantTarget = document.getElementById('giantEnvelopeClickTarget');

  if (!animOverlay || !animEnvelopeObj) {
    openLetterModal(friend);
    return;
  }

  animReceiverName.textContent = `Surat Rahasia untuk ${friend.name}`;
  animEnvelopeObj.classList.remove('open');
  animOverlay.classList.add('active');

  const unsealHandler = (e) => {
    giantTarget.removeEventListener('click', unsealHandler);
    triggerHeartFireworksBurst(e.clientX, e.clientY);
    playChimeSound();

    animEnvelopeObj.classList.add('open');

    setTimeout(() => {
      animOverlay.classList.remove('active');
      openLetterModal(friend);
    }, 1600);
  };

  giantTarget.addEventListener('click', unsealHandler);
}

function openLetterModal(friend) {
  activeLetter = friend;

  const modal = document.getElementById('letterModal');
  const modalName = document.getElementById('modalName');
  const modalLetterText = document.getElementById('modalLetterText');

  if (!modal) return;

  if (modalName) modalName.textContent = friend.name;
  if (modalLetterText) modalLetterText.textContent = '';

  modal.classList.add('active');

  typeWriterEffect(modalLetterText, friend.letter);
}

function closeLetterModal() {
  const modal = document.getElementById('letterModal');
  if (modal) modal.classList.remove('active');
  // Cancel typewriter by incrementing token
  currentTypewriterToken++;
}

/* BULLETPROOF TOKEN-BASED TYPEWRITER (NEVER SCRAMBLES OR OVERLAPS!) */
function typeWriterEffect(element, text) {
  if (!element) return;

  // Increment token so any previous running typewriter loop IMMEDIATELY ABORTS!
  const myToken = ++currentTypewriterToken;
  element.textContent = '';

  let index = 0;
  const speed = 14;

  function type() {
    // If a new typewriter was triggered, STOP IMMEDIATELY!
    if (myToken !== currentTypewriterToken) return;

    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  type();
}

/* ==========================================================
   SWEET DUAL-HARMONY ACOUSTIC FAREWELL SOUNDTRACK SYNTHESIZER
   Nostalgic, warm, 2-part acoustic chime harmony (Cmaj7 -> G -> Am7 -> Fmaj7)
   ========================================================== */
function playChimeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.45);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  } catch (e) {}
}

function initAudioPlayer() {
  const toggleBtn = document.getElementById('audioToggleBtn');
  const icon = document.getElementById('audioIcon');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
      stopAmbientMusic();
      icon.className = 'fa-solid fa-music';
      isAudioPlaying = false;
      showToast('Musik dihentikan.');
    } else {
      startAmbientMusic();
      icon.className = 'fa-solid fa-pause';
      isAudioPlaying = true;
      showToast('Memainkan Musik Kenangan... 🎵');
    }
  });
}

function startAmbientMusic() {
  try {
    audioSynthCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Rich 2-Note Harmonious Acoustic Chime Progression (Cmaj7 -> G -> Am7 -> Fmaj7)
    const harmonyMelody = [
      { base: 523.25, harmony: 659.25 }, // C5 + E5
      { base: 392.00, harmony: 587.33 }, // G4 + D5
      { base: 440.00, harmony: 523.25 }, // A4 + C5
      { base: 349.23, harmony: 440.00 }, // F4 + A4
      { base: 659.25, harmony: 783.99 }, // E5 + G5
      { base: 587.33, harmony: 698.46 }, // D5 + F5
      { base: 523.25, harmony: 659.25 }, // C5 + E5
      { base: 440.00, harmony: 587.33 }  // A4 + D5
    ];

    let noteIdx = 0;

    const playNextTone = () => {
      if (!isAudioPlaying || !audioSynthCtx) return;

      const pair = harmonyMelody[noteIdx % harmonyMelody.length];
      noteIdx++;

      [pair.base, pair.harmony].forEach((freq, idx) => {
        const osc = audioSynthCtx.createOscillator();
        const gain = audioSynthCtx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioSynthCtx.currentTime);

        const vol = idx === 0 ? 0.055 : 0.035;
        gain.gain.setValueAtTime(vol, audioSynthCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioSynthCtx.currentTime + 0.85);

        osc.connect(gain);
        gain.connect(audioSynthCtx.destination);

        osc.start();
        osc.stop(audioSynthCtx.currentTime + 0.9);
      });
    };

    playNextTone();
    audioInterval = setInterval(playNextTone, 380);
  } catch (e) {}
}

function stopAmbientMusic() {
  if (audioInterval) {
    clearInterval(audioInterval);
    audioInterval = null;
  }
  if (audioSynthCtx) {
    try { audioSynthCtx.close(); } catch (e) {}
    audioSynthCtx = null;
  }
}

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `${msg}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
