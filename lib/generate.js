const path = require('path')
const Metalsmith = require('metalsmith')
const inquirer = require('require')
const opts = require('./getOpitons')


module.exports = function(name, src, dest) {
  const metalsmith = new Metalsmith(path.join(src, 'template'));
  metalsmith.use(function(files, metalsmith) {
    for ()
  });
  metalsmith.use(function(files, metalsmith) {
  })
  metalsmith.clean(false)
    .source('.')
    .destination(dest)
    .build((err, files) => {
      // console.log(files);
    })
}
