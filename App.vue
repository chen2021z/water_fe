<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 检测更新
			// 网络监听
			// 初始化数据 
		},
		onShow: function() {
			this.$socket.on("fault", (res) => {
				uni.showToast({
					title: res,
					icon:'error',
					duration: 2000
				});
			});
			this.$socket.on("linked", (res) => {
				uni.showToast({
					title: res,
					duration: 2000
				});
			});
			
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url('common/uni.css');
	/* 引入动画库 */
	@import url("animate.css");
	/* 自定义样式库 */
	@import "./common/free.css";
	/* 全局样式 */
	@import "./common/common.css";
	/* 引入iconfont */
	@import "./static/iconfont/iconfont.css"
</style> 
