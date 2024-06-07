<template>
	<view>
		<uni-nav-bar :border="false" :fixed="true" :status-bar="true" @clickRight="clickRight">
			<view class="w-100 flex justify-center align-center">
				<view class="mx-1 " v-for="(item,index) in tabBars" :key="index"
					:class="tabIndex === index ? 'font-lg text-main font-weight-bold' : 'font-sm text-light-muted'"
					@click="changeTabIdx(index)">
					{{item.name}}
				</view>
			</view>
		</uni-nav-bar>


		<swiper :duration="150" :current="tabIndex" @change=onChangeTab :style="'height:'+scrollHeight+'px;'">
			<swiper-item>
				<scroll-view scroll-y="true" :style="'height:'+scrollHeight+'px;'">
					<view class="flex flex-wrap justify-center" v-if="tabIndex === 0">
						<view class="w-100" style=" background-color: #fff;">
							<view class="flex align-center m-2">
								<span class="flex-1">选择饮水机</span>
								<uni-data-select v-model="device_id" :localdata="deviceRange"
									@change="changeDevice"></uni-data-select>
							</view>
							<view class="flex align-center m-2">
								<span class="flex-1">选择学生</span>
								<uni-data-select v-model="student_id" :localdata="studentRange"
									@change="changeStudent"></uni-data-select>
							</view>
							<uni-datetime-picker v-model="datetimerange" type="datetimerange" rangeSeparator="至"
								@change="changeDate" />
							<view class="">
								<view class="text-center">
									<h2>总水量:{{totalAmount}}</h2>
								</view>
								<uni-table border stripe emptyText="暂无更多数据">
									<!-- 表头行 -->
									<uni-tr>
										<uni-th width="150rpx">学生</uni-th>
										<uni-th align="center" width="150rpx">饮水机</uni-th>
										<uni-th align="left" width="130rpx">饮水量(ml)</uni-th>
										<uni-th>时间</uni-th>
									</uni-tr>
									<!-- 表格数据行 -->
									<uni-tr v-for="order in orderList"  :key="order.id">
										<uni-td>{{order.student_id =='10000'? '小米' :'小李'}}</uni-td>
										<uni-td align="center">{{order.device_id=='1'? '饮水机1' :'饮水机2'}}</uni-td>
										<uni-td>{{order.amount}}</uni-td>
										<uni-td>{{order.ctime}}</uni-td>
									</uni-tr>
								</uni-table>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y="true" :style="'height:'+scrollHeight+'px;'">
					<view class="flex flex-wrap justify-center">
						<view class="w-100">
							<!-- <view class="">
								<view class="flex align-center">
									<text style="padding-right: 32rpx;">查询书号</text>
									<input type="text" class="border p-1" v-model="selectBookId" placeholder="查询书号">
								</view>
								<view class="flex align-center">
									借阅人学号：
									<input type="text" class="border p-1" v-model="borrowPesionId" placeholder="借阅人学号">
								</view>
							</view> -->


							<uni-table border stripe emptyText="暂无更多数据">
								<uni-tr>
									<uni-th align="center" width="140rpx">error_id</uni-th>
									<uni-th align="center" width="100rpx">饮水机id</uni-th>
									<uni-th align="left">类型</uni-th>
									<uni-th align="left">时间</uni-th>
								</uni-tr>
								<uni-tr v-for="item in errorList" :key="item.id">
									<uni-td align="center">{{item.error_id}}</uni-td>
									<uni-td align="center">{{item.device_id}}</uni-td>
									<uni-td>{{item.error_msg}}</uni-td>
									<uni-td>{{item.time}}</uni-td>
								</uni-tr>
							</uni-table>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- <swiper-item>
				<scroll-view scroll-y="true" :style="'height:'+scrollHeight+'px;'">
					<view class="flex flex-wrap justify-center">
						<view class="w-100">
							<qiun-data-charts type="column" :opts="opts" :chartData="chartData"
								style="padding-top: 50rpx;" />
						</view>
					</view>
				</scroll-view>
			</swiper-item> -->
		</swiper>
	</view>
</template>

