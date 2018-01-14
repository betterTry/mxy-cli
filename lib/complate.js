const spawn = require('child_process').spawn
const path = require('path')

module.exports = function(command = 'npm', dest) {
  const ch = spawn(command, ['install'], {
    cwd: dest || process.cwd(),
    shell: true,
    stdio: 'inherit',
  })
  ch.on('exit', () => {
    console.log('ok')
  })
}
