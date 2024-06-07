<template>
	<view class="d-inline-block" style="background-color: #ffff7f;width: 30vw;height: 30vw; border-radius: 15px;margin: 10rpx;">
		<view class="flex align-center" style="flex-direction: column;">
			<text class="iconfont icon-shuibiao" :class="[this.device.icon]" style="font-size: 120rpx;margin: 20rpx 0 20rpx;"></text>
			<text>{{device.device_name}}</text>
			<!-- {{device.icon}} -->
		</view>
	</view>
</template>

<script>
	export default {
		props:['device'],
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