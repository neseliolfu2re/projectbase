import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Fortune Cookie on Base'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #f8fafc 0%, #e0e7ff 45%, #dbeafe 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              padding: '8px 16px',
              borderRadius: 9999,
              border: '1px solid rgba(0, 82, 255, 0.35)',
              background: 'rgba(0, 82, 255, 0.08)',
              color: '#0052ff',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Base
          </span>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#18181b',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          Fortune Cookie
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            color: '#52525b',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.35,
          }}
        >
          Onchain opens, rarity, and history
        </div>
      </div>
    ),
    { ...size },
  )
}
