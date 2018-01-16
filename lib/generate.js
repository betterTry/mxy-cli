const path = require('path')
const Metalsmith = require('metalsmith')
const ask = require('./ask')
const filter = require('./filter')
const getOpitons = require('./options')
const render = require('./render')
const complate = require('./complate')


// 会将进程挂起;
module.exports = function generate(name, src, dest, cb) {
  const metalsmith = new Metalsmith(path.join(src, 'template'))
  const {prompts, filters} = getOpitons(name, src)
  const metadata = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true,
  })
  metalsmith.use((files, metalsmith, done) => {
    ask(prompts, metadata, done)
  }).use((files, metalsmith, done) => {
    filter(files, filters, metadata, done)
  }).use((files, metalsmith, done) => {
    render(files, metadata, done)
  })
  metalsmith.clean(false)
    .source('.')
    .destination(dest)
    .build((err, files) => {
      if (metadata.autoInstall) {
        complate(metadata.autoInstall, dest)
        .then(() => {cb(err, metadata.name)})
      } else {
        cb(err, metadata.name)
      }
    })
}
