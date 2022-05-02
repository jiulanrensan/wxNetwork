// wxNetwork/index.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		windowHeight: 603,
		windowWidth: 375,
		networkWidth: 65,
		networkHeight: 22,
		showNetworkList: false
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		setNetworkInfo () {
			const that = this
			const styleList = ['width', 'height', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom']
			this.createSelectorQuery().select('#wxNetwork').fields({
				computedStyle: styleList
			}, function (res) {
				const styleMap = {}
				styleList.forEach(el => {
					styleMap[el] = Number(res[el].replace('px', ''))
				})
				that.setData({
					networkWidth: styleMap['width'] + styleMap['padding-left'] + styleMap['padding-right'],
					networkHeight: styleMap['height'] + styleMap['padding-top'] + styleMap['padding-bottom']
				})
			}).exec()
		},
		handleBack () {
			console.log('handleBack');
			this.setData({
				showNetworkList: false
			})
		},
		handleShow () {
			console.log('handleShow');
			this.setData({
				showNetworkList: true
			})
		}
	},
	lifetimes: {
		created () {
			const { windowHeight, windowWidth } = wx.getSystemInfoSync()
			this.setData({
				windowHeight,
				windowWidth
			})
		},
		attached () {
			this.setNetworkInfo()
		}
	}
})
