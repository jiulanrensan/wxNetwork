import WXFileController from './wxFileController'

class RequestManager {
  constructor(options) {
    const { cachController } = options || {}
    if (!cachController) throw new Error('cachController不合法')
    this._cachController = cachController
  }
  /**
   * @desc url可能会重复，所以结合时间戳生成唯一url
   * @param {string} url 
   * @returns {string}
   */
  genUniqueUrl (url) {
    // 空格隔开
    return `${url} ${new Date().getTime()}`
  }
  /**
   * @desc 剔除时间戳，获取真实url
   * @param {string} url 
   * @returns {string}
   */
  getActualUrl (url) {
    return url.split(' ')[0]
  }
  /**
   * 
   * @param {Array<string>} reqList 
   * @returns { Array<{ key: number, url: string }> }
   */
  formatedReqList (reqList) {
    return reqList.map(el => {
      const [ url, timestamp ] = decodeURIComponent(el).split(' ')
      return {
        key: timestamp,
        url
      }
    })
  }
  /**
   * 
   * @param {object} reqTaskInfo 
   * @param {string} reqTaskInfo.url
   * @param {string} reqTaskInfo.method
   * @param {object} reqTaskInfo.header
   * @param {object} reqTaskInfo.data
   */
  addReq(reqTaskInfo) { 
    const { url, method, header, data: reqData } = reqTaskInfo || {}
    this._cachController.write({
      name: url,
      data: {
        url: this.getActualUrl(url),
        method,
        header,
        reqData
      }
    })
  }
  /**
   * @param {object} reqTaskInfo
   * @param {string} reqTaskInfo.url
   * @param {object} reqTaskInfo.res 成功回调
   * @param {object} reqTaskInfo.err 失败回调
   */
  appendReq(reqTaskInfo) { 
    const { url, res, err } = reqTaskInfo || {}
    this._cachController.append({
      name: url,
      res,
      err
    })
  }
  /**
   * 
   * @param {string} reqUrl 
   * @returns { Promise<string> }
   */
  async getReqDetail(reqUrl) { 
    const reqInfo = await this._cachController.read({ name: reqUrl })
    return reqInfo
  }
  /**
   * 
   * @returns { Promise<Array<string>> }
   */
  async getAllReqList() { 
    let list = await this._cachController.readAllList()
    return list
  }
  async clearAllReqList() { 
    const list = await this.getAllReqList()
    await Promise.all(list.map(name => this._cachController.delete(name)))
  }
}

// 文件存储与处理request的解耦
export default new RequestManager({
  cachController: new WXFileController()
})