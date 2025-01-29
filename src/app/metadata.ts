import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://key-flare.vercel.app'),
  title: 'Key Flare',
  description:
    'Pon a prueba y mejora tu velocidad de escritura con Key Flare, un clon de Monkeytype creado para fines educativos. ¡Compite contra ti mismo y domina el teclado!',
  keywords:
    'Key Flare, monkeytype, test de velocidad de escritura, mecanografía, práctica de escritura, teclado, wpm, cpm, mejorar velocidad, juegos de escritura',
  authors: [{ name: 'Luis MP' }],
  creator: 'Luis MP',
  publisher: 'JULES',
  icons: {
    icon: [{ url: '/logo.svg', sizes: 'any, 16x16, 32x32, 48x48, 64x64, 128x128, 256x256, 512x512' }]
  },
  openGraph: {
    title: 'Key Flare - Mejora tu velocidad de escritura',
    description:
      'Pon a prueba y mejora tu velocidad de escritura con Key Flare, un clon de Monkeytype creado para fines educativos. ¡Compite contra ti mismo y domina el teclado!',
    url: 'https://key-flare.vercel.app',
    siteName: 'Key Flare',
    images: [{ url: '/imagen-opengraph.png', alt: 'Key Flare Logo' }],
    locale: 'es_PE',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Key Flare - Mejora tu velocidad de escritura',
    description:
      'Pon a prueba y mejora tu velocidad de escritura con Key Flare, un clon de Monkeytype creado para fines educativos. ¡Compite contra ti mismo y domina el teclado!',
    images: [{ url: '/imagen-opengraph.png', alt: 'Key Flare Logo' }]
  },
  robots: {
    index: true,
    follow: true
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1
}
