const inquirer = require('inquirer')
const evaluate = require('./evaluate')

const promptMap = {
  string: 'input',
  boolean: 'confirm',
}

/**
 * @param {data}: metalsmith.metadata()
 * @param {name}: name of prompt
 * @param {prompt}: prompt
 * @param {resolve}: Promose.resolve
 **/
module.exports = function(data, name, prompt, resolve) {
  if (prompt.when && !evaluate(prompt.when, data)) {
    return resolve();
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
