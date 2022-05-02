/**
 * @desc 对非同步的fs api进行promise包装
 */
export default function promisifyFSApi(fn) {
  if (typeof fn !== 'function') return fn
  return function (options = {}) {
    return new Promise((resolve, reject) => {
      fn(Object.assign(
        options,
        {
          success: resolve,
          fail: reject
        }
      ))
    })
  }
}