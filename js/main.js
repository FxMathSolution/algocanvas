// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add some lag to the outline for a smooth feel
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Hover effects for cursor
const hoverables = document.querySelectorAll('a, button, .gallery-item');
hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// Generative Art for Hero Section (Lorenz Attractor - Chaos Theory)
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let points = [];
let x = 0.1, y = 0, z = 0;
const a = 10;
const b = 28;
const c = 8.0 / 3.0;
const dt = 0.01;

function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    points = []; // Reset points on resize
    x = 0.1; y = 0; z = 0; // Reset start

    // Pre-calculate some points to start with a trail
    for (let i = 0; i < 100; i++) {
        calculateNextPoint();
    }
}

window.addEventListener('resize', resize);
resize();

function calculateNextPoint() {
    const dx = (a * (y - x)) * dt;
    const dy = (x * (b - z) - y) * dt;
    const dz = (x * y - c * z) * dt;
    x = x + dx;
    y = y + dy;
    z = z + dz;
    points.push({ x, y, z });

    // Limit trail length for performance
    if (points.length > 2000) {
        points.shift();
    }
}

function animate() {
    // Fade effect for trails
    ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Calculate multiple steps per frame for speed
    for (let i = 0; i < 5; i++) {
        calculateNextPoint();
    }

    ctx.beginPath();
    // Scale and center the attractor
    const scale = Math.min(width, height) / 60;
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw the trail
    if (points.length > 1) {
        ctx.beginPath();
        // Start from the first point
        let p = points[0];
        // Simple projection: x -> x, z -> y (top-downish view) or x,y (front view)
        // Let's rotate it slightly for 3D effect
        let px = p.x * scale + centerX;
        let py = p.y * scale + centerY;
        ctx.moveTo(px, py);

        for (let i = 1; i < points.length; i++) {
            p = points[i];
            // Simple rotation projection
            const projectedX = (p.x * Math.cos(0.5) - p.y * Math.sin(0.5));
            const projectedY = (p.x * Math.sin(0.5) + p.y * Math.cos(0.5)); // Use z for height if needed, but 2D projection of x/y works well for Lorenz butterfly

            // Actually Lorenz is usually X vs Z or X vs Y. Let's do standard projection.
            // X and Z often gives the classic butterfly.
            // Let's try X and Z + offset Y

            const drawX = (p.x * scale) + centerX;
            const drawY = (p.z * scale * -1) + centerY + (height / 3); // Flip Z for screen coords

            // Dynamic color based on velocity or position
            const hue = (i / points.length) * 60 + 120; // Green to Cyan range
            ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

            // We need to stroke per segment for gradient, but for performance let's do batches or single color
            // For "Neon" look, let's use the path.
            ctx.lineTo(drawX, drawY);
        }
        ctx.stroke();
    }

    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff88';

    requestAnimationFrame(animate);
}

animate();

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Render Gallery
function renderGallery() {
    const container = document.getElementById('gallery-container');
    if (!container || typeof nftCollection === 'undefined') return;

    container.innerHTML = nftCollection.map(nft => `
        <div class="gallery-item" onclick="window.location.href='nft.html?id=${nft.id}'" style="cursor: pointer;">
            <div class="gallery-img-wrapper">
                <img src="${nft.image}" alt="${nft.title}">
            </div>
            <div class="gallery-info">
                <h3>${nft.title}</h3>
                <p>${nft.description.substring(0, 50)}...</p>
            </div>
        </div>
    `).join('');

    // Re-attach hover listeners for the new elements
    const newHoverables = container.querySelectorAll('.gallery-item');
    newHoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
}

// Initialize Gallery if on home page
document.addEventListener('DOMContentLoaded', renderGallery);
