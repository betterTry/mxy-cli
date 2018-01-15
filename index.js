const program = require('commander');
const inquirer = require('inquirer')
const path = require('path');
const chalk = require('chalk');
const home = require('user-home')
const download = require('download-git-repo')
const ora = require('ora')
const tildify = require('tildify')
const Metalsmith = require('metalsmith')
const rm = require('rimraf').sync
const exists = require('fs').existsSync
const exec = require('child_process').execSync
const generate = require('./lib/generate')
const localPath = require('./lib/local-path')


program
  .version(require('./package').version)
  .usage('<command> [options]')
  .option('--offline', 'check the version')

program.parse(process.argv)

program.on('--help', () => {
  console.log(
    '\n',
    '  Examples:\n',
    chalk.gray('    # create a new project with an official template\n\r'),
    '    $ mxy init webpack my-project\n',
    chalk.gray('    # create a new project straight from a github template\n\r'),
    '    $ mxy init username/repo my-project\n'
  )
})

function help () {
  if (program.args.length < 2) {
    return program.help()
  }
}
help()

let template = program.args[1]
const rawName = program.args[2]
const to = path.resolve(rawName || '.')
const inPlace = !rawName || rawName === '.'
const name =  inPlace ? path.relative('../', process.cwd()) : rawName
template = template.indexOf('-template') > 0 ? template : template + '-template'
const tmp = path.join(home, '.mxy-templates', template.replace(/\//g, '-'))
const hasSlash = template.indexOf('/') > -1
const clone = program.clone || false
const offline = program.offline || false

if (program.offline) {
  template = tmp
  console.log(
    '> Use cached template at ',
    chalk.yellow(tildify(tmp))
  )
}

if (program.args[0] == 'init') {
  handleInit();
}


function handleInit() {
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
      generate(rawName, templatePath, to, (err, name) => {
        if (err) console.log(err)
        console.log(
          '\n',
          chalk.green(`Project \`${name}\` has been created successfully.\n`),
          chalk.green('Have a good time!\n'),
        )
      })
    } else {
      console.error('not exist this template "%s" in local', template);
    }
  } else {
    // 不是本地;
    if (!hasSlash) {
      const _tmp = 'betterTry/' + template;
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
  console.log(tmp)
  if (exists(tmp)) rm(tmp)
  download(template, tmp, {clone}, err => {
    spinner.stop()
    if (err) {
      console.log(1)
      console.log(err)
    }
    generate(rawName, tmp, to, (err, name) => {
      if (err) {
        console.error(err)
        process.exit(1)
      } else {
        console.log(
          '\n',
          chalk.green(`Project \`${name}\` has been created successfully.\n`),
          chalk.green('Have a good time!\n'),
        )
        process.exit()
      }
    });
  })

}
