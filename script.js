const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Rastreo del mouse para interactividad
const mouse = { x: -1000, y: -1000 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

const phrases = [
    "Te amo", "I love you", "Je t'aime", "Ti amo", 
    "Ich liebe dich", "愛してる", "사랑해", "Eu te amo", "❤️"
];

function getHeartPosition(t, scale = 16) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x: x * scale, y: y * scale };
}

const particles = [];
const totalParticles = 280;

for (let i = 0; i < totalParticles; i++) {
    const t = Math.random() * Math.PI * 2;
    // Relleno interior + borde definido
    const spread = Math.pow(Math.random(), 0.45); 
    const pos = getHeartPosition(t, 16 * spread);
    const isText = i % 5 === 0; // 1 de cada 5 partículas es una frase

    particles.push({
        baseX: pos.x,
        baseY: pos.y,
        x: width / 2 + pos.x,
        y: height / 2 + pos.y,
        vx: 0,
        vy: 0,
        isText: isText,
        text: phrases[Math.floor(Math.random() * phrases.length)],
        size: isText ? Math.random() * 6 + 11 : Math.random() * 2.5 + 1.2,
        hue: Math.random() * 35 + 325, // Tonos entre rosa neón y rojo intenso
        phase: Math.random() * Math.PI * 2
    });
}

let time = 0;

function animate() {
    time += 0.04;
    // Efecto estela suave en el fondo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, width, height);

    // Efecto de latido doble (pum-pum)
    const beat = 1 + Math.pow(Math.sin(time * 2), 6) * 0.12;

    particles.forEach(p => {
        // Posición objetivo con latido y flotación orgánica
        const floatX = Math.cos(time + p.phase) * 3;
        const floatY = Math.sin(time + p.phase) * 3;
        const targetX = width / 2 + p.baseX * beat + floatX;
        const targetY = height / 2 + p.baseY * beat + floatY;

        // Repulsión suave al pasar el mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            const force = (100 - dist) / 100;
            p.vx += (dx / dist) * force * 4;
            p.vy += (dy / dist) * force * 4;
        }

        // Física de resorte para regresar al corazón
        p.vx += (targetX - p.x) * 0.08;
        p.vy += (targetY - p.y) * 0.08;
        p.vx *= 0.82; // Fricción
        p.vy *= 0.82;

        p.x += p.vx;
        p.y += p.vy;

        // Brillo neón
        const color = `hsl(${p.hue}, 100%, 65%)`;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;

        if (p.isText) {
            ctx.font = `bold ${p.size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(p.text, p.x, p.y);
        } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
}

animate();