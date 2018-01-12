const path = require('path')
const Metalsmith = require('metalsmith')
const getOpitons = require('./options')
const prompt = require('./prompt')


// 会将进程挂起;
module.exports = function(name, src, dest, cb) {
  const metalsmith = new Metalsmith(path.join(src, 'template'))
  const {prompts} = getOpitons(name, src)
  metalsmith.use(function(files, metalsmith, done) {
    ask(prompts, metalsmith.metadata(), done)
  }).use(function(files, metalsmith, done) {
    done()
  })
  metalsmith.clean(false)
    .source('.')
    .destination(dest)
    .build((err, files) => {
      cb(err)
    })
}

function ask(prompts, data, done) {
  eachPromise(Object.keys(prompts), (key) => {
    return function() {
      return createPromise(data, key, prompts[key], prompt)
    }
  }, done)
}

function createPromise() {
  const args = Array.prototype.slice.call(arguments)
  const func = args.pop()
  return new Promise(resolve => {
    func(...args, resolve);
  })
}

/**
 * @param {arr} <Array>
 * @param {func} promise factory function
 * @param {done} Promise.resolve
 */
function eachPromise(arr, func, done) {
  promiseFactories = arr.map((item) => {
    return func(item);
  });

  let result = Promise.resolve()
  promiseFactories.forEach((factory) => {
    result = result.then(factory)
  })
  result.then(() => {
    done();
  });
}
