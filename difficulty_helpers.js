function hideDifficultyConversion() {
    const popup = document.querySelector('.difficulty-conversion-popup');
    if (popup) popup.remove();
}

function showHighlightLine(top, left, right) {
    let line = document.querySelector('.difficulty-highlight-line');
    if (!line) {
        line = document.createElement('div');
        line.className = 'difficulty-highlight-line';
        document.body.appendChild(line);
    }

    line.style.top = top + 'px';
    line.style.left = left + 'px';
    line.style.width = (right - left) + 'px';
}

function hideHighlightLine() {
    const line = document.querySelector('.difficulty-highlight-line');
    if (line) line.remove();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDifficultyInfo);
} else {
    initDifficultyInfo();
}
