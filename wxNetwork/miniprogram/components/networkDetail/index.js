// wxNetwork/components/networkDetail/index.js
import requestManager from '../../../core/requestManager/index'

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		showNetworkDetail: {
			type: Boolean,
			default: false
		},
		reqDetailUrl: {
			type: String,
			default: ''
		}
	},
	observers: {
		'showNetworkDetail' (val) {
			val && this.init()
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		requestDetail: null,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		async init () {
			const res = await requestManager.getReqDetail(this.data.reqDetailUrl)
			this.setData({
				requestDetail: res
			})
		},
		handleBack () {
			this.triggerEvent("back")
		},
		hanldeCopy () {
			wx.setClipboardData({
				data: this.data.requestDetail
			})
		}
	},
})
