import wxFsApiPromisify from '../utils/wxFsApiPromisify'

const NETWORK_DIR_NAME = `${wx.env.USER_DATA_PATH}/wxNetwork`

class RequestManager {
  constructor () {
    wxFsApiPromisify()
  }
  addReq(reqTaskInfo) {}
  findReq(reqName) {}
  appendReq(reqTaskInfo) {}
  clearAllReq() {}

  /**
   * @desc 读取目录内文件列表
   */
  async _readDir() {
    try {
      const res = await fileWrapper.readDir({ dirPath: NETWORK_DIR_NAME })
      console.log('res', res);
    } catch (error) {
      console.log('readDir error', error);
    }
  }
  /**
   * @desc 写入文件
   * @param {object} options 
   * @param {string} options.fileName
   * @param {string} options.data
   * @param {string} options.encoding
   */
  async _writeFile(options = {}) {
    const { fileName, data, encoding = 'utf8' } = options
    try {
      const res = await fileWrapper.writeFile({
        filePath: `${NETWORK_DIR_NAME}/${fileName}`,
        data,
        encoding
      })
    } catch (error) {
      console.log('writeFile error', error);
    }
  }
}

export default new RequestManager()