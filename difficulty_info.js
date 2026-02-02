const DIFFICULTY_BASE_HEIGHT = 40;

const GG_LEVELS = [];
for (let i = 1; i <= 18; i++) GG_LEVELS.push(i);
GG_LEVELS.push(18.5, 19, 19.5);
for (let i = 200; i <= 226; i++) GG_LEVELS.push(i / 10);

const TUF_LEVELS = [];
['P', 'G', 'U'].forEach(prefix => {
    for (let i = 1; i <= 20; i++) TUF_LEVELS.push(prefix + i);
});

const LEGACY_LEVELS = [];
for (let i = 1; i <= 18; i++) LEGACY_LEVELS.push(i);
LEGACY_LEVELS.push(18.5, 19, 19.5);
for (let i = 200; i <= 209; i++) {
    let base = i / 10;
    LEGACY_LEVELS.push(base);
    LEGACY_LEVELS.push(parseFloat((base + 0.05).toFixed(2)));
}
// 21 이후: 21, 21+, 21.1, 21.1+, 21.2, 21.2+, 21.3, 21.3+
for (let i = 210; i <= 213; i++) {
    let base = i / 10;
    LEGACY_LEVELS.push(base);
    LEGACY_LEVELS.push(parseFloat((base + 0.05).toFixed(2)));
}

const TUF_COLORS = {
    'P1': '#0098ff', 'P2': '#00a0ff', 'P3': '#00a8ff', 'P4': '#00b0ff', 'P5': '#00b8ff',
    'P6': '#00c0ff', 'P7': '#00d0ff', 'P8': '#00e0ff', 'P9': '#00e8ff', 'P10': '#00f0ff',
    'P11': '#00ffff', 'P12': '#00ffe8', 'P13': '#00ffd0', 'P14': '#00ffb8', 'P15': '#00ffa8',
    'P16': '#00ff88', 'P17': '#00ff70', 'P18': '#00ff48', 'P19': '#00ff30', 'P20': '#48ff18',
    'G1': '#f0a800', 'G2': '#f0a008', 'G3': '#f09810', 'G4': '#f09018', 'G5': '#e88820',
    'G6': '#e87828', 'G7': '#e87030', 'G8': '#e86838', 'G9': '#e86040', 'G10': '#e05848',
    'G11': '#e05050', 'G12': '#e04858', 'G13': '#e04060', 'G14': '#e03868', 'G15': '#d83070',
    'G16': '#d82078', 'G17': '#d81880', 'G18': '#d81088', 'G19': '#d80890', 'G20': '#d00098',
    'U1': '#7850b0', 'U2': '#7848a8', 'U3': '#7048a0', 'U4': '#684098', 'U5': '#604090',
    'U6': '#583880', 'U7': '#583878', 'U8': '#503070', 'U9': '#483068', 'U10': '#402860',
    'U11': '#382858', 'U12': '#302048', 'U13': '#302040', 'U14': '#281838', 'U15': '#201830',
    'U16': '#181028', 'U17': '#101020', 'U18': '#100810', 'U19': '#080808', 'U20': '#000000'
};

const GG_COLORS = '#3f466dff';

const LEGACY_COLORS = {
    1: '#0098ff', 2: '#00b8ff', 3: '#00e0ff', 4: '#00ffff', 5: '#00ffa8',
    6: '#00ff00', 7: '#68ff00', 8: '#98ff00', 9: '#d0ff00',
    10: '#ffff00', 11: '#ffe000', 12: '#ffd000', 13: '#ffa800', 14: '#ff8800',
    15: '#ff6800', 16: '#ff4800', 17: '#ff0000', 18: '#d00000',
    18.5: '#a82000', 19: '#680000', 19.5: '#481000',
    20: '#401010', 20.05: '#401820',
    20.1: '#402030', 20.15: '#382038',
    20.2: '#382850', 20.25: '#302858',
    20.3: '#302868', 20.35: '#302870',
    20.4: '#282880', 20.45: '#282888',
    20.5: '#202890', 20.55: '#202898',
    20.6: '#2028a0', 20.65: '#2028a0',
    20.7: '#2020a0', 20.75: '#2018a0',
    20.8: '#281090', 20.85: '#281080',
    20.9: '#300878', 20.95: '#300870',
    21: '#300868', 21.05: '#300858',
    21.1: '#300058', 21.15: '#381058',
    21.2: '#482068', 21.25: '#503078',
    21.3: '#583880', 21.35: '#000000'
};

