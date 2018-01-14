const match = require('minimatch')
const evaluate = require('./evaluate')

/**
 * @param {files <Object>}: files of metalsmith
 * @param {filters <Object>}: filters of meta
 * @param {data <Object>}: prompt data
 * @param {done <Function>}: done the plugin
 */
module.exports = function filter(files, filters, data, done) {
  if (!filters) return done()
  Object.keys(files).forEach((fileName) => {
    Object.keys(filters).forEach((glob) => {
      if (match(fileName, glob, {dot: true})) {
        const exp = filters[glob]
        if (!evaluate(exp, data)) {
          delete files[fileName];
        }
      }
    })
  })
  done()
}
