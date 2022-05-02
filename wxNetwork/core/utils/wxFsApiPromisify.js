import promisifyFSApi from './promisify'

export default function wxFsApiPromisify () {
  const fs = wx.getFileSystemManager()
  const fileWrapper = {}
  const fsApiList = Object.keys(fs)
  fsApiList.forEach(apiName => {
    const api = fs[apiName]
    fileWrapper[apiName] = 
      apiName.includes('Sync') ? 
        api :
        promisifyFSApi(api)
  })
  return fileWrapper
}