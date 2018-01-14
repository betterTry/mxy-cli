const prompt = require('./prompt')
const {eachPromise, createPromise} = require('./eachPromise')

module.exports = function ask(prompts, data, done) {
  eachPromise(Object.keys(prompts), (key) => {
    return function() {
      return createPromise(data, key, prompts[key], prompt)
    }
  }, done)
}
