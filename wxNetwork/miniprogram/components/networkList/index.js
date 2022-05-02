// wxNetwork/components/networkList/index.js
const requestList = Array.from({length: 30}, (_, idx) => {
	return {
		url: 'https://www.baidu.com',
		method: 'get',
		status: '200'
	}
})
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
			console.log('showNetworkList', val);
			const lastStatus = this.data.showNetworkList
			if (lastStatus === val) return
			val ? this.init() : this.destroy()
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		requestList: requestList,
		toViewId: 'isBottom'
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		init () {
			console.log('init');
		},
		destroy () {
			console.log('destroy');
		},
		handleBack () {
			this.triggerEvent("back")
		},
		hanldeClearAll () {
			this.setData({
				requestList: []
			})
		}
	},
})
