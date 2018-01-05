const program = require('commander');
const exists = require('fs').existsSync
const inquirer = require('inquirer')
const path = require('path');
const chalk = require('chalk');

program
  .version(require('./package').version)
  .usage('<command> [options]')
  .option('--gulp', 'check the version')

program.parse(process.argv)

program.on('--help', () => {
  console.log()
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new project with an official template'))
  console.log('    $ mxy init webpack my-project')
  console.log()
  console.log(chalk.gray('    # create a new project straight from a github template'))
  console.log('    $ mxy init username/repo my-project')
  console.log()
})

const rawName = program.args[1]
const to = path.resolve(rawName || '.')
const inPlace = !rawName || rawName === '.'

function help () {
  if (program.args.length < 2) {
    return program.help()
  }
}
help()


if (program.args[0] == 'init') {
  handleInit();
}


function handleInit() {
  console.log(to);
  if (exists(to)) {
    inquirer.prompt([{
      type: 'confirm',
      message: inPlace
        ? 'Generate project in current directory?'
        : 'Target directory exists. Continue?',
      name: 'ok'
    }]).then(answers => {
      if (answers.ok) {
        console.log('ok');
      } else {
        console.log('not ok');
      }
    }).catch((e) => {console.log(33)})
  } else {
    console.log('not exist');
  }
}
