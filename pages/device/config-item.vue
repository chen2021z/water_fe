<template>
	<view class="d-inline-block" style="background-color: #abd0fd;width: 30vw;height: 30vw; border-radius: 15px;margin: 10rpx;">
		<view class="flex align-center" style="flex-direction: column;">
			<text class="iconfont icon-shujuwajue" :class="[this.config.icon ? this.config.icon : '']"  style="font-size: 120rpx;margin: 20rpx 0 20rpx;"></text>
			<text>{{config.config_name}}</text>
			<!-- {{device.icon}} -->
		</view>
	</view>
</template>
<!--  -->
<script>
	export default {
		props:['config'],
		data(){
			return{

			}
		},
		mounted() {
			// console.log(this.device);
		}
	}
</script>

<style scoped>

</style>