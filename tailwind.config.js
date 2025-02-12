import animations from '@midudev/tailwind-animations'

const config = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/shared/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {}
  },
  plugins: [animations]
}
export default config
