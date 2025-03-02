export enum DEV_MODE {
  PROD = 'production',
  DEV = 'development'
}
export const DEV_ENV = process.env.NODE_ENV ?? DEV_MODE.DEV
export const BLANK_IMAGE = '/images/blank-image.webp'

export const defaultSizes = {
  Favicons: '16x16',
  'Iconos App': '32x32',
  Avatares: '48x48',
  'Iconos Juego': '64x64',
  'Iconos HD': '96x96',
  Personalizado: '100x100',
  'Iconos Grandes': '128x128',
  Detallados: '256x144'
}

export const socialSizes = {
  WEB: { width: 1920, height: 1080 },
  TWITTER: { width: 1200, height: 675 },
  INSTAGRAM: { width: 1080, height: 1080 },
  FACEBOOK: { width: 1200, height: 630 }
}
