module.exports.createPromise = function() {
  const args = Array.prototype.slice.call(arguments)
  const func = args.pop()
  return new Promise(resolve => {
    func(...args, resolve);
  })
}

/**
 * @param {arr} <Array>
 * @param {func} promise factory function
 * @param {done} Promise.resolve
 */
module.exports.eachPromise = function(arr, func, done) {
  promiseFactories = arr.map((item) => {
    return func(item);
  });

  let result = Promise.resolve()
  promiseFactories.forEach((factory) => {
    result = result.then(factory)
  })
  result.then(() => {
    done();
  });
}
