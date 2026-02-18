const fs = require('fs');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" x2="1">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="grad" x1="0" x2="1">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#7c3aed" />
    </linearGradient>
  </defs>

  <!-- phone frame -->
  <rect x="60" y="60" rx="40" ry="40" width="600" height="1160" fill="#111827" stroke="#0f172a" stroke-width="4" />

  <!-- screen -->
  <rect x="92" y="100" rx="26" ry="26" width="536" height="1040" fill="url(#bg)" />

  <!-- top bar -->
  <rect x="120" y="120" width="496" height="56" rx="12" fill="#0f172a" />
  <text x="360" y="155" font-family="Inter, system-ui, -apple-system, 'Segoe UI', Roboto" font-size="20" fill="#fff" text-anchor="middle">StarQR</text>

  <!-- main mockup area (punchcard) -->
  <g transform="translate(128,200)">
    <text x="0" y="0" font-family="Inter, system-ui" font-size="22" fill="#0f172a">Digital Punch Card</text>
    <rect x="0" y="16" width="380" height="420" rx="12" fill="#fff" stroke="#e6e6f0" />

    <!-- header inside card -->
    <text x="16" y="48" font-family="Inter, system-ui" font-size="16" fill="#334155">Will's Coffee Shop</text>
    <text x="16" y="72" font-family="Inter, system-ui" font-size="13" fill="#64748b">Enter your number to earn a star</text>

    <!-- stamp grid (5 cols) -->
    <g transform="translate(16,96)">
      <!-- draw 5x1 sample (you can change rows) -->
      ${Array.from({length:5}).map((_,i)=>{
        const x = i*72;
        const filled = i < 2; // show 2 filled stars as example
        return `
        <rect x="${x}" y="0" width="64" height="64" rx="10" fill="${filled ? 'url(#grad)' : '#f1f5f9'}" />
        ${filled ? `<path d="M${x+32} 12 L${x+39} 26 L${x+54} 26 L${x+42} 36 L${x+48} 50 L${x+32} 41 L${x+16} 50 L${x+22} 36 L${x+10} 26 L${x+25} 26 Z" fill="#fff" />` : ''}
        `
      }).join('')}

    </g>

    <!-- QR placeholder -->
    <rect x="264" y="336" width="96" height="96" fill="#0f172a" rx="8" />
    <text x="264" y="446" font-family="Inter, system-ui" font-size="11" fill="#475569">Scan to check in</text>
  </g>

  <!-- caption -->
  <text x="360" y="1180" font-family="Inter, system-ui" font-size="14" fill="#94a3b8" text-anchor="middle">Scan the QR, enter your number — earn stars instantly</text>
</svg>`;

fs.mkdirSync('public/images', { recursive: true });
fs.writeFileSync('public/images/phone-mockup.svg', svg, 'utf8');
console.log('Wrote public/images/phone-mockup.svg');
