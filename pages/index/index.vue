<template>
	<view>
		<scroll-view scroll-x class="scroll-row border-white" :scroll-into-view="scrollInto" scroll-with-animation
			style="height:100rpx">
			<view v-for="(val, key, index) in tabBars" :key="index" :id="'tab'+index"
				class="scroll-row-item px-3 py-2 font-md" @click=changeTab(index)
				:class="tabIndex === index? 'text-main font-lg font-weight-bold':''">
				{{val}}
			</view>
		</scroll-view>


		<swiper :duration="150" :current="tabIndex" @change=onChangeTab :style="'height:'+scrollHeight+'px;'">
			<swiper-item v-for="(val, key, index) in tabBars" :key="index">
				<scroll-view scroll-y="true" :style="'height:'+scrollHeight+'px;'">
					<view class="charts-box">
						<qiun-data-charts type="line" :opts="opts" :chartData="chartsDataObj[key]" />
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import moment from 'moment';
import { listenerCount } from 'process';
	export default {
		components: {

		},
		data() {
			return {
				// 屏幕高度
				scrollHeight: 600,
				tabIndex: 0,
				// 顶部选项卡
				scrollInto: '',
				tabBars:{
					t1: '常温水水温',
					t2: '热水水温',
					tds1: '水源水质',
					tds2: '饮水水质',
				},
				chartData: {},
				timer: null,
				chartsDataObj: {
					smoke1: {
						series: []
					},
					smoke2: {
						series: []
					}
				},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2
					},
					extra: {
						line: {
							type: "curve",
							width: 2,
							activeType: "hollow"
						}
					}
				},
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: res => {
					// 单位是px
					this.scrollHeight = res.windowHeight - uni.upx2px(100) - -res.statusBarHeight
				}
			})
			// this.timer = setInterval(() =>{
				this.getData()
			// }, 2000)
		},
		methods: {
			//初始化列表数据
			async getData() {
				let res = await this.$H.get('/device/getAllDeviceInfo', {
					"current": 1,
					limit:14
				})
				res.records = res.records.map(item => ({ ... item, time: moment(item.time).format('mm:ss') }))
				// console.log(res.records);
				let l1 = res.records.filter(item => item.device_id == '100')
				let l2 = res.records.filter(item => item.device_id == '200')
				// console.log(l1, l2);
				// 饮水机1的数据
				let list1 = {
					t1: [],
					t2: [],
					tds1: [],
					tds2: [],
					time: []
				}
				// 饮水机2的数据
				let list2 = {
					t1: [],
					t2: [],
					tds1: [],
					tds2: [],
					time: []
				}
				console.log(res.records);
				res.records.reverse().forEach((item) => {
					for (let attr in item) {
						if (item.device_id == '1') {
							list1[attr] instanceof Array && list1[attr].push(item[attr])
						}else if(item.device_id == '2'){
							list2[attr] instanceof Array && list2[attr].push(item[attr])
						}
					}
				})
				// console.log(list1, list2);
				let obj = {}
				for (let key in list1) {
					if (key != 'time') {
						obj[key] = {
							categories: list1['time'],
							series: [{
								// name: this.tabBars[key],
								name: '饮水机1',
								lineType: "dash",
								data: list1[key]
							},
							{
								// name: this.tabBars[key],
								name: '饮水机2',
								lineType: "dash",
								data: list2[key]
							}]
							
						}
					}
					
				}
				// console.log(list, obj);
				// console.log(obj);
				this.chartsDataObj = obj
			},
			changeTab(index) {
				if (this.tabIndex == index) return;
				this.tabIndex = index
				this.scrollInto = 'tab' + index
			},
			// swiper切换
			onChangeTab(current, source) {
				this.changeTab(current.detail.current)
			},
		}
	}
</script>

<style scoped>
	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
	.charts-box {
		width: 100%;
		height: 300px;
	}
</style>