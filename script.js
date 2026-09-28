/* ===================================================
   1. Audio Controller dengan Autoplay On First Click
   =================================================== */
const music = new Audio('audio.mp3');
music.loop = true;
let isAudioInitialized = false;

function showToast(msg) {
    const toast = document.getElementById('toastMessage');
    if (toast) {
        toast.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 4000);
    }
}

function updateAudioUI(state) {
    const headerLabels = document.querySelectorAll('.headerAudioLabel');
    const headerIcons = document.querySelectorAll('.headerAudioIcon');
    const headerPills = document.querySelectorAll('.headerTogglePill');

    if (state === 'playing') {
        headerLabels.forEach(el => el.innerText = 'Jeda Musik');
        headerIcons.forEach(el => el.className = 'headerAudioIcon fa-solid fa-power-off text-emerald-400 text-xs');
        headerPills.forEach(el => {
            el.innerText = 'ON';
            el.className = 'headerTogglePill font-bold text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 animate-pulse';
        });
    } else if (state === 'loading') {
        headerLabels.forEach(el => el.innerText = 'Memuat...');
        headerIcons.forEach(el => el.className = 'headerAudioIcon fa-solid fa-spinner animate-spin text-amber-300 text-xs');
        headerPills.forEach(el => {
            el.innerText = 'LOAD';
            el.className = 'headerTogglePill font-bold text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/80';
        });
    } else {
        headerLabels.forEach(el => el.innerText = 'Putar Musik');
        headerIcons.forEach(el => el.className = 'headerAudioIcon fa-solid fa-power-off text-rose-500 text-xs');
        headerPills.forEach(el => {
            el.innerText = 'OFF';
            el.className = 'headerTogglePill font-bold text-[10px] uppercase px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/80';
        });
    }
}

function playMusic() {
    updateAudioUI('loading');
    music.play().then(() => {
        updateAudioUI('playing');
        isAudioInitialized = true;
    }).catch(err => {
        console.warn('Autoplay terhalang browser:', err);
        updateAudioUI('paused');
    });
}

function toggleAudio() {
    if (music.paused) {
        playMusic();
        showToast('🎶 Musik sedang diputar...');
    } else {
        music.pause();
        updateAudioUI('paused');
        showToast('⏸️ Musik dihentikan.');
    }
}

// TRIK AUTOPLAY: Putar musik otomatis saat pengguna melakukan interaksi pertama (klik/sentuh) di layar
function handleFirstInteraction() {
    if (!isAudioInitialized && music.paused) {
        playMusic();
        // Hapus pemanggil setelah interaksi pertama berhasil
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
    }
}

document.addEventListener('click', handleFirstInteraction);
document.addEventListener('touchstart', handleFirstInteraction);
document.addEventListener('keydown', handleFirstInteraction);

/* ===================================================
   2. Photo Modal Controller
   =================================================== */
function openPhotoModal(imgSrc, caption) {
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    
    if (modal && modalImg && modalCaption) {
        modalImg.src = imgSrc;
        modalCaption.innerText = caption;
        modal.classList.remove('hidden');
    }
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

/* ===================================================
   3. Celebration & Confetti Trigger
   =================================================== */
function triggerCelebration() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6, x: 0.2 },
            colors: ['#f43f5e', '#fbbf24', '#e2e8f0', '#9333ea']
        });
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6, x: 0.8 },
            colors: ['#f43f5e', '#fbbf24', '#e2e8f0', '#9333ea']
        });
        showToast('✨ Happy Birthday Bestie! ✨');
    } else {
        showToast('🎉 Selamat Ulang Tahun!');
    }
}

/* ===================================================
   4. Background Ambient Sparkle Animation
   =================================================== */
const canvas = document.getElementById('sparkleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.alpha = Math.random();
            this.speedAlpha = 0.005 + Math.random() * 0.01;
            this.dir = Math.random() > 0.5 ? 1 : -1;
        }
        update() {
            this.alpha += this.speedAlpha * this.dir;
            if (this.alpha >= 1 || this.alpha <= 0) {
                this.dir *= -1;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(243, 232, 238, ${Math.max(0, this.alpha * 0.5)})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
    }

    function animateSparkles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateSparkles);
    }
    animateSparkles();
}
