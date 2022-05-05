import wxFsApiPromisify from '../utils/wxFsApiPromisify'
import { isObject } from '../utils/helper'
export default class WXFileController {
  /**
   * 
   * @param {object} options
   * @param {boolean} options.logger 
   */
  constructor(options = {}) {
    this._fileWrapper = wxFsApiPromisify()
    this._dirPath = `${wx.env.USER_DATA_PATH}/wxNetwork`
    const { logger = false } = options
    this._logger = logger
    this.makeDir()
  }
  succCallback(options) {
  }
  failCallback(options) { }
  /**
   * @desc 格式化入参
   * @param {object} content 
   * @returns { string }
   */
  _formatReqContent (content) {
    if (!isObject(content)) return content
    const { 
      url,
      method,
      header = {},
      reqData = {}
    } = content
    let formatted = 
      `=========请求url=========\n\n` +
      `${method.toUpperCase()} ${url}\n\n` +
      `=========请求头=========\n\n` + 
      `${JSON.stringify(header)}\n\n` +
      `=========请求体=========\n\n` + 
      `${JSON.stringify(reqData)}\n\n`
    return formatted
  }
  /**
   * @desc 格式化成功响应，参考 https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
   * @param {object} res 
   * @returns 
   */
  _formatResContent (res) {
    if (!isObject(res)) return res
    const { statusCode, header, data } = res
    let formatted = 
      `=========状态码=========\n\n` +
      `${statusCode}\n\n` + 
      `=========响应头=========\n\n` +
      `${JSON.stringify(header)}\n\n` +
      `=========响应体=========\n\n` +
      `${JSON.stringify(data)}\n\n`;
    return formatted
  }
  _formatErrContent (err) {
    if (!isObject(err)) return err
    const { errMsg, errno } = err
    let formatted = 
      `=========错误码=========\n\n` +
      `${errno}\n\n` + 
      `=========错误信息=========\n\n` +
      `${JSON.stringify(errMsg)}\n\n`
    return formatted
  }
  /**
   * 
   * @param {string} path 文件或者目录完整路径
   */
  async isExisted (path) {
    try {
      await this._fileWrapper.access({
        path
      })
      return true
    } catch (error) {
      console.log('isExisted error', error);
      return false
    }
  }
  /**
   * @desc 新建目录
   */
  async makeDir () {
    try {
      if (await this.isExisted(this._dirPath)) return
      return await this._fileWrapper.mkdir({ dirPath: `${this._dirPath}` })
    } catch (error) {
      console.log('makeDir error', error);
    }
  }
  /**
   * @desc 写入文件
   * @param {object} options 
   * @param {string} options.name
   * @param {object} options.data
   * @param {string} options.encoding
   */
  async write(options) {
    const { name, data, encoding = 'utf8' } = options || {}
    try {
      const res = await this._fileWrapper.writeFile({
        filePath: `${this._dirPath}/${encodeURIComponent(name)}`,
        data: this._formatReqContent(data),
        encoding
      })
    } catch (error) {
      this._logger && console.log('write error', error);
    }
  }
  /**
   * @desc 读取文件
   * @param {string} options.name
   */
  async read(options) {
    const { name } = options || {}
    try {
      const { data } = await this._fileWrapper.readFile({ 
        filePath: `${this._dirPath}/${encodeURIComponent(name)}`,
        encoding: 'utf-8'
      }) || {}
      return data || ''
    } catch (error) {
      this._logger && console.log('read error', error);
      return ''
    }
  }
  /**
   * @desc 追加文件
   * @param {object} options 
   * @param {string} options.name
   * @param {object} options.res
   * @param {object} options.err
   * @param {string} options.encoding
   */
  async append(options) { 
    const { name, res, err, encoding = 'utf8' } = options || {}
    const formatted = res ? this._formatResContent(res) : this._formatErrContent(err)
    try {
      const res = await this._fileWrapper.appendFile({
        filePath: `${this._dirPath}/${encodeURIComponent(name)}`,
        data: formatted,
        encoding
      })
    } catch (error) {
      this._logger && console.log('append error', error);
    }
  }
  /**
   * @desc 读取目录内文件列表
   * @returns { Promise<Array<string>> } 返回文件名列表
   */
  async readAllList() {
    try {
      const { files } = await this._fileWrapper.readdir({ dirPath: this._dirPath }) || {}
      return files || []
    } catch (error) {
      this._logger && console.log('readdir error', error);
      return []
    }
  }
  /**
   * @desc 删除文件
   */
  async delete(name) {
    try {
      await this._fileWrapper.unlink({ filePath: `${this._dirPath}/${name}` })
      return true
    } catch (error) {
      this._logger && console.log('delete error', error);
      return false
    }
  }
}