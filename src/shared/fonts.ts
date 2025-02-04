import { Pixelify_Sans, VT323 } from 'next/font/google'

// PT_MONO
export const font1 = VT323({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font1'
})

export const font2 = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700', '600', '500', '400'],
  variable: '--font2'
})

export const bodyFonts = `${font1.variable} ${font2.variable}`
