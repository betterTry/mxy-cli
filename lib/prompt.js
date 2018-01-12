const inquirer = require('inquirer')
const chalk = require('chalk')

const promptMap = {
  string: 'input',
  boolean: 'confirm',
}

module.exports = function(data, name, prompt, resolve) {
  if (prompt.when && !evaluate(prompt.when, data)) {
    return;
  }
  inquirer.prompt({
    type: promptMap[prompt.type] || prompt.type,
    name,
    default: prompt.default,
    message: prompt.message,
    choices: prompt.choices || [],
    validate: prompt.validate || (() => true),
  })
  .then(answers => {
    console.log(answers)
    if (Array.isArray(answers[name])) {
      data[name] = {}
      answers[name].forEach((subAnswer) => {
        data[name][subAnswer] = true
      })
    } else if (typeof answers[name] === 'string') {
      data[name] = answers[name].replace(/"/g, '\\"')
    } else {
      data[name] = answers[name]
    }
    resolve()
  }).catch(resolve)
}

function evaluate(exp, data) {
  const fn = new Function('data', 'with(data) {return ' + exp + '}')
  try {
    return fn(data)
  } catch(e) {
    console.error(chalk.red('Error with evaluating the expression: ' + exp))
  }
}
