import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getPublicBaseUrl } from '@/lib/publicBaseUrl'

export async function generateMetadata(): Promise<Metadata> {
  const base = getPublicBaseUrl()
  const embed = {
    version: '1',
    imageUrl: `${base}/opengraph-image`,
    button: {
      title: 'Open cookie',
      action: {
        type: 'launch_frame',
        name: 'Fortune Cookie',
        url: `${base}/mini`,
        splashBackgroundColor: '#f4f6fb',
      },
    },
  }

  return {
    title: 'Fortune Cookie · Mini app',
    description: 'Open a fortune cookie on Base (mini app entry).',
    other: {
      'fc:miniapp': JSON.stringify(embed),
    },
  }
}

export default function MiniLayout({ children }: { children: ReactNode }) {
  return children
}
