const program = require('commander');
const inquirer = require('inquirer')
const path = require('path');
const chalk = require('chalk');
const home = require('user-home')
const download = require('download-git-repo')
const ora = require('ora')
const Metalsmith = require('metalsmith')
const rm = require('rimraf').sync
const exists = require('fs').existsSync
const exec = require('child_process').execSync
const generate = require('./lib/generate')
const localPath = require('./lib/local-path')



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

function help () {
  if (program.args.length < 2) {
    return program.help()
  }
}
help()

const template = program.args[1]
const rawName = program.args[2]
const to = path.resolve(rawName || '.')
const inPlace = !rawName || rawName === '.'
const name =  inPlace ? path.relative('../', process.cwd()) : rawName
const tmp = path.join(home, '.vue-templates', template.replace(/\//g, '-'))
const hasSlash = template.indexOf('/') > -1
const clone = program.clone || false


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
        run()
      }
    }).catch((e) => {
      console.log(e)
    })
  } else {
    run()
  }
}

function run() {
  if (localPath.isLocalPath(template)) {
    const templatePath = localPath.getLocalPath(template)
    if (exists(templatePath)) {
      generate(rawName, templatePath, to, err => {
        if (err) console.log(err)
      })
    } else {
      console.error('not exist this template "%s" in local', template);
    }
  } else {
    // 不是本地;
    if (!hasSlash) {
      const _tmp = 'vuejs-templates/' + template;
      downloadAndGenerate(_tmp)
    } else {
      downloadAndGenerate(template)
    }
  }
}

function downloadAndGenerate(template) {
  const spinner = ora('downloading template')
  spinner.start()
  // console.log(tmp)
  if (exists(tmp)) rm(tmp)
  download(template, tmp, {clone}, err => {
    spinner.stop()
    if (err) console.log(err)
    generate(rawName, tmp, to, (err) => {
      if (err) {
        console.log(err)
        process.exit()
      } else {
        console.log('done')
        process.exit(1)
      }
    });
  })

}
