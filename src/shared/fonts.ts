import { Pixelify_Sans, VT323, Workbench } from 'next/font/google'

export const font1 = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--family1'
})

export const font2 = VT323({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--family2'
})

export const font3 = Workbench({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--familyEspecial'
})

export const bodyFonts = `${font1.variable} ${font2.variable} ${font3.variable}`
