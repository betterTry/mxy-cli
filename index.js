const program = require('commander');
const exists = require('fs').existsSync
const inquirer = require('inquirer')
const path = require('path');
const chalk = require('chalk');
const home = require('user-home')
const rm = require('rimraf').sync
const download = require('download-git-repo')
const ora = require('ora')
const exist = require('fs').existsSync
const generate = require('./lib/generate')
const exec = require('child_process').execSync



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

const template = program.args[1]
const rawName = program.args[2]
const to = path.resolve(rawName || '.')
const inPlace = !rawName || rawName === '.'
const tmp = path.join(home, '.vue-templates', template.replace(/\//g, '-'))
const clone = program.clone || false

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
  if (exists(to)) { // 存在时;
    inquirer.prompt([{
      type: 'confirm',
      message: inPlace
        ? 'Generate project in current directory?'
        : 'Target directory exists. Continue?',
      name: 'ok'
    }]).then(answers => {
      if (answers.ok) {
        console.log('ok')
      } else {
        console.log('not ok')
      }
    }).catch((e) => {
      console.log(e)
    })
  } else {
    const _tmp = 'vuejs-templates/' + template;
    console.log(_tmp)
    downloadAndGenerate(_tmp);

  }
}

function downloadAndGenerate(template) {
  const spinner = ora('downloading template')
  spinner.start()
  console.log()
  console.log(tmp)
  console.log(exist(tmp))
  if (exist(tmp)) rm(tmp)
  download(template, tmp, {clone}, err => {
    spinner.stop()
    if (err) console.log(err)
    generate('a', tmp, to);
  })
}
