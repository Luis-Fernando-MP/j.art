import { Exo_2, Pixelify_Sans, Roboto } from 'next/font/google'

export const titleFont = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700', '600', '500'],
  variable: '--titleFont'
})

export const paragraphFont = Roboto({
  subsets: ['latin'],
  weight: ['900', '700', '500', '400', '300'],
  variable: '--paragraphFont'
})

export const exclamationFont = Exo_2({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '700'],
  variable: '--exclamationFont'
})

export const bodyFonts = `${titleFont.variable} ${paragraphFont.variable} ${exclamationFont.variable}`
