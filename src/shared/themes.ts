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
