
function showDifficultyConversion(range, sourceType, x, y) {
    
    const existingPopup = document.querySelector('.difficulty-conversion-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    
    let ggValue, tufValue, legacyValue;

    if (sourceType === 'gg') {
        ggValue = range.label;
        const tuf = ggToTuf(range.start);
        tufValue = tuf.prefix + Math.round(tuf.val);
        legacyValue = formatLegacyLabel(ggToLegacy(range.start));
    } else if (sourceType === 'tuf') {
        tufValue = range.label;
        const prefix = range.label[0];
        const num = parseInt(range.label.substring(1));
        ggValue = formatGgLabel(tufToGg(prefix, num));
        legacyValue = formatLegacyLabel(ggToLegacy(tufToGg(prefix, num)));
    } else if (sourceType === 'legacy') {
        legacyValue = range.label;
        ggValue = formatGgLabel(legacyToGg(range.start));
        const tuf = ggToTuf(legacyToGg(range.start));
        tufValue = tuf.prefix + Math.round(tuf.val);
    }

    
    const popup = document.createElement('div');
    popup.className = 'difficulty-conversion-popup';
    popup.innerHTML = `
        <h3>Difficulty Conversion</h3>
        <div class="conversion-item">
            <span class="conversion-label">ADOFAI.gg:</span>
            <span class="conversion-value">${ggValue}</span>
        </div>
        <div class="conversion-item">
            <span class="conversion-label">TUF:</span>
            <span class="conversion-value">${tufValue}</span>
        </div>
        <div class="conversion-item">
            <span class="conversion-label">TUF (Legacy):</span>
            <span class="conversion-value">${legacyValue}</span>
        </div>
    `;

    
    document.body.appendChild(popup);

    
    const rect = popup.getBoundingClientRect();
    let left = x + 10;
    let top = y + 10;

    if (left + rect.width > window.innerWidth) {
        left = x - rect.width - 10;
    }
    if (top + rect.height > window.innerHeight) {
        top = y - rect.height - 10;
    }

    popup.style.left = left + 'px';
    popup.style.top = top + 'px';

    
    const closePopup = (e) => {
        if (!popup.contains(e.target)) {
            popup.remove();
            document.removeEventListener('click', closePopup);
        }
    };

    
    setTimeout(() => {
        document.addEventListener('click', closePopup);
    }, 100);
}