function ggToTuf(gg) {
    if (gg < 20) {
        let val;
        if (gg <= 3) val = 1 + (gg - 1) * 0.5;
        else if (gg <= 18) val = gg - 1;
        else val = 17 + (gg - 18) * 2;
        return { prefix: 'P', val: parseFloat(val.toFixed(6)) };
    } else if (gg < 21) {
        let val = 1 + (gg - 20) * 20;
        return { prefix: 'G', val: parseFloat(val.toFixed(6)) };
    } else {
        let val = 1 + (gg - 21) * 8;
        return { prefix: 'U', val: parseFloat(val.toFixed(6)) };
    }
}

function ggToLegacy(gg) {
    if (gg <= 21) return gg;
    return 21 + (gg - 21) / 5;
}

function tufToGg(prefix, val) {
    if (prefix === 'P') {
        if (val <= 2) return 1 + (val - 1) / 0.5;
        else if (val <= 17) return val + 1;
        else return 18 + (val - 17) / 2;
    } else if (prefix === 'G') {
        return 20 + (val - 1) / 20;
    } else if (prefix === 'U') {
        return 21 + (val - 1) / 8;
    }
    return 1;
}

function legacyToGg(legacy) {
    if (legacy <= 21) return legacy;
    return 21 + (legacy - 21) * 5;
}

function buildGgRanges(heightMultiplierFn = null) {
    const ranges = [];
    for (let i = 0; i < GG_LEVELS.length; i++) {
        const start = GG_LEVELS[i];
        const end = (i + 1 < GG_LEVELS.length) ? GG_LEVELS[i + 1] : start + 0.1;
        const multiplier = heightMultiplierFn ? heightMultiplierFn(start) : 1;
        ranges.push({
            label: formatGgLabel(start),
            start,
            end,
            height: DIFFICULTY_BASE_HEIGHT * multiplier,
            color: GG_COLORS
        });
    }
    return ranges;
}

function buildTufRanges() {
    const ranges = [];
    for (let i = 0; i < TUF_LEVELS.length; i++) {
        const lvl = TUF_LEVELS[i];
        const prefix = lvl[0];
        const num = parseInt(lvl.substring(1));
        const ggStart = tufToGg(prefix, num);
        const ggEnd = tufToGg(prefix, num + 1);
        ranges.push({
            label: lvl,
            ggStart,
            ggEnd,
            height: DIFFICULTY_BASE_HEIGHT,
            color: TUF_COLORS[lvl] || '#666'
        });
    }
    return ranges;
}

function buildLegacyRanges(heightMultiplierFn = null) {
    const ranges = [];
    for (let i = 0; i < LEGACY_LEVELS.length; i++) {
        const start = LEGACY_LEVELS[i];
        const end = (i + 1 < LEGACY_LEVELS.length) ? LEGACY_LEVELS[i + 1] : start + 0.05;
        const ggStart = legacyToGg(start);
        const ggEnd = legacyToGg(end);
        const multiplier = heightMultiplierFn ? heightMultiplierFn(start) : 1;
        ranges.push({
            label: formatLegacyLabel(start),
            start,
            ggStart,
            ggEnd,
            height: DIFFICULTY_BASE_HEIGHT * multiplier,
            color: LEGACY_COLORS[start] || '#666'
        });
    }
    return ranges;
}

function formatGgLabel(val) {
    if (val === 18.5) return '18+';
    if (val === 19.5) return '19+';
    if (Number.isInteger(val)) return val.toString();
    return val.toFixed(1);
}

