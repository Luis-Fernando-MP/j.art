import { Pixelify_Sans, Silkscreen, VT323 } from 'next/font/google'

export const titleFont = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700', '600', '500', '400'],
  variable: '--titleFont'
})

export const paragraphFont = VT323({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--paragraphFont'
})

export const exclamationFont = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--exclamationFont'
})

export const bodyFonts = `${titleFont.variable} ${paragraphFont.variable} ${exclamationFont.variable}`
