document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createParticle() {
        const colors = ['#FBEA80', '#FF6347', '#00CED1', '#ADFF2F', '#FFFFFF'];
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            size: Math.random() * 4 + 2, /*trocar 8+4 */
            speedY: Math.random() * 1.5 + 0.5,
            speedX: Math.random() * 1 - 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 5 - 2.5
        };
    }

    function updateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            if (p.y > canvas.height) {
                Object.assign(p, createParticle(), { y: -10 });
            }
            drawParticle(p);
        });
    }

    function drawParticle(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
    }

    function animate() {
        updateParticles();
        requestAnimationFrame(animate);
    }

    for (let i = 0; i < 100; i++) {
        particles.push(createParticle());
    }

    animate();
});
