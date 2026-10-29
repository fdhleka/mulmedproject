// ==========================================================================
// AuraLens - Modern Parallax Engine & Interactive Controller
// Features: Silky Momentum Lerp, Dynamic Spotlight, 3D Tilt, Vimeo API
// ==========================================================================

// 1. Initialize Lucide Icons
lucide.createIcons();

// Elements Cache
const orb1 = document.getElementById('bg-orb-1');
const orb2 = document.getElementById('bg-orb-2');
const orb3 = document.getElementById('bg-orb-3');
const bgGrid = document.getElementById('parallax-bg-grid');
const badge1 = document.getElementById('float-badge-1');
const badge2 = document.getElementById('float-badge-2');
const heroContent = document.getElementById('hero-content');
const scrollProgressBar = document.getElementById('scroll-progress');

// Physics State (Lerp for natural, organic momentum)
let targetMouseX = 0;
let targetMouseY = 0;
let currentMouseX = 0;
let currentMouseY = 0;

let targetScrollY = window.scrollY;
let currentScrollY = window.scrollY;

// Mouse Movement Listener (Normalized -0.5 to 0.5)
window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) - 0.5;
    targetMouseY = (e.clientY / window.innerHeight) - 0.5;
}, { passive: true });

// Scroll Listener
window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
}, { passive: true });

// Linear Interpolation Helper
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Main Render Loop (60/120Hz Hardware Synchronized)
function renderParallax() {
    // Smooth damping interpolation (0.08 = silky organic weight)
    currentMouseX = lerp(currentMouseX, targetMouseX, 0.08);
    currentMouseY = lerp(currentMouseY, targetMouseY, 0.08);
    currentScrollY = lerp(currentScrollY, targetScrollY, 0.1);

    // 1. Background Grid Subtle Translation
    if (bgGrid) {
        bgGrid.style.transform = `translate3d(0, ${currentScrollY * 0.12}px, 0)`;
    }

    // 2. Ambient Studio Lighting Orbs (Natural multi-plane motion)
    if (orb1) {
        const x = currentMouseX * 45;
        const y = currentScrollY * 0.2 + currentMouseY * 35;
        orb1.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    }
    if (orb2) {
        const x = currentMouseX * -60;
        const y = currentScrollY * -0.15 + currentMouseY * -45;
        orb2.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    }
    if (orb3) {
        const x = currentMouseX * 35;
        const y = currentScrollY * 0.18 + currentMouseY * 25;
        orb3.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    }

    // 3. Floating Hero Depth Badges
    if (badge1) {
        const bx1 = currentMouseX * -30;
        const by1 = currentScrollY * -0.25 + currentMouseY * -25;
        badge1.style.transform = `translate3d(${bx1.toFixed(2)}px, ${by1.toFixed(2)}px, 0)`;
    }
    if (badge2) {
        const bx2 = currentMouseX * 40;
        const by2 = currentScrollY * -0.35 + currentMouseY * 35;
        badge2.style.transform = `translate3d(${bx2.toFixed(2)}px, ${by2.toFixed(2)}px, 0)`;
    }

    // 4. Hero Content Fade & Parallax
    if (heroContent && currentScrollY < 800) {
        const contentY = currentScrollY * 0.22;
        const opacity = Math.max(0, 1 - (currentScrollY / 650));
        heroContent.style.transform = `translate3d(0, ${contentY.toFixed(2)}px, 0)`;
        heroContent.style.opacity = opacity.toFixed(3);
    }

    // 5. Scroll Progress Bar Fallback (for older browsers without CSS animation-timeline)
    if (scrollProgressBar && !CSS.supports('animation-timeline', 'scroll()')) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll > 0) {
            const progress = Math.min(1, Math.max(0, targetScrollY / maxScroll));
            scrollProgressBar.style.transform = `scaleX(${progress})`;
        }
    }

    requestAnimationFrame(renderParallax);
}

// Start Parallax Engine
requestAnimationFrame(renderParallax);


// ==========================================================================
// 2. Dynamic Spotlight & 3D Card Physics
// ==========================================================================
const cards = document.querySelectorAll('.cinematic-card');

cards.forEach((card) => {
    // Dynamic Spotlight coordinate tracking
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // If card also has .tilt-card class, calculate 3D tilt
        if (card.classList.contains('tilt-card')) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7; // Natural 7 degree max tilt
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        if (card.classList.contains('tilt-card')) {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
    });
});


// ==========================================================================
// 3. Dynamic Vimeo Embed Player Controller
// ==========================================================================
const vimeoInput = document.getElementById('vimeo-input-url');
const updateVimeoBtn = document.getElementById('update-vimeo-btn');
const vimeoIframe = document.getElementById('vimeo-embed-frame');

if (updateVimeoBtn && vimeoInput && vimeoIframe) {
    updateVimeoBtn.addEventListener('click', () => {
        const rawUrl = vimeoInput.value.trim();
        if (!rawUrl) return;

        // Parse Vimeo URL or raw numeric ID
        const match = rawUrl.match(/(?:vimeo\.com\/|video\/)(\d+)/);
        const videoId = match ? match[1] : (rawUrl.match(/^\d+$/) ? rawUrl : null);

        if (videoId) {
            vimeoIframe.src = `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&autoplay=1`;
            vimeoInput.value = '';

            // Visual Success State
            const originalHTML = updateVimeoBtn.innerHTML;
            updateVimeoBtn.innerHTML = `
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-950"></i>
                <span class="text-emerald-950">Berhasil Diperbarui!</span>
            `;
            updateVimeoBtn.classList.replace('bg-amber-500', 'bg-emerald-400');
            lucide.createIcons();

            setTimeout(() => {
                updateVimeoBtn.innerHTML = originalHTML;
                updateVimeoBtn.classList.replace('bg-emerald-400', 'bg-amber-500');
                lucide.createIcons();
            }, 2500);
        } else {
            alert('Format URL Vimeo belum sesuai. Masukkan URL Vimeo yang valid (contoh: https://vimeo.com/76979871 atau ID numerik).');
        }
    });

    // Support Enter Key in Input
    vimeoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            updateVimeoBtn.click();
        }
    });
}
