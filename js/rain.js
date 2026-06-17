(function(){
    const canvas=document.createElement('canvas');
    canvas.id='matrix-rain';
    canvas.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;opacity:0.08;pointer-events:none';
    document.body.prepend(canvas);
    const ctx=canvas.getContext('2d');
    const chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let w,h,cols,drops;
    function resize(){w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight;cols=Math.floor(w/14);drops=Array(cols).fill(0).map(()=>Math.random()*-h)}
    function draw(){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,w,h);ctx.font='12px "Press Start 2P",monospace';for(let i=0;i<cols;i++){const ch=chars[Math.floor(Math.random()*chars.length)];ctx.fillStyle=Math.random()>0.95?'#ff00ff':'#00ff88';ctx.fillText(ch,i*14,drops[i]);if(drops[i]>h&&Math.random()>0.975)drops[i]=0;drops[i]+=14}}
    resize();window.addEventListener('resize',resize);setInterval(draw,50);
})();