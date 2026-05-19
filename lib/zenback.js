/**
 * createZenBack
 * @param {Object} color - {r, g, b}
 * @param {number} seed - seed for the noise generator
 */
function createZenBack(color, seed) {
    const sizes = [17, 53, 49, 31, 17, 41, 43];
    const colorBase = color;
    
    let currentSeed = seed;
    const random = () => {
        currentSeed = (currentSeed * 16807) % 2147483647;
        return (currentSeed - 1) / 2147483646;
    };

    const globalBaseAngle = random() * Math.PI * 2;

    const generatePattern = (size, layerIndex) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        for (let i = 0; i < 30; i++) {
            let variation = (random() - 0.5) * 35; 
            const r = Math.min(255, Math.max(0, colorBase.r + variation));
            variation = (random() - 0.5) * 35; 
            const g = Math.min(255, Math.max(0, colorBase.g + variation));
            variation = (random() - 0.5) * 35; 
            const b = Math.min(255, Math.max(0, colorBase.b + variation));
            
            const alpha = 0.15;

            ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
            ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
            var thickness = 0.3 + (random() * 0.7);
            var halfthickness = thickness / 2;

            const px = random() * size;
            const py = random() * size;

            if (layerIndex < 3) {
                const angle = globalBaseAngle + (layerIndex * (Math.PI / 6)); 
                const dx = Math.cos(angle) * size;
                const dy = Math.sin(angle) * size;

                for (let sx = -1; sx <= 1; sx++) {
                    for (let sy = -1; sy <= 1; sy++) {
                        ctx.beginPath();
                        ctx.moveTo(px + (sx * size), py + (sy * size));
                        ctx.lineTo(px + dx + (sx * size), py + dy + (sy * size));
                        ctx.lineWidth = thickness + 1;
                        ctx.strokeStyle = 'rgba(0,0,0,0.01)';
                        ctx.stroke();
                        ctx.lineWidth = thickness;
                        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
                        ctx.stroke();
                    }
                }
            } 
            else if (layerIndex < 6) {
                const angle = globalBaseAngle + Math.PI/2 + ((layerIndex - 3) * (Math.PI / 6)); 
                const dx = Math.cos(angle) * size;
                const dy = Math.sin(angle) * size;

                for (let sx = -1; sx <= 1; sx++) {
                    for (let sy = -1; sy <= 1; sy++) {
                        ctx.lineWidth = thickness;
                        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
                        ctx.beginPath();
                        ctx.moveTo(px + (sx * size), py + (sy * size));
                        ctx.lineTo(px + dx + (sx * size), py + dy + (sy * size));
                        ctx.stroke();
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(255,255,255,0.015)';
                        ctx.moveTo(px + (sx * size), py - halfthickness + (sy * size));
                        ctx.lineTo(px + dx + (sx * size), py + dy - halfthickness + (sy * size));
                        ctx.stroke();
                    }
                }
            } 
            else {
                ctx.beginPath();
                const radius = random() * 4.2;
                ctx.arc(px, py, radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha*2 + ')';
                ctx.fill();
            }
        }
        return canvas.toDataURL();
    };

    const urls = sizes.map((size, index) => generatePattern(size, index));

    const debugEl = document.getElementById('expose_generated_textures');
    if (debugEl) {
        debugEl.innerHTML = '<strong style="color:black">Generated Textures (7 layers):</strong><br>';
        urls.forEach((url, idx) => {
            const img = document.createElement('img');
            img.src = url;
            img.style.border = '1px solid #ccc';
            img.style.margin = '2px';
            img.title = 'Layer ' + idx + ' (' + sizes[idx] + 'px)';
            debugEl.appendChild(img);
        });
    }

    const body = document.body;
    body.style.backgroundColor = 'rgb(' + colorBase.r + ',' + colorBase.g + ',' + colorBase.b + ')';
    
    const radialGrad = 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.4) 100%)';
    
    // --- FIXED ORDERING ---
    // We start with the gradient (top), then the textures in REVERSE order (Layer 6, 5, 4... 0)
    // This puts the Dots (Layer 6) on top of all the lines.
    let bgImageString = radialGrad;
    for (let i = urls.length - 1; i >= 0; i--) {
        bgImageString += ', url(' + urls[i] + ')';
    }
    
    body.style.backgroundImage = bgImageString;
    body.style.backgroundAttachment = 'fixed';
    body.style.backgroundRepeat = 'repeat';
    
    let sizeString = 'cover';
    for (let i = 0; i < urls.length; i++) {
        sizeString += ', auto';
    }
    body.style.backgroundSize = sizeString;
}
