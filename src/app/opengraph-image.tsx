import { ImageResponse } from 'next/og';

// Metadata Image File convention (App Router): served at /opengraph-image
// and wired into OpenGraph/Twitter cards automatically — replaces the old
// missing /og-image.png reference. 1200×630 is the recommended share size.
export const alt =
  'EXPENSIO — Mindful spending at the speed of thought. A Kakeibo-inspired digital expense tracker.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '70px 80px',
          background:
            'linear-gradient(135deg, #022c22 0%, #064e3b 45%, #0f766e 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          gap: '30px',
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #10b981, #2dd4bf)',
              fontSize: 46,
              fontWeight: 800,
            }}
          >
            E
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>
              EXPENSIO
            </div>
            <div style={{ fontSize: 24, color: '#6ee7b7' }}>
              expensio.online
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxWidth: 980,
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.15 }}>
            Mindful spending at the speed of thought.
          </div>
          <div style={{ fontSize: 30, color: '#a7f3d0', lineHeight: 1.4 }}>
            The Japanese art of Kakeibo, digitized — a spreadsheet-fast, open
            source expense tracker built with Next.js.
          </div>
        </div>

        {/* Ledger chips */}
        <div style={{ display: 'flex', gap: '18px', marginTop: '6px' }}>
          {[
            { label: 'Income', value: '+$4,850.00', color: '#6ee7b7' },
            { label: 'Expenses', value: '−$426.15', color: '#fda4af' },
            { label: 'All-Time Balance', value: '+$4,423.85', color: '#6ee7b7' },
          ].map((chip) => (
            <div
              key={chip.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '18px 26px',
                borderRadius: 18,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  color: '#94a3b8',
                }}
              >
                {chip.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: chip.color }}>
                {chip.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
