const handlebars = require('handlebars')
const {eachPromise, createPromise} = require('./eachPromise')


function render(file, data, resolve) {
  const str = file.contents.toString()
  if (!/{{([^{}]+)}}/g.test(str)) {
    return resolve();
  }

  const handledStr = handlebars.compile(str)(data)
  file.contents = new Buffer(handledStr)
  resolve()
}


module.exports = function(files, data, done) {
  eachPromise(Object.keys(files), (file) => {
    return function() {
      return createPromise(files[file], data, render)
    }
  }, done)
}