function formatLegacyLabel(val) {
    if (val === 18.5) return '18+';
    if (val === 19.5) return '19+';
    if (Number.isInteger(val)) return val.toString();
    const str = val.toFixed(2);
    // 21.05 → "21+", 21.15 → "21.1+", 21.25 → "21.2+", etc.
    if (str.endsWith('5')) {
        const baseVal = Math.floor(val);
        const decimal = val - baseVal;
        // 0.05 → base+, 0.15 → base.1+, 0.25 → base.2+, etc.
        if (Math.abs(decimal - 0.05) < 0.001) {
            return baseVal + '+';
        }
        // Use floor to avoid rounding: 21.15 → 21.1+, 21.25 → 21.2+
        const firstDecimal = Math.floor((decimal - 0.05) * 10 + 0.001);
        return baseVal + '.' + firstDecimal + '+';
    }
    return val.toFixed(1);
}

function calcHeightByGgRange(ggStart, ggEnd, ggRanges, baseHeight) {
    let totalHeight = 0;
    let coveredRange = 0;

    for (const r of ggRanges) {
        const overlap = Math.max(0, Math.min(r.end, ggEnd) - Math.max(r.start, ggStart));
        if (overlap > 0) {
            const ratio = overlap / (r.end - r.start);
            totalHeight += baseHeight * ratio;
            coveredRange += overlap;
        }
    }

    // Calculate uncovered range (extends beyond GG levels)
    const requestedRange = ggEnd - ggStart;
    const uncoveredRange = requestedRange - coveredRange;

    if (uncoveredRange > 0) {
        // Add proportional height for the uncovered portion
        totalHeight += baseHeight * uncoveredRange / 0.1; // 0.1 is typical GG increment
    }

    return Math.max(totalHeight, 1);
}

