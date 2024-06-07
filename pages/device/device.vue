<template>
	<view>
		<uni-nav-bar :border="false" :fixed="true" :status-bar="true" @clickRight="clickRight">
			<view class="w-100 flex justify-center align-center">

				<!-- <view class="font-lg text-main mx-1 font-weight-bold" v-for="item,index in tabBars" : key="index">
					
				</view> -->
				<view class=" mx-1" v-for="(item,index) in tabBars" :key="index"
					:class="tabIndex === index ? 'font-lg text-main font-weight-bold' : 'font-md text-light-muted'"
					@click="changeTabIdx(index)">
					{{item.name}}
				</view>
			</view>

			<text class="iconfont icon-jia_sekuai" slot="right" style="font-size: 25px;"></text>
		</uni-nav-bar>




		<swiper :duration="150" :current="tabIndex" @change=onChangeTab :style="'height:'+scrollHeight+'px;'">
			<swiper-item>
				<scroll-view scroll-y="true" :style="'height:'+scrollHeight+'px;'">
					<view class="flex flex-wrap justify-center" v-if="tabIndex === 0">
						<deviceItem v-for="dev,index in deviceList" :key="index" :device="dev"
							@click.native="openDialog(1,dev)">

						</deviceItem>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y="true" :style="'height:'+scrollHeight+'px;'">
					<view class="flex flex-wrap justify-center">
						<!-- {{specialConfig}} -->
						<configItem v-for="config,index in specialConfig" :key="index" :config="config"
							@click.native="openDialog(2,config)">
						</configItem>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- 设备弹窗 -->
		<uni-popup ref="popup1" type="dialog">
			<uni-popup-dialog :title="clickDeviceData.device_name" confirmText="发送" :duration="2000" @close="close1"
				@confirm="confirm1">
				<view class="w-100">
					<uni-row class="demo-uni-row">
						<uni-col :span="12">
							<view class="text-center">状态：</view>
						</uni-col>
						<uni-col :span="12">
							<view class="">{{deviceStatus}}</view>
						</uni-col>
					</uni-row>
					<uni-row class="demo-uni-row">
						<uni-col :span="12">
							<view class="text-center">位置：</view>
						</uni-col>
						<uni-col :span="12">
							<view class="">{{clickDeviceData.position}}</view>
						</uni-col>
					</uni-row>
					<uni-row class="demo-uni-row">
						<uni-col :span="12">
							<view class="text-center">状态修改：</view>
						</uni-col>
						<uni-col :span="12">
							<view class="">
								<uni-data-select :clear="false" v-model="selectDeviceStatus" :localdata="range"
									@change="changeDeviceStatus"></uni-data-select>
							</view>
						</uni-col>
					</uni-row>
					<!-- <view class="flex align-center justify-between p-1"
						v-for="config,index in clickDeviceData.configList" :key="index">
						<text style="margin-right: 25rpx;">{{config.config_name}}:</text>
						<view class="border" v-if="config.send_type==='input'" style="width: 50%;">
							<input :value="config.value" type="number" 
								@input="inputChange($event, config.config_id, config.message)" class="uni-input"
								:placeholder="config.config_name" />
						</view>
						<view class="" v-if="config.send_type==='switch'">
							<switch :checked="config.value === config.max_value"
								@change="switchChange($event, config.config_id, config.message, config.min_value, config.max_value)" />
						</view>
						<view class="" v-if="config.send_type==='slider'" style="width: 50%;">
							<slider :value="config.value"
								@change="sliderChange($event, config.config_id, config.message)" :step="1"
								:min="config.min_value" :max="config.max_value" />
						</view>
					</view> -->
				</view>
			</uni-popup-dialog>
		</uni-popup>
		<!-- 指令弹窗 -->
		<uni-popup ref="popup2" type="dialog">
			<uni-popup-dialog :title="clickConfigData.config_name" confirmText="发送" :duration="2000" @close="close2"
				@confirm="confirm2">
				<view class="w-100" v-if="!!clickConfigData.id">
					<view class="flex align-center justify-between p-1">
						<text style="margin-right: 25rpx;">{{clickConfigData.config_name}}:</text>
						<view class="border" type="number" v-if="clickConfigData.send_type==='input'"
							style="width: 50%;">
							<input @input="inputChange($event, clickConfigData.id, clickConfigData.message)"
								:value="clickConfigData.value" class="uni-input"
								:placeholder="clickConfigData.config_name" />
						</view>
						<view class="" v-if="clickConfigData.send_type==='switch'">
							<switch :checked="clickConfigData.value === clickConfigData.max_value"
								@change="switchChange($event, clickConfigData.id, clickConfigData.message, clickConfigData.min_value, clickConfigData.max_value)" />
						</view>
						<view class="" v-if="clickConfigData.send_type==='slider'" style="width: 60%;">
							<!-- {{clickConfigData}} -->
							<slider :value="clickConfigData.value"
								@change="sliderChange($event, clickConfigData.id, clickConfigData.message)" :step="1"
								:min="clickConfigData.min_value" :max="clickConfigData.max_value" />
						</view>
					</view>
				</view>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import deviceItem from './device-item.vue'
	import configItem from './config-item.vue'
	export default {
		components: {
			deviceItem,
			configItem
		},
		data() {
			return {
				tabBars: [{
						name: '饮水设备'
					},
					{
						name: '阈值指令'
					}
				],
				tabIndex: 0,
				// 屏幕高度
				scrollHeight: 600,
				deviceList: [],
				clickDeviceData: {
					configList: [{
						config_id: ''
					}]
				},
				clickConfigData: {},
				allConfig: [],
				pushConfigList: [],
				specialPushConfig: {},
				range: [{
						value: '1',
						text: "暂停"
					},
					{
						value: '2',
						text: "开启"
					},
				],
				selectDeviceStatus: 2
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: res => {
					// 单位是px
					this.scrollHeight = res.windowHeight - 44 - res.statusBarHeight
				}
			})
			this.getDeviceList()
			this.getConfigList()
			
		},
		computed: {
			// 特殊指令 id !== "" && id不为数字
			specialConfig() {
				return this.allConfig.filter(item => isNaN(item.config))
			},
			deviceStatus() {
				return ['复位', '暂停', '开启', '警告', '错误'][this.clickDeviceData.status]
			}
		},
		methods: {
			async getConfigList() {
				let res = await this.$H.get('/config/getAllConfig')
				this.allConfig = res
			},
			async getDeviceList() {
				// console.log(1111111111);
				let res = await this.$H.get('/device/getAllDeviceStatus')
				// console.log(22222222222);
				console.log(res);
				this.deviceList = res.records;
			},
			changeDeviceStatus(val) {
				console.log(val);
			},
			openDialog(type, data) {
				if (type === 1) {
					this.clickDeviceData = data
					this.selectDeviceStatus = data.status
					// console.log(data);
					this.$refs.popup1.open()
				} else {
					this.clickConfigData = data
					this.$refs.popup2.open()
					console.log(data);
				}
				// console.log(data);
			},
			close1() {
				this.$refs.popup1.close()
				this.pushConfigList = []
			},
			close2() {
				this.$refs.popup2.close()
				this.pushConfigList = []
			},
			// 设备指令的发送
			async confirm1() {
				try {
					let res = await this.$H.post('/device/updateDeviceStatus', {
						data: {
							status: this.selectDeviceStatus
						},
						id:this.clickDeviceData.device_id
					})
					this.getDeviceList()
					// const promises = this.pushConfigList.map(this.publishMqtt)
					// await Promise.all(promises)
					// this.$refs.popup1.close()
					// this.getDeviceList()
					if(this.clickDeviceData.device_id == 1){
						await this.$H.post('/publish/publish', {config_id:2, value: this.selectDeviceStatus, message:"c1=?"})
					}else {
						await this.$H.post('/publish/publish', {config_id:3, value: this.selectDeviceStatus, message:"c2=?"})
					}
					// let res2 = 
					// lconsole.log(res2);
					uni.showToast({
						title: '发送成功',
						duration: 2000
					});
					// this.pushConfigList = []
				} catch (e) {
					console.log('失败');
				}
			},
			// 全局指令的发送
			async confirm2() {
				try {
					const config = this.pushConfigList[0]
					console.log(config);
					await this.publishMqtt(config)
					this.$refs.popup2.close()
					this.getConfigList()
					uni.showToast({
						title: '发送成功',
						duration: 2000
					});
					this.pushConfigList = []
				} catch (e) {
					console.log('失败');
				}
			},
			async publishMqtt(item) {
				let res = await this.$H.post('/publish/publish', item)
				return res
			},
			inputChange({
				detail
			}, config_id, message) {
				let isAdd = true
				// 根据id遍历，有相同的就修改，没有就添加
				this.pushConfigList.forEach(item => {
					if (item.config_id === config_id) {
						item.value = detail.value
						isAdd = false
					}
				})
				if (isAdd) {
					this.pushConfigList.push({
						config_id,
						value: detail.value,
						message
					})
				}
				// console.log(this.pushConfigList);
			},
			switchChange({
				detail
			}, config_id, message, min, max) {
				let isAdd = true
				let value = detail.value ? max : min
				// 根据id遍历，有相同的就修改，没有就添加
				this.pushConfigList.forEach(item => {
					if (item.config_id === config_id) {
						item.value = value
						isAdd = false
					}
				})
				if (isAdd) {
					this.pushConfigList.push({
						config_id,
						value,
						message
					})
				}
				// console.log(this.pushConfigList);
			},
			sliderChange({
				detail
			}, config_id, message) {
				let isAdd = true
				// 根据id遍历，有相同的就修改，没有就添加
				this.pushConfigList.forEach(item => {
					if (item.config_id === config_id) {
						item.value = detail.value
						isAdd = false
					}
				})
				if (isAdd) {
					this.pushConfigList.push({
						config_id,
						value: String(detail.value),
						message
					})
				}
				// console.log(this.pushConfigList);
			},
			changeTabIdx(idx) {
				this.tabIndex = idx
			},
			// 点击右侧进入发布页
			clickRight() {
				uni.navigateTo({
					url: "/pages/add-input/add-input"
				})
			},
			onChangeTab(current, source) {
				this.changeTab(current.detail.current)
			},
			changeTab(index) {
				if (this.tabIndex == index) return;
				this.tabIndex = index
				// this.scrollInto = 'tab' + index
			},
			openMore() {

			},
			openDetail() {

			}
		}
	}
</script>

<style>

</style>