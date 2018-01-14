const chalk = require('chalk')

module.exports = function(exp, data) {
  const fn = new Function('data', 'with(data) { return ' + exp + '}')
  let result
  try {
    return fn(data)
  } catch(e) {
    console.log(e)
    console.error(chalk.red('Error with evaluating the expression: ' + exp))
  }
}