<script>
	import moment from 'moment';
	export default {
		data() {
			return {
				device_id: '',
				student_id: '',
				deviceRange: [{
					value: '1',
					text: "饮水机1"
				}, {
					value: '2',
					text: "饮水机2"
				}],
				errorList:[],
				studentRange: [{
					value: '10000',
					text: "小米"
				}, {
					value: '10001',
					text: "小李"
				}],
				tabBars: [{
						name: '状态记录'
					},
					{
						name: '错误信息'
					},
					// {
					// 	name: '图表统计'
					// }
				],
				tabIndex: 0,
				// 屏幕高度
				scrollHeight: 600,
				// 借阅书号
				selectBookId: '',
				// 借阅人id
				borrowPesionId: '',
				// 图书名
				bookName: '',
				datetimerange: null,
				bookList: [],
				orderList: [],
				// 借阅数据
				bookRecordList: [],
				personData: {
					10086: '小明',
					10087: '小兰',
				},
				chartData: {},
				opts: {
					color: ["#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 15, 0, 5],
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						data: [{
							min: 0
						}]
					},
					extra: {
						column: {
							type: "group",
							width: 30,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						}
					},
				}
			}
		},
		computed: {
			filterBookList() {
				return this.bookList.filter(item => item.book_name.includes(this.bookName))
			},
			filterBookRecordList() {
				return this.bookRecordList.filter(item => {
					return item.book_id.includes(this.selectBookId) && item.person_id.includes(this.borrowPesionId)
				})
			},
			totalAmount(){
				let res = 0
				this.orderList.forEach((item) => {
					res += Number(item.amount)
				}, 0)
				return res
			},
			
		},
		methods: {
			async initData(beforeTime, endTime) {
				let res = await this.$H.get('/order/getAllOrder',{beforeTime, endTime,device_id: this.device_id, student_id: this.student_id})
				console.log(res);
				this.orderList = res.records.map(item => ({
					...item,
					id: String(item.order_id),
					ctime: moment(item.stime).format('YYYY-MM-DD HH:mm:ss')
				}))
				console.log(this.orderList);

				// let res2 = await this.$H.post('/book/getBorrowData', {
				// 	beforeTime,
				// 	endTime
				// })
				// this.bookRecordList = res2.map(item => ({
				// 	...item,
				// 	book_id: String(item.book_id),
				// 	id: String(item.id),
				// 	borrow_return: item.borrow_return == '1' ? '借' : '还',
				// 	persionName: this.getPersionName(item.person_id),
				// 	person_id: String(item.person_id),
				// 	ctime: moment(item.ctime).format('YYYY-MM-DD HH:mm:ss')
				// }))
				// console.log(this.bookRecordList);
			},
			async initErrorList(){
				let res = await this.$H.post('/fault/getAllFault')
				res.records = res.records.map(item => ({
					...item,
					time: moment(item.time).format('YYYY-MM-DD HH:mm:ss')
				}))
				// console.log(res);
				this.errorList = res.records
			},
			changeDevice(e) {
				console.log("e:", e);
				this.device_id = e
				this.initData()
			},
			changeStudent(e) {
				console.log("e:", e);
				this.student_id = e
				this.initData()
			},
			// 图表统计数据
			async getServerData() {
				let res3 = await this.$H.post('/book/getBorrowNum')
				console.log(res3.list);
				let bookNmaes = []
				let bookNums = []
				res3.list.forEach(item => {
					// this.chartData.categories.push(item.book_name)
					bookNmaes.push(item.book_name)
					bookNums.push(item.list.length)
				})
				this.chartData = {
					categories: bookNmaes,
					series: [{
						name: "图书借阅次数",
						data: bookNums
					}, ]
				}
				console.log(this.chartData.categories);
			},
			getPersionName(id) {
				return this.personData[id] ?? ''
			},
			changeDate(e) {
				// console.log(e);
				this.initData(e[0], e[1])
			},
			onChangeTab(current, source) {
				this.changeTab(current.detail.current)
			},
			changeTab(index) {
				if (this.tabIndex == index) return;
				this.tabIndex = index
				// this.scrollInto = 'tab' + index
			},
			changeTabIdx(idx) {
				this.tabIndex = idx
			},

		},
		mounted() {
			this.initData()
			this.initErrorList()
			// this.getServerData();
		},
		onShow() {
			this.$socket.on("addOrder", (res) => {
				this.initData()
			});
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.initData()
			uni.stopPullDownRefresh()
		}
	}
</script>

<style>

</style>