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
const floatQuote = document.getElementById('float-quote');
const heroContent = document.getElementById('hero-content');
const heroSection = document.getElementById('hero');
const fog1 = document.getElementById('parallax-fog-1');
const fog2 = document.getElementById('parallax-fog-2');
const heroRainPlayer = document.getElementById('hero-rain-player');
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

    // 3. Multi-plane Melancholic Mist / Fog Layers
    if (fog1) {
        const fx1 = currentMouseX * 55;
        const fy1 = currentScrollY * 0.12 + currentMouseY * 35;
        fog1.style.transform = `translate3d(${fx1.toFixed(2)}px, ${fy1.toFixed(2)}px, 0)`;
    }
    if (fog2) {
        const fx2 = currentMouseX * -45;
        const fy2 = currentScrollY * -0.09 + currentMouseY * -30;
        fog2.style.transform = `translate3d(${fx2.toFixed(2)}px, ${fy2.toFixed(2)}px, 0)`;
    }

    // 4. Subtle Anime Rain Video 3D Parallax Depth
    if (heroRainPlayer) {
        const vx = currentMouseX * -15;
        const vy = currentScrollY * 0.08 + currentMouseY * -12;
        heroRainPlayer.style.transform = `scale(1.05) translate3d(${vx.toFixed(2)}px, ${vy.toFixed(2)}px, 0)`;
    }

    // 5. Floating Hero Depth Badges & Melancholic Quote
    if (badge1) {
        const bx1 = currentMouseX * -32;
        const by1 = currentScrollY * -0.25 + currentMouseY * -25;
        badge1.style.transform = `translate3d(${bx1.toFixed(2)}px, ${by1.toFixed(2)}px, 0)`;
    }
    if (badge2) {
        const bx2 = currentMouseX * 38;
        const by2 = currentScrollY * -0.35 + currentMouseY * 35;
        badge2.style.transform = `translate3d(${bx2.toFixed(2)}px, ${by2.toFixed(2)}px, 0)`;
    }
    if (floatQuote) {
        const qx = currentMouseX * -22;
        const qy = currentScrollY * -0.16 + currentMouseY * -18;
        floatQuote.style.transform = `translate3d(${qx.toFixed(2)}px, ${qy.toFixed(2)}px, 0)`;
    }

    // 6. Interactive Streetlight Beam Parallax Coordinates
    if (heroSection) {
        const mouseScreenX = ((currentMouseX + 0.5) * 100).toFixed(1);
        const mouseScreenY = ((currentMouseY + 0.5) * 100).toFixed(1);
        heroSection.style.setProperty('--mouse-screen-x', `${mouseScreenX}%`);
        heroSection.style.setProperty('--mouse-screen-y', `${mouseScreenY}%`);
    }

    // 7. Hero Content Fade & Parallax
    if (heroContent && currentScrollY < 850) {
        const contentY = currentScrollY * 0.22;
        const opacity = Math.max(0, 1 - (currentScrollY / 680));
        heroContent.style.transform = `translate3d(0, ${contentY.toFixed(2)}px, 0)`;
        heroContent.style.opacity = opacity.toFixed(3);
    }

    // 8. Scroll Progress Bar Fallback (for older browsers without CSS animation-timeline)
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
            updateVimeoBtn.classList.replace('bg-sky-500', 'bg-emerald-400');
            lucide.createIcons();

            setTimeout(() => {
                updateVimeoBtn.innerHTML = originalHTML;
                updateVimeoBtn.classList.replace('bg-emerald-400', 'bg-sky-500');
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


// ==========================================================================
// 4. Cinematic Falling Rain & Glass Droplets Animation Engine (Silent Canvas)
// ==========================================================================
const rainCanvas = document.getElementById('rain-canvas');

if (rainCanvas) {
    const ctx = rainCanvas.getContext('2d');
    let width = 0;
    let height = 0;

    function resizeCanvas() {
        const rect = rainCanvas.parentElement.getBoundingClientRect();
        width = rainCanvas.width = rect.width;
        height = rainCanvas.height = rect.height;
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    // Raindrop Particle Architecture
    const RAIN_COUNT = 140;
    const raindrops = [];
    const splashes = [];

    class Raindrop {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * (width + 200) - 100;
            this.y = initial ? Math.random() * height : -30;
            this.z = Math.random() * 0.8 + 0.2; // Depth layer: 0.2 (far) to 1.0 (near)
            this.length = (14 + Math.random() * 22) * this.z;
            this.speed = (12 + Math.random() * 16) * this.z;
            this.thickness = (0.7 + Math.random() * 1.3) * this.z;
            this.opacity = (0.15 + Math.random() * 0.45) * this.z;
            this.wind = 1.2 * this.z; // Subtle natural wind drift
        }

        update() {
            const dynamicWind = this.wind + (currentMouseX * 5 * this.z);
            this.x += dynamicWind;
            this.y += this.speed;

            // When drop reaches bottom of screen, chance of subtle splash
            if (this.y > height - 10) {
                if (Math.random() < 0.25 && splashes.length < 25) {
                    splashes.push(new Splash(this.x, height - 5, this.z));
                }
                this.reset();
            }

            if (this.x > width + 100) {
                this.x = -60;
            } else if (this.x < -100) {
                this.x = width + 60;
            }
        }

        draw() {
            const dynamicWind = this.wind + (currentMouseX * 5 * this.z);
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + dynamicWind * 1.6, this.y + this.length);
            ctx.strokeStyle = `rgba(186, 230, 253, ${this.opacity})`;
            ctx.lineWidth = this.thickness;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    class Splash {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.radius = 1;
            this.maxRadius = (3 + Math.random() * 6) * z;
            this.opacity = 0.5 * z;
            this.growth = 0.5 * z;
        }

        update() {
            this.radius += this.growth;
            this.opacity -= 0.025;
        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.radius * 1.8, this.radius * 0.6, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(186, 230, 253, ${this.opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }
    }

    // Window Glass Trickling Drops (Melancholic slow condensation)
    class GlassDrop {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -10;
            this.radius = 1.2 + Math.random() * 2.2;
            this.speed = 0.4 + Math.random() * 1.2;
            this.opacity = 0.25 + Math.random() * 0.4;
            this.wobble = Math.random() * Math.PI * 2;
        }

        update() {
            this.y += this.speed;
            this.wobble += 0.04;
            this.x += Math.sin(this.wobble) * 0.15;

            if (this.y > height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(224, 242, 254, ${this.opacity})`;
            ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset
        }
    }

    // Distant Soft Bokeh Droplets through Rainy Lens
    class RainBokeh {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = 16 + Math.random() * 32;
            this.alpha = 0.02 + Math.random() * 0.04;
            this.speed = 0.15 + Math.random() * 0.25;
            this.color = Math.random() > 0.4 ? '56, 189, 248' : '129, 140, 248';
        }

        update() {
            this.y += this.speed;
            if (this.y > height + 40) {
                this.y = -40;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
        }
    }

    const bokehs = [];
    for (let i = 0; i < 14; i++) {
        bokehs.push(new RainBokeh());
    }

    for (let i = 0; i < RAIN_COUNT; i++) {
        raindrops.push(new Raindrop());
    }

    const glassDrops = [];
    for (let i = 0; i < 18; i++) {
        glassDrops.push(new GlassDrop());
    }

    function animateRain() {
        ctx.clearRect(0, 0, width, height);

        // Update & Render distant bokeh lights
        for (let i = 0; i < bokehs.length; i++) {
            bokehs[i].update();
            bokehs[i].draw();
        }

        // Update & Render falling rain streaks
        for (let i = 0; i < raindrops.length; i++) {
            raindrops[i].update();
            raindrops[i].draw();
        }

        // Update & Render slow glass condensation droplets
        for (let i = 0; i < glassDrops.length; i++) {
            glassDrops[i].update();
            glassDrops[i].draw();
        }

        // Update & Render ground/surface splash ripples
        for (let i = splashes.length - 1; i >= 0; i--) {
            splashes[i].update();
            splashes[i].draw();
            if (splashes[i].opacity <= 0) {
                splashes.splice(i, 1);
            }
        }

        requestAnimationFrame(animateRain);
    }

    requestAnimationFrame(animateRain);
}

// Ensure Hero Rain Video starts smoothly
const rainPlayer = document.getElementById('hero-rain-player');
if (rainPlayer) {
    rainPlayer.play().catch(() => {
        document.addEventListener('click', () => {
            if (rainPlayer.paused) rainPlayer.play();
        }, { once: true });
    });
}
