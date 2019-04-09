const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [

    tailwindcss('./tailwind.config.js'),
    purgecss({
      content: ['./src/index.html']
    })
    autoprefixer
  ]
}