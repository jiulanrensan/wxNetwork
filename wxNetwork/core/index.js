import requestManager from './requestManager/index'
import { isFunction } from './utils/helper'
const originalRequest = wx.request

/**
 * 参考 https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
 * @param {object} options 
 * @param {string} options.url
 * @param {string} options.method
 * @param {object} options.header
 * @param {function} options.success
 * @param {function} options.fail
 */
function requestAspect (options) {
  const { 
    url,
    method,
    header,
    data,
    success,
    fail
  } = options
  let uniqueUrl = requestManager.genUniqueUrl(url)
  requestManager.addReq({
    url: uniqueUrl,
    method,
    header,
    data
  })

  // 执行原wx.request
  const requestTask = originalRequest(Object.assign(options, {
    success: async function (args) {
      requestManager.appendReq({
        url: uniqueUrl,
        res: args
      })
      isFunction(success) && success.call(this, args)
    },
    fail: function (args) {
      requestManager.appendReq({
        url: uniqueUrl,
        err: args
      })
      isFunction(fail) && fail.call(this, args)
    }
  }))
  return requestTask
}

// 对 wx.request 做拦截
export default function initNetworkInterception() {
  Object.defineProperty(wx, 'request', {
    writable: true
  })

  wx.request = requestAspect

  Object.defineProperty(wx, 'request', {
    writable: false
  })
}