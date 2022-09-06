require('./config')


const globAll = require("glob-all")

const seed = async () => {
  const requireAll = globAll.sync([
    'seeds/**/*.js',
    '!seeds/config.js',
    '!seeds/seeds.js'
  ]).map((filepath) => {
    console.log('Seeding: ', filepath)
    return require(`../${filepath}`)
  })

  await Promise.all(requireAll)
  process.exit(1)
}

seed()
