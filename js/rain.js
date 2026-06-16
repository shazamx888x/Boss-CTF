(function() {
    const canvas = document.getElementById('matrix');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const chars = '01';
    let w, h, cols, drops;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        cols = Math.floor(w / 14);
        drops = Array(cols).fill(0).map(() => Math.random() * -h);
    }

    function draw() {
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, 0, w, h);
        ctx.font = '12px monospace';
        for (let i = 0; i < cols; i++) {
            const ch = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = Math.random() > 0.95 ? '#ffffff' : '#00ff41';
            ctx.fillText(ch, i * 14, drops[i]);
            if (drops[i] > h && Math.random() > 0.975) drops[i] = 0;
            drops[i] += 14;
        }
    }

    resize();
    window.addEventListener('resize', resize);
    setInterval(draw, 50);
})();