function renderDifficultyTable(base = 'gg') {
    const wrapper = document.getElementById('difficulty-table-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = '';

    let ggRanges, tufRanges, legacyRanges;

    if (base === 'gg') {
        // Double height for GG 20~20.9 section
        ggRanges = buildGgRanges((start) => (start >= 20 && start < 21) ? 2 : 1);
        tufRanges = buildTufRanges();
        legacyRanges = buildLegacyRanges();
    } else if (base === 'legacy') {
        // Double height for GG 21+ section (which is Legacy 21+)
        ggRanges = buildGgRanges((start) => (start >= 21) ? 2 : 1);
        tufRanges = buildTufRanges();
        legacyRanges = buildLegacyRanges((start) => (start >= 21) ? 2 : 1);
    } else {
        ggRanges = buildGgRanges();
        tufRanges = buildTufRanges();
        legacyRanges = buildLegacyRanges();
    }

    let columns = [];

    if (base === 'gg') {
        columns = [
            { name: 'ADOFAI.gg', ranges: ggRanges, type: 'gg' },
            { name: 'TUF', ranges: tufRanges, type: 'tuf' },
            { name: 'TUF (Legacy)', ranges: legacyRanges, type: 'legacy' }
        ];
        for (const r of tufRanges) {
            // Double height for G section (20~20.9 range)
            const heightMultiplier = (r.ggStart >= 20 && r.ggStart < 21) ? 2 : 1;
            r.height = calcHeightByGgRange(r.ggStart, r.ggEnd, ggRanges, DIFFICULTY_BASE_HEIGHT * heightMultiplier);
        }
        for (const r of legacyRanges) {
            // Double height for 20~20.9+ range
            const heightMultiplier = (r.ggStart >= 20 && r.ggStart < 21) ? 2 : 1;
            r.height = calcHeightByGgRange(r.ggStart, r.ggEnd, ggRanges, DIFFICULTY_BASE_HEIGHT * heightMultiplier);
        }
    } else if (base === 'tuf') {
        for (const r of ggRanges) {
            const tufStart = ggToTuf(r.start);
            const tufEnd = ggToTuf(r.end);
            r.tufStart = tufStart;
            r.tufEnd = tufEnd;
        }
        for (const r of legacyRanges) {
            const tufStart = ggToTuf(r.ggStart);
            const tufEnd = ggToTuf(r.ggEnd);
            r.tufStart = tufStart;
            r.tufEnd = tufEnd;
        }
        for (const r of ggRanges) {
            r.height = calcHeightByTufRange(r.tufStart, r.tufEnd, tufRanges, DIFFICULTY_BASE_HEIGHT);
        }
        for (const r of legacyRanges) {
            r.height = calcHeightByTufRange(r.tufStart, r.tufEnd, tufRanges, DIFFICULTY_BASE_HEIGHT);
        }
        columns = [
            { name: 'TUF', ranges: tufRanges, type: 'tuf' },
            { name: 'ADOFAI.gg', ranges: ggRanges, type: 'gg' },
            { name: 'TUF (Legacy)', ranges: legacyRanges, type: 'legacy' }
        ];
    } else if (base === 'legacy') {
        for (const r of ggRanges) {
            r.legacyStart = ggToLegacy(r.start);
            r.legacyEnd = ggToLegacy(r.end);
        }
        for (const r of tufRanges) {
            r.legacyStart = ggToLegacy(r.ggStart);
            r.legacyEnd = ggToLegacy(r.ggEnd);
        }
        for (const r of ggRanges) {
            // Double height for 21~22.6 range (Legacy 21~21.3+)
            const heightMultiplier = (r.legacyStart >= 21) ? 2 : 1;
            r.height = calcHeightByLegacyRange(r.legacyStart, r.legacyEnd, legacyRanges, DIFFICULTY_BASE_HEIGHT * heightMultiplier);
        }
        for (const r of tufRanges) {
            // Double height for U section (Legacy 21~21.3+)
            const heightMultiplier = (r.legacyStart >= 21) ? 2 : 1;
            r.height = calcHeightByLegacyRange(r.legacyStart, r.legacyEnd, legacyRanges, DIFFICULTY_BASE_HEIGHT * heightMultiplier);
        }
        columns = [
            { name: 'TUF (Legacy)', ranges: legacyRanges, type: 'legacy' },
            { name: 'ADOFAI.gg', ranges: ggRanges, type: 'gg' },
            { name: 'TUF', ranges: tufRanges, type: 'tuf' }
        ];
    }

    // Define better section boundaries based on difficulty tiers
    const baseColumn = columns[0];
    let sectionBoundaries;
    if (base === 'gg') {
        // For GG: split at 20.0 and 21.0 (P/G/U boundaries)
        const idx20 = baseColumn.ranges.findIndex(r => r.start >= 20);
        const idx21 = baseColumn.ranges.findIndex(r => r.start >= 21);
        sectionBoundaries = [
            { start: 0, end: idx20 },
            { start: idx20, end: idx21 },
            { start: idx21, end: baseColumn.ranges.length }
        ];
    } else if (base === 'tuf') {
        // For TUF: split by prefix (P, G, U)
        const idxG = baseColumn.ranges.findIndex(r => r.label[0] === 'G');
        const idxU = baseColumn.ranges.findIndex(r => r.label[0] === 'U');
        sectionBoundaries = [
            { start: 0, end: idxG },
            { start: idxG, end: idxU },
            { start: idxU, end: baseColumn.ranges.length }
        ];
    } else if (base === 'legacy') {
        // For Legacy: split at 20.0 and 21.0
        const idx20 = baseColumn.ranges.findIndex(r => r.start >= 20);
        const idx21 = baseColumn.ranges.findIndex(r => r.start >= 21);
        sectionBoundaries = [
            { start: 0, end: idx20 },
            { start: idx20, end: idx21 },
            { start: idx21, end: baseColumn.ranges.length }
        ];
    }

    // Create 3 table sections (horizontally arranged)
    for (let section = 0; section < 3; section++) {
        const startIdx = sectionBoundaries[section].start;
        const endIdx = sectionBoundaries[section].end;

        if (startIdx >= endIdx) continue;

        const table = document.createElement('div');
        table.className = 'difficulty-table';

        for (let colIdx = 0; colIdx < columns.length; colIdx++) {
            const col = columns[colIdx];
            const colDiv = document.createElement('div');
            colDiv.className = 'difficulty-column';

            const header = document.createElement('div');
            header.className = 'difficulty-column-header';
            header.textContent = col.name;
            colDiv.appendChild(header);

            const body = document.createElement('div');
            body.className = 'difficulty-column-body';

            let sectionRanges;
            if (colIdx === 0) {
                // Base column: just slice normally
                sectionRanges = col.ranges.slice(startIdx, endIdx);
            } else {
                // Other columns: filter by base column's range
                const baseStart = baseColumn.ranges[startIdx];
                const baseEnd = baseColumn.ranges[endIdx - 1];

                if (base === 'gg') {
                    // Base is GG, filter by ggStart/ggEnd
                    const minGg = baseStart.start;
                    const maxGg = baseEnd.end;
                    const isLastSection = (section === 2);
                    sectionRanges = col.ranges.filter(r => {
                        if (isLastSection) {
                            return r.ggStart >= minGg;
                        }
                        return r.ggStart >= minGg && r.ggStart < maxGg;
                    });
                } else if (base === 'tuf') {
                    // Base is TUF, filter by tufStart/tufEnd
                    const minTuf = tufToIndex({ prefix: baseStart.label[0], val: parseInt(baseStart.label.substring(1)) });
                    const maxTuf = tufToIndex({ prefix: baseEnd.label[0], val: parseInt(baseEnd.label.substring(1)) + 1 });
                    sectionRanges = col.ranges.filter(r => {
                        let rStart;
                        if (col.type === 'tuf') {
                            // This shouldn't happen as TUF is base
                            rStart = tufToIndex({ prefix: r.label[0], val: parseInt(r.label.substring(1)) });
                        } else {
                            // GG or Legacy column
                            rStart = tufToIndex(r.tufStart);
                        }
                        return rStart >= minTuf && rStart < maxTuf;
                    });
                } else if (base === 'legacy') {
                    // Base is Legacy, filter by legacyStart/legacyEnd
                    const minLegacy = baseStart.start;
                    // For the last section, include everything beyond the last legacy level
                    const maxLegacy = (section === 2) ? 999 : (baseEnd.start + 0.05);
                    sectionRanges = col.ranges.filter(r => {
                        return r.legacyStart >= minLegacy && r.legacyStart < maxLegacy;
                    });
                }
            }

            for (const r of sectionRanges) {
                const box = document.createElement('div');
                box.className = 'difficulty-box';
                box.style.height = r.height + 'px';
                box.style.background = r.color;
                box.textContent = r.label;

                // Add small gap at tier boundaries (21.1, 21.2, 21.3)
                const tierBoundaries = [21.1, 21.2, 21.3];
                let addGap = false;
                if (col.type === 'legacy') {
                    addGap = tierBoundaries.includes(r.start);
                } else if (col.type === 'gg') {
                    // GG levels corresponding to legacy boundaries
                    const ggBoundaries = [21.5, 22, 22.5];
                    addGap = ggBoundaries.includes(r.start);
                } else if (col.type === 'tuf') {
                    // TUF levels U5, U9, U13 (correspond to GG 21.5, 22, 22.5)
                    addGap = ['U5', 'U9', 'U13'].includes(r.label);
                }
                if (addGap) {
                    box.style.marginTop = '4px';
                }

                // Add hover event for conversion popup
                box.addEventListener('mouseenter', (e) => {
                    const rect = box.getBoundingClientRect();
                    showDifficultyConversion(r, col.type, rect.right + 10, rect.top);
                    // Show line across this table section's columns only
                    const columns = table.querySelectorAll('.difficulty-column');
                    if (columns.length > 0) {
                        const firstCol = columns[0].getBoundingClientRect();
                        const lastCol = columns[columns.length - 1].getBoundingClientRect();
                        showHighlightLine(rect.top, firstCol.left, lastCol.right);
                    }
                });

                box.addEventListener('mouseleave', () => {
                    hideDifficultyConversion();
                    hideHighlightLine();
                });

                // Add click event to fill converter
                box.addEventListener('click', () => {
                    fillConverterWithDifficulty(r, col.type);
                });

                body.appendChild(box);
            }

            colDiv.appendChild(body);
            table.appendChild(colDiv);
        }

        wrapper.appendChild(table);
    }
}

function calcHeightByTufRange(tufStart, tufEnd, tufRanges, baseHeight) {
    let totalHeight = 0;
    const startIdx = tufToIndex(tufStart);
    const endIdx = tufToIndex(tufEnd);
    for (let i = 0; i < tufRanges.length; i++) {
        const rStart = i;
        const rEnd = i + 1;
        const overlap = Math.max(0, Math.min(rEnd, endIdx) - Math.max(rStart, startIdx));
        if (overlap > 0) {
            totalHeight += baseHeight * overlap;
        }
    }
    return Math.max(totalHeight, 1);
}

function tufToIndex(tuf) {
    const prefixOrder = { 'P': 0, 'G': 20, 'U': 40 };
    return prefixOrder[tuf.prefix] + tuf.val - 1;
}

function calcHeightByLegacyRange(legacyStart, legacyEnd, legacyRanges, baseHeight) {
    let totalHeight = 0;
    for (const r of legacyRanges) {
        const rEnd = (legacyRanges.indexOf(r) + 1 < legacyRanges.length)
            ? legacyRanges[legacyRanges.indexOf(r) + 1].start
            : r.start + 0.05;
        const overlap = Math.max(0, Math.min(rEnd, legacyEnd) - Math.max(r.start, legacyStart));
        if (overlap > 0) {
            const ratio = overlap / (rEnd - r.start);
            totalHeight += baseHeight * ratio;
        }
    }
    // If no overlap found (e.g., range is beyond Legacy levels), use proportional height
    if (totalHeight === 0) {
        const legacyRange = legacyEnd - legacyStart;
        totalHeight = baseHeight * legacyRange / 0.05; // 0.05 is typical Legacy increment for high levels
    }
    return Math.max(totalHeight, 1);
}

function initDifficultyInfo() {
    const selector = document.getElementById('difficulty-base-selector');
    if (selector) {
        selector.querySelectorAll('.segment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selector.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderDifficultyTable(btn.dataset.base);
            });
        });
    }
    renderDifficultyTable('gg');
}

