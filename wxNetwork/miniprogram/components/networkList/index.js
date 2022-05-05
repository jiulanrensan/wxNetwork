// wxNetwork/components/networkList/index.js
import requestManager from '../../../core/requestManager/index'
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		showNetworkList: {
			type: Boolean,
			default: false
		}
	},
	observers: {
		'showNetworkList' (val) {
			if (this._lastStatus === val) return
			this._lastStatus = this.data.showNetworkList
			val ? this.init() : this.destroy()
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		requestList: [],
		toViewId: 'isBottom',
		reqDetailUrl: ''
	},
	_lastStatus: false,
	_requestList: [],

	/**
	 * 组件的方法列表
	 */
	methods: {
		async init () {
			const list = await requestManager.getAllReqList()
			this._requestList = list
			this.setData({
				requestList: requestManager.formatedReqList(list)
			})
		},
		destroy () {
			console.log('destroy');
		},
		handleBack () {
			this.triggerEvent("back")
		},
		handleShowDetail (ev) {
			const { key, url } = ev.currentTarget.dataset
			this.setData({
				showNetworkDetail: true,
				reqDetailUrl: `${url} ${key}`
			})
		},
		handleDetailBack () {
			this.setData({
				showNetworkDetail: false
			})
		},
		async hanldeClearAll () {
			await requestManager.clearAllReqList()
			this.setData({
				requestList: []
			})
		}
	},
})
