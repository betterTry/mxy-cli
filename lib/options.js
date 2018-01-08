cons path = require('path')
const exist = require('fs').existsSync
const gitUser = require('./git-user')
const metadata = require('read-metadata')
const validateName = require('validate-npm-package-name')

module.exports = function getOpitons(name, dir) {
  const opts = getMetaData(dir);
  setDefault(opts, 'name', name);
  setValidateName(opts)
  const auther = gitUser();
  auther && setDefault(opts, 'auther', auther)
  return opts
}

const getMetaData(dir) {
  const js = path.join(dir, 'meta.js')
  const json = path.join(dir, 'meta.json')
  let opts = {}
  if (exist(json)) {
    opts = metadata.sync(json)
  } else if (exist(js)) {
    const req = require(path.resolve(js))
    if (req !== Object(req)) {
      throw new Error('meta.js needs to expose an object')
    }
    opts = req
  }
  return opts
}

function setDefault(opts, key, value) {
  const prompt = opts.prompt
  if (!prompt[key] || typeof prompt[key] !== 'object') {
    prompt[key] = {
      type: 'string',
      default: value
    }
  } else {
    prompt[key] = value
  }
}

function setValidateName(opts) {
  const name = opts.prompt.name
  name.validate = name => { // name.default;
    const res = validateName(name)
    if (!res.validForNewPackages) {
      const errors = (res.errors || []).concat(res.warnings || [])
      return 'Sorry, ' + errors.join(' and ') + '.'
    }
    return true
  }
}