function showDifficultyConversion(range, sourceType, x, y) {
    const existingPopup = document.querySelector('.difficulty-conversion-popup');
    if (existingPopup) existingPopup.remove();

    let ggValue, tufValue, legacyValue;

    if (sourceType === 'gg') {
        ggValue = parseFloat(range.start.toFixed(6));
        const tuf = ggToTuf(range.start);
        tufValue = tuf.prefix + parseFloat(tuf.val.toFixed(6));
        legacyValue = parseFloat(ggToLegacy(range.start).toFixed(6));
    } else if (sourceType === 'tuf') {
        tufValue = range.label;
        const prefix = range.label[0];
        const num = parseInt(range.label.substring(1));
        ggValue = parseFloat(tufToGg(prefix, num).toFixed(6));
        legacyValue = parseFloat(ggToLegacy(tufToGg(prefix, num)).toFixed(6));
    } else if (sourceType === 'legacy') {
        legacyValue = parseFloat(range.start.toFixed(6));
        ggValue = parseFloat(legacyToGg(range.start).toFixed(6));
        const tuf = ggToTuf(legacyToGg(range.start));
        tufValue = tuf.prefix + parseFloat(tuf.val.toFixed(6));
    }

    const popup = document.createElement('div');
    popup.className = 'difficulty-conversion-popup';
    popup.innerHTML = `
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

    if (left + rect.width > window.innerWidth) left = x - rect.width - 10;
    if (top + rect.height > window.innerHeight) top = y - rect.height - 10;

    popup.style.left = left + 'px';
    popup.style.top = top + 'px';

}

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

function fillConverterWithDifficulty(range, sourceType) {
    const ggInput = document.getElementById('gg');
    const tufInput = document.getElementById('tuf');
    const legacyInput = document.getElementById('tuf_legacy');

    if (sourceType === 'gg') {
        if (ggInput) ggInput.value = range.start;
    } else if (sourceType === 'tuf') {
        if (tufInput) {
            const prefix = range.label[0];
            const num = parseInt(range.label.substring(1));
            tufInput.value = prefix + num;
        }
    } else if (sourceType === 'legacy') {
        if (legacyInput) legacyInput.value = range.start;
    }

    // Trigger input event to update other fields
    if (sourceType === 'gg' && ggInput) {
        ggInput.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (sourceType === 'tuf' && tufInput) {
        tufInput.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (sourceType === 'legacy' && legacyInput) {
        legacyInput.dispatchEvent(new Event('input', { bubbles: true }));
    }


    // Scroll to Level Converter section
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDifficultyInfo);
} else {
    initDifficultyInfo();
}
