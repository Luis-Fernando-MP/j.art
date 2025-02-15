interface Theme {
  'bg-primary': string
  'bg-secondary': string
  'bg-tertiary': string
  'fnt-primary': string
  'fnt-secondary': string
  'fnt-tertiary': string
  'tn-primary': string
  'tn-secondary': string
}

export const THEMES: Record<string, Theme> = {
  'Rose Blush': {
    'bg-primary': '255, 228, 225',
    'bg-secondary': '255, 200, 200',
    'bg-tertiary': '255, 170, 170',
    'fnt-primary': '50, 30, 30',
    'fnt-secondary': '80, 50, 50',
    'fnt-tertiary': '110, 70, 70',
    'tn-primary': '255, 180, 180',
    'tn-secondary': '220, 150, 150'
  },
  'Lavender Love': {
    'bg-primary': '230, 230, 250',
    'bg-secondary': '210, 210, 230',
    'bg-tertiary': '190, 190, 210',
    'fnt-primary': '50, 30, 70',
    'fnt-secondary': '80, 60, 100',
    'fnt-tertiary': '110, 90, 130',
    'tn-primary': '200, 180, 255',
    'tn-secondary': '180, 160, 220'
  },
  'Passionate Red': {
    'bg-primary': '255, 105, 180',
    'bg-secondary': '255, 85, 160',
    'bg-tertiary': '255, 65, 140',
    'fnt-primary': '50, 30, 50',
    'fnt-secondary': '80, 50, 80',
    'fnt-tertiary': '110, 70, 110',
    'tn-primary': '255, 50, 100',
    'tn-secondary': '220, 40, 80'
  },
  'Soft Pink': {
    'bg-primary': '255, 200, 200',
    'bg-secondary': '255, 180, 180',
    'bg-tertiary': '255, 160, 160',
    'fnt-primary': '50, 30, 30',
    'fnt-secondary': '80, 50, 50',
    'fnt-tertiary': '110, 70, 70',
    'tn-primary': '255, 150, 150',
    'tn-secondary': '220, 120, 120'
  },
  'Romantic Purple': {
    'bg-primary': '200, 150, 255',
    'bg-secondary': '180, 130, 235',
    'bg-tertiary': '160, 110, 215',
    'fnt-primary': '50, 30, 70',
    'fnt-secondary': '80, 60, 100',
    'fnt-tertiary': '110, 90, 130',
    'tn-primary': '200, 100, 255',
    'tn-secondary': '180, 80, 235'
  },
  'Warm Embrace': {
    'bg-primary': '255, 220, 180',
    'bg-secondary': '255, 200, 160',
    'bg-tertiary': '255, 180, 140',
    'fnt-primary': '50, 30, 10',
    'fnt-secondary': '80, 50, 20',
    'fnt-tertiary': '110, 70, 30',
    'tn-primary': '255, 150, 50',
    'tn-secondary': '220, 120, 40'
  },
  'Blissful Blue': {
    'bg-primary': '173, 216, 230',
    'bg-secondary': '135, 206, 235',
    'bg-tertiary': '97, 196, 238',
    'fnt-primary': '30, 30, 50',
    'fnt-secondary': '60, 60, 80',
    'fnt-tertiary': '90, 90, 110',
    'tn-primary': '100, 180, 255',
    'tn-secondary': '80, 160, 235'
  },
  'Heartfelt Hue': {
    'bg-primary': '255, 180, 180',
    'bg-secondary': '255, 160, 160',
    'bg-tertiary': '255, 140, 140',
    'fnt-primary': '50, 30, 30',
    'fnt-secondary': '80, 50, 50',
    'fnt-tertiary': '110, 70, 70',
    'tn-primary': '255, 100, 100',
    'tn-secondary': '220, 80, 80'
  },
  'Eternal Flame': {
    'bg-primary': '255, 150, 50',
    'bg-secondary': '255, 130, 30',
    'bg-tertiary': '255, 110, 10',
    'fnt-primary': '50, 30, 10',
    'fnt-secondary': '80, 50, 20',
    'fnt-tertiary': '110, 70, 30',
    'tn-primary': '255, 100, 0',
    'tn-secondary': '220, 80, 0'
  },
  'Love at Dusk': {
    'bg-primary': '200, 150, 255',
    'bg-secondary': '180, 130, 235',
    'bg-tertiary': '160, 110, 215',
    'fnt-primary': '50, 30, 70',
    'fnt-secondary': '80, 60, 100',
    'fnt-tertiary': '110, 90, 130',
    'tn-primary': '200, 100, 255',
    'tn-secondary': '180, 80, 235'
  },
  // maso
  'Marble White': {
    'bg-primary': '240, 240, 240',
    'bg-secondary': '230, 230, 230',
    'bg-tertiary': '220, 220, 220',
    'fnt-primary': '30, 30, 50',
    'fnt-secondary': '60, 60, 80',
    'fnt-tertiary': '90, 90, 110',
    'tn-primary': '160, 160, 160',
    'tn-secondary': '180, 180, 180'
  },
  'Granite Gray': {
    'bg-primary': '120, 120, 120',
    'bg-secondary': '100, 100, 100',
    'bg-tertiary': '80, 80, 80',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '230, 230, 230',
    'fnt-tertiary': '200, 200, 200',
    'tn-primary': '60, 60, 60',
    'tn-secondary': '100, 100, 100'
  },
  'Obsidian Black': {
    'bg-primary': '30, 30, 30',
    'bg-secondary': '20, 20, 20',
    'bg-tertiary': '10, 10, 10',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '230, 230, 230',
    'fnt-tertiary': '200, 200, 200',
    'tn-primary': '100, 100, 100',
    'tn-secondary': '30, 30, 30'
  },
  // Chocolates
  Sandstone: {
    'bg-primary': '200, 180, 140',
    'bg-secondary': '180, 160, 120',
    'bg-tertiary': '160, 140, 100',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '230, 230, 230',
    'fnt-tertiary': '200, 200, 200',
    'tn-primary': '160, 140, 100',
    'tn-secondary': '200, 180, 140'
  },
  'Rustic Oak': {
    'bg-primary': '165, 124, 90',
    'bg-secondary': '145, 104, 70',
    'bg-tertiary': '125, 84, 50',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '230, 230, 230',
    'fnt-tertiary': '200, 200, 200',
    'tn-primary': '120, 70, 30',
    'tn-secondary': '170, 124, 80'
  },
  'Walnut Warmth': {
    'bg-primary': '100, 70, 50',
    'bg-secondary': '80, 50, 30',
    'bg-tertiary': '60, 30, 10',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '230, 230, 230',
    'fnt-tertiary': '200, 200, 200',
    'tn-primary': '50, 20, 0',
    'tn-secondary': '100, 70, 50'
  },
  'Ebony Elegance': {
    'bg-primary': '50, 40, 30',
    'bg-secondary': '40, 30, 20',
    'bg-tertiary': '30, 20, 10',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '230, 230, 230',
    'fnt-tertiary': '200, 200, 200',
    'tn-primary': '130, 120, 110',
    'tn-secondary': '50, 40, 30'
  },
  // mas omenos en blancos
  'Soft Cloud': {
    'bg-primary': '240, 240, 255',
    'bg-secondary': '220, 220, 245',
    'bg-tertiary': '200, 200, 235',
    'fnt-primary': '30, 30, 50',
    'fnt-secondary': '60, 60, 80',
    'fnt-tertiary': '90, 90, 110',
    'tn-primary': '0, 120, 240',
    'tn-secondary': '0, 100, 200'
  },
  'Fresh Snow': {
    'bg-primary': '250, 250, 250',
    'bg-secondary': '240, 240, 240',
    'bg-tertiary': '230, 230, 230',
    'fnt-primary': '30, 30, 50',
    'fnt-secondary': '60, 60, 80',
    'fnt-tertiary': '90, 90, 110',
    'tn-primary': '0, 120, 240',
    'tn-secondary': '0, 100, 200'
  },

  // paso oscuro

  'Dark Slate': {
    'bg-primary': '40, 40, 40',
    'bg-secondary': '50, 50, 50',
    'bg-tertiary': '60, 60, 60',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '0, 120, 240',
    'tn-secondary': '0, 100, 200'
  },
  'Twilight Pink': {
    'bg-primary': '50, 10, 30',
    'bg-secondary': '70, 20, 40',
    'bg-tertiary': '90, 30, 50',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '255, 100, 150',
    'tn-secondary': '220, 80, 120'
  },

  // pasan pasteles
  'Nebula Light': {
    'bg-primary': '255, 240, 255',
    'bg-secondary': '245, 220, 245',
    'bg-tertiary': '235, 200, 235',
    'fnt-primary': '30, 30, 50',
    'fnt-secondary': '60, 60, 80',
    'fnt-tertiary': '90, 90, 110',
    'tn-primary': '230, 173, 230',
    'tn-secondary': '235, 135, 235'
  },
  'Peach Sorbet': {
    'bg-primary': '255, 220, 200',
    'bg-secondary': '255, 200, 180',
    'bg-tertiary': '255, 180, 160',
    'fnt-primary': '50, 30, 20',
    'fnt-secondary': '80, 50, 40',
    'fnt-tertiary': '110, 70, 60',
    'tn-primary': '255, 180, 150',
    'tn-secondary': '220, 160, 130'
  },
  'Cotton Candy': {
    'bg-primary': '255, 200, 240',
    'bg-secondary': '255, 180, 220',
    'bg-tertiary': '255, 160, 200',
    'fnt-primary': '50, 30, 50',
    'fnt-secondary': '80, 50, 80',
    'fnt-tertiary': '110, 70, 110',
    'tn-primary': '255, 150, 200',
    'tn-secondary': '220, 130, 180'
  },

  // PASAN PERO LETRA
  'Coral Reef': {
    'bg-primary': '255, 127, 80',
    'bg-secondary': '255, 110, 70',
    'bg-tertiary': '255, 95, 60',
    'fnt-primary': '50, 30, 10',
    'fnt-secondary': '80, 50, 20',
    'fnt-tertiary': '110, 70, 30',
    'tn-primary': '255, 100, 50',
    'tn-secondary': '220, 80, 40'
  },
  'Tropical Sunset': {
    'bg-primary': '255, 105, 180',
    'bg-secondary': '255, 90, 160',
    'bg-tertiary': '255, 75, 140',
    'fnt-primary': '50, 30, 50',
    'fnt-secondary': '80, 50, 80',
    'fnt-tertiary': '110, 70, 110',
    'tn-primary': '255, 50, 150',
    'tn-secondary': '220, 40, 120'
  },
  'Volcanic Red': {
    'bg-primary': '220, 20, 60',
    'bg-secondary': '200, 15, 50',
    'bg-tertiary': '180, 10, 40',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '255, 50, 100',
    'tn-secondary': '220, 40, 80'
  },

  //pastel
  'Pastel Pink': {
    'bg-primary': '255, 230, 230',
    'bg-secondary': '250, 200, 200',
    'bg-tertiary': '240, 170, 170',
    'fnt-primary': '50, 30, 30',
    'fnt-secondary': '80, 50, 50',
    'fnt-tertiary': '110, 70, 70',
    'tn-primary': '255, 180, 180',
    'tn-secondary': '220, 150, 150'
  },
  'Lavender Dream': {
    'bg-primary': '240, 230, 255',
    'bg-secondary': '220, 210, 245',
    'bg-tertiary': '200, 190, 235',
    'fnt-primary': '50, 30, 70',
    'fnt-secondary': '80, 60, 100',
    'fnt-tertiary': '110, 90, 130',
    'tn-primary': '200, 180, 255',
    'tn-secondary': '180, 160, 220'
  },
  'Baby Blue': {
    'bg-primary': '200, 230, 255',
    'bg-secondary': '180, 210, 245',
    'bg-tertiary': '160, 190, 235',
    'fnt-primary': '30, 50, 70',
    'fnt-secondary': '60, 80, 100',
    'fnt-tertiary': '90, 110, 130',
    'tn-primary': '150, 200, 255',
    'tn-secondary': '120, 180, 220'
  },
  'Peach Blossom': {
    'bg-primary': '255, 230, 200',
    'bg-secondary': '250, 210, 180',
    'bg-tertiary': '240, 190, 160',
    'fnt-primary': '50, 30, 10',
    'fnt-secondary': '80, 50, 20',
    'fnt-tertiary': '110, 70, 30',
    'tn-primary': '255, 200, 150',
    'tn-secondary': '220, 180, 130'
  },
  'Galactic Nebula': {
    'bg-primary': '15, 15, 30',
    'bg-secondary': '25, 25, 45',
    'bg-tertiary': '35, 35, 60',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '0, 200, 255',
    'tn-secondary': '0, 150, 200'
  },

  //Mas o menos

  'Vibrant Sunrise': {
    'bg-primary': '255, 150, 50',
    'bg-secondary': '255, 120, 30',
    'bg-tertiary': '255, 90, 10',
    'fnt-primary': '50, 30, 10',
    'fnt-secondary': '80, 50, 20',
    'fnt-tertiary': '110, 70, 30',
    'tn-primary': '255, 100, 0',
    'tn-secondary': '220, 80, 0'
  },
  'Electric Violet': {
    'bg-primary': '50, 0, 70',
    'bg-secondary': '70, 0, 100',
    'bg-tertiary': '90, 0, 130',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '150, 0, 200',
    'tn-secondary': '200, 0, 255'
  },
  'Radiant Orchid': {
    'bg-primary': '200, 100, 200',
    'bg-secondary': '180, 80, 180',
    'bg-tertiary': '160, 60, 160',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '255, 105, 180',
    'tn-secondary': '255, 50, 120'
  },
  'Fiery Sunset': {
    'bg-primary': '255, 100, 50',
    'bg-secondary': '255, 80, 30',
    'bg-tertiary': '255, 60, 10',
    'fnt-primary': '50, 30, 10',
    'fnt-secondary': '80, 50, 20',
    'fnt-tertiary': '110, 70, 30',
    'tn-primary': '255, 50, 0',
    'tn-secondary': '220, 40, 0'
  },
  'Celestial Blue': {
    'bg-primary': '0, 50, 100',
    'bg-secondary': '0, 70, 130',
    'bg-tertiary': '0, 90, 160',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '0, 150, 255',
    'tn-secondary': '0, 120, 220'
  },
  'Luminous Green': {
    'bg-primary': '50, 150, 50',
    'bg-secondary': '70, 180, 70',
    'bg-tertiary': '90, 210, 90',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '0, 200, 100',
    'tn-secondary': '0, 180, 80'
  },
  'Mystic Teal': {
    'bg-primary': '0, 100, 100',
    'bg-secondary': '0, 120, 120',
    'bg-tertiary': '0, 140, 140',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '0, 255, 255',
    'tn-secondary': '0, 200, 200'
  },
  'Radiant Gold': {
    'bg-primary': '200, 150, 50',
    'bg-secondary': '220, 170, 70',
    'bg-tertiary': '240, 190, 90',
    'fnt-primary': '50, 30, 10',
    'fnt-secondary': '80, 50, 20',
    'fnt-tertiary': '110, 70, 30',
    'tn-primary': '255, 200, 50',
    'tn-secondary': '220, 180, 40'
  },
  'Cosmic Fusion': {
    'bg-primary': '50, 0, 70',
    'bg-secondary': '70, 0, 100',
    'bg-tertiary': '90, 0, 130',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '255, 0, 255',
    'tn-secondary': '200, 0, 200'
  },

  //Primeros 10
  'Cherry Blossom': {
    'bg-primary': '255, 220, 220',
    'bg-secondary': '255, 180, 180',
    'bg-tertiary': '255, 140, 140',
    'fnt-primary': '50, 20, 20',
    'fnt-secondary': '100, 40, 40',
    'fnt-tertiary': '150, 60, 60',
    'tn-primary': '255, 105, 180',
    'tn-secondary': '255, 50, 120'
  },
  'Deep Ocean': {
    'bg-primary': '0, 50, 70',
    'bg-secondary': '0, 70, 100',
    'bg-tertiary': '0, 90, 130',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '0, 200, 255',
    'tn-secondary': '0, 150, 200'
  },
  'Forest Twilight': {
    'bg-primary': '30, 40, 30',
    'bg-secondary': '40, 60, 40',
    'bg-tertiary': '50, 80, 50',
    'fnt-primary': '210, 230, 210',
    'fnt-secondary': '150, 180, 150',
    'fnt-tertiary': '100, 140, 100',
    'tn-primary': '0, 150, 50',
    'tn-secondary': '0, 200, 100'
  },
  'Sunrise Glow': {
    'bg-primary': '255, 200, 150',
    'bg-secondary': '255, 180, 120',
    'bg-tertiary': '255, 160, 90',
    'fnt-primary': '50, 30, 10',
    'fnt-secondary': '80, 50, 20',
    'fnt-tertiary': '110, 70, 30',
    'tn-primary': '255, 100, 50',
    'tn-secondary': '220, 80, 40'
  },
  'Mystic Purple': {
    'bg-primary': '80, 40, 100',
    'bg-secondary': '100, 60, 130',
    'bg-tertiary': '120, 80, 160',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '150, 100, 200',
    'tn-secondary': '200, 150, 230'
  },
  'Icy Blue': {
    'bg-primary': '180, 220, 255',
    'bg-secondary': '160, 200, 245',
    'bg-tertiary': '140, 180, 235',
    'fnt-primary': '20, 30, 50',
    'fnt-secondary': '40, 50, 70',
    'fnt-tertiary': '60, 70, 90',
    'tn-primary': '0, 120, 240',
    'tn-secondary': '0, 100, 200'
  },
  'Golden Sunset': {
    'bg-primary': '255, 200, 100',
    'bg-secondary': '255, 180, 80',
    'bg-tertiary': '255, 160, 60',
    'fnt-primary': '50, 30, 10',
    'fnt-secondary': '80, 50, 20',
    'fnt-tertiary': '110, 70, 30',
    'tn-primary': '255, 150, 50',
    'tn-secondary': '220, 120, 40'
  },
  'Emerald Forest': {
    'bg-primary': '50, 100, 50',
    'bg-secondary': '70, 130, 70',
    'bg-tertiary': '90, 160, 90',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 200, 200',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '0, 150, 50',
    'tn-secondary': '0, 200, 100'
  },
  'Cosmic Night': {
    'bg-primary': '30, 30, 50',
    'bg-secondary': '40, 40, 70',
    'bg-tertiary': '50, 50, 90',
    'fnt-primary': '230, 230, 250',
    'fnt-secondary': '180, 180, 220',
    'fnt-tertiary': '130, 130, 190',
    'tn-primary': '100, 100, 255',
    'tn-secondary': '80, 80, 220'
  },
  'Rustic Sunrise': {
    'bg-primary': '255, 180, 120',
    'bg-secondary': '255, 150, 90',
    'bg-tertiary': '255, 120, 60',
    'fnt-primary': '50, 30, 10',
    'fnt-secondary': '80, 50, 20',
    'fnt-tertiary': '110, 70, 30',
    'tn-primary': '255, 100, 50',
    'tn-secondary': '220, 80, 40'
  },

  // Temas oscuros
  'Purple Dark': {
    'bg-primary': '19, 20, 23',
    'bg-secondary': '35, 35, 37',
    'bg-tertiary': '55, 55, 61',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '174, 174, 174',
    'fnt-tertiary': '255, 146, 172',
    'tn-primary': '157, 44, 255',
    'tn-secondary': '154, 190, 254'
  },
  Carbon: {
    'bg-primary': '12, 12, 12',
    'bg-secondary': '22, 22, 22',
    'bg-tertiary': '32, 32, 32',
    'fnt-primary': '245, 245, 245',
    'fnt-secondary': '190, 190, 190',
    'fnt-tertiary': '140, 140, 140',
    'tn-primary': '50, 230, 130',
    'tn-secondary': '40, 220, 130'
  },
  Dracula: {
    'bg-primary': '40, 42, 54',
    'bg-secondary': '68, 71, 90',
    'bg-tertiary': '33, 34, 45',
    'fnt-primary': '248, 248, 242',
    'fnt-secondary': '189, 147, 249',
    'fnt-tertiary': '139, 233, 253',
    'tn-primary': '139, 233, 253',
    'tn-secondary': '220, 70, 70'
  },
  Circuit: {
    'bg-primary': '10, 15, 25',
    'bg-secondary': '20, 30, 40',
    'bg-tertiary': '45, 50, 65',
    'fnt-primary': '255, 20, 147',
    'fnt-secondary': '0, 255, 255',
    'fnt-tertiary': '255, 105, 180',
    'tn-primary': '0, 255, 0',
    'tn-secondary': '0, 200, 0'
  },
  'Synth wave 84': {
    'bg-primary': '10, 10, 30',
    'bg-secondary': '20, 20, 40',
    'bg-tertiary': '30, 30, 50',
    'fnt-primary': '255, 0, 255',
    'fnt-secondary': '0, 255, 255',
    'fnt-tertiary': '255, 255, 0',
    'tn-primary': '255, 105, 180',
    'tn-secondary': '220, 90, 160'
  },
  Nebula: {
    'bg-primary': '20, 20, 40',
    'bg-secondary': '30, 30, 60',
    'bg-tertiary': '40, 40, 80',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '200, 100, 255',
    'fnt-tertiary': '150, 0, 255',
    'tn-primary': '255, 0, 128',
    'tn-secondary': '220, 0, 110'
  },
  Eclipse: {
    'bg-primary': '5, 5, 5',
    'bg-secondary': '15, 15, 15',
    'bg-tertiary': '25, 25, 25',
    'fnt-primary': '230, 230, 230',
    'fnt-secondary': '160, 160, 160',
    'fnt-tertiary': '100, 100, 100',
    'tn-primary': '255, 150, 50',
    'tn-secondary': '230, 130, 40'
  },
  Midnight: {
    'bg-primary': '10, 25, 50',
    'bg-secondary': '20, 40, 70',
    'bg-tertiary': '30, 60, 90',
    'fnt-primary': '210, 230, 250',
    'fnt-secondary': '150, 180, 210',
    'fnt-tertiary': '100, 140, 180',
    'tn-primary': '50, 100, 255',
    'tn-secondary': '40, 80, 220'
  },
  Obsidian: {
    'bg-primary': '20, 20, 20',
    'bg-secondary': '40, 40, 40',
    'bg-tertiary': '60, 60, 60',
    'fnt-primary': '220, 220, 220',
    'fnt-secondary': '180, 180, 180',
    'fnt-tertiary': '140, 140, 140',
    'tn-primary': '255, 70, 70',
    'tn-secondary': '220, 60, 60'
  },
  Forest: {
    'bg-primary': '20, 30, 20',
    'bg-secondary': '30, 40, 30',
    'bg-tertiary': '40, 50, 40',
    'fnt-primary': '180, 220, 150',
    'fnt-secondary': '120, 160, 90',
    'fnt-tertiary': '220, 220, 150',
    'tn-primary': '255, 165, 0',
    'tn-secondary': '100, 150, 90'
  },
  Neon: {
    'bg-primary': '10, 10, 10',
    'bg-secondary': '20, 20, 20',
    'bg-tertiary': '30, 30, 30',
    'fnt-primary': '0, 255, 0',
    'fnt-secondary': '0, 200, 255',
    'fnt-tertiary': '255, 0, 255',
    'tn-primary': '255, 255, 0',
    'tn-secondary': '0, 128, 255'
  },
  Velvet: {
    'bg-primary': '20, 10, 30',
    'bg-secondary': '30, 20, 40',
    'bg-tertiary': '40, 30, 50',
    'fnt-primary': '220, 180, 255',
    'fnt-secondary': '180, 140, 220',
    'fnt-tertiary': '140, 100, 180',
    'tn-primary': '255, 105, 180',
    'tn-secondary': '255, 20, 147'
  },
  Magma: {
    'bg-primary': '50, 10, 10',
    'bg-secondary': '70, 20, 20',
    'bg-tertiary': '90, 30, 30',
    'fnt-primary': '255, 180, 100',
    'fnt-secondary': '255, 140, 60',
    'fnt-tertiary': '255, 100, 20',
    'tn-primary': '255, 255, 0',
    'tn-secondary': '255, 69, 0'
  },
  Aurora: {
    'bg-primary': '10, 20, 20',
    'bg-secondary': '20, 30, 30',
    'bg-tertiary': '30, 40, 40',
    'fnt-primary': '0, 255, 128',
    'fnt-secondary': '0, 192, 255',
    'fnt-tertiary': '128, 0, 255',
    'tn-primary': '255, 0, 128',
    'tn-secondary': '0, 255, 200'
  },

  'Aurora Day': {
    'bg-primary': '245, 245, 250',
    'bg-secondary': '230, 235, 250',
    'bg-tertiary': '210, 220, 240',
    'fnt-primary': '20, 20, 40',
    'fnt-secondary': '60, 90, 130',
    'fnt-tertiary': '100, 140, 100',
    'tn-primary': '255, 100, 150',
    'tn-secondary': '200, 150, 180'
  },
  'Pastel Horizon': {
    'bg-primary': '250, 245, 255',
    'bg-secondary': '235, 225, 245',
    'bg-tertiary': '220, 210, 235',
    'fnt-primary': '40, 40, 70',
    'fnt-secondary': '80, 100, 150',
    'fnt-tertiary': '140, 80, 140',
    'tn-primary': '250, 150, 200',
    'tn-secondary': '220, 120, 180'
  },

  Cloud: {
    'bg-primary': '248, 248, 255',
    'bg-secondary': '238, 238, 250',
    'bg-tertiary': '228, 228, 245',
    'fnt-primary': '35, 35, 50',
    'fnt-secondary': '85, 85, 100',
    'fnt-tertiary': '135, 135, 150',
    'tn-primary': '0, 108, 229',
    'tn-secondary': '0, 90, 200'
  },
  Blue: {
    'bg-primary': '240, 248, 255',
    'bg-secondary': '224, 224, 255',
    'bg-tertiary': '200, 220, 255',
    'fnt-primary': '10, 10, 25',
    'fnt-secondary': '50, 50, 100',
    'fnt-tertiary': '0, 0, 0',
    'tn-primary': '0, 122, 204',
    'tn-secondary': '0, 100, 180'
  },
  'GitHub Light': {
    'bg-primary': '255, 255, 255',
    'bg-secondary': '250, 251, 252',
    'bg-tertiary': '230, 232, 235',
    'fnt-primary': '36, 41, 46',
    'fnt-secondary': '88, 96, 105',
    'fnt-tertiary': '135, 141, 146',
    'tn-primary': '3, 102, 214',
    'tn-secondary': '0, 85, 180'
  },
  Ivory: {
    'bg-primary': '255, 255, 240',
    'bg-secondary': '245, 245, 230',
    'bg-tertiary': '235, 235, 220',
    'fnt-primary': '50, 50, 50',
    'fnt-secondary': '100, 100, 100',
    'fnt-tertiary': '150, 150, 150',
    'tn-primary': '200, 160, 100',
    'tn-secondary': '180, 140, 90'
  },
  Pearl: {
    'bg-primary': '255, 250, 250',
    'bg-secondary': '245, 240, 240',
    'bg-tertiary': '235, 230, 230',
    'fnt-primary': '40, 40, 40',
    'fnt-secondary': '90, 90, 90',
    'fnt-tertiary': '140, 140, 140',
    'tn-primary': '255, 120, 130',
    'tn-secondary': '230, 100, 110'
  },

  // Temas exóticos
  'Sunny Meadow': {
    'bg-primary': '245, 255, 240',
    'bg-secondary': '230, 245, 220',
    'bg-tertiary': '210, 235, 200',
    'fnt-primary': '30, 40, 30',
    'fnt-secondary': '80, 100, 60',
    'fnt-tertiary': '100, 130, 90',
    'tn-primary': '240, 170, 50',
    'tn-secondary': '180, 220, 90'
  },
  Citrus: {
    'bg-primary': '250, 250, 200',
    'bg-secondary': '255, 200, 150',
    'bg-tertiary': '240, 150, 100',
    'fnt-primary': '50, 50, 50',
    'fnt-secondary': '100, 50, 0',
    'fnt-tertiary': '150, 100, 50',
    'tn-primary': '200, 100, 0',
    'tn-secondary': '255, 165, 0'
  },
  Candy: {
    'bg-primary': '255, 200, 200',
    'bg-secondary': '255, 180, 220',
    'bg-tertiary': '240, 160, 210',
    'fnt-primary': '50, 20, 50',
    'fnt-secondary': '100, 40, 100',
    'fnt-tertiary': '150, 60, 150',
    'tn-primary': '255, 90, 90',
    'tn-secondary': '255, 105, 180'
  },
  Almond: {
    'bg-primary': '255, 235, 205',
    'bg-secondary': '245, 225, 195',
    'bg-tertiary': '235, 215, 185',
    'fnt-primary': '80, 60, 40',
    'fnt-secondary': '120, 80, 60',
    'fnt-tertiary': '160, 100, 80',
    'tn-primary': '210, 150, 100',
    'tn-secondary': '190, 140, 90'
  },
  Lavender: {
    'bg-primary': '240, 230, 255',
    'bg-secondary': '220, 210, 245',
    'bg-tertiary': '200, 190, 235',
    'fnt-primary': '50, 30, 70',
    'fnt-secondary': '100, 80, 120',
    'fnt-tertiary': '150, 130, 170',
    'tn-primary': '150, 100, 200',
    'tn-secondary': '200, 150, 230'
  },
  Sky: {
    'bg-primary': '200, 230, 255',
    'bg-secondary': '180, 210, 245',
    'bg-tertiary': '160, 190, 235',
    'fnt-primary': '30, 50, 70',
    'fnt-secondary': '60, 80, 100',
    'fnt-tertiary': '90, 110, 130',
    'tn-primary': '0, 100, 200',
    'tn-secondary': '100, 180, 255'
  },
  Emerald: {
    'bg-primary': '150, 220, 180',
    'bg-secondary': '120, 190, 150',
    'bg-tertiary': '90, 160, 120',
    'fnt-primary': '20, 50, 30',
    'fnt-secondary': '40, 80, 60',
    'fnt-tertiary': '60, 110, 90',
    'tn-primary': '0, 150, 80',
    'tn-secondary': '0, 200, 120'
  }
}
