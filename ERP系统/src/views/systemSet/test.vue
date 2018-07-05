<template>
	
	<div ref="print">
		
		<Table border :columns="columns1" :data="data1"></Table>
		
		<Button style="margin-top:16px;" type="info" icon="ios-printer" class="no-print" @click="$print($refs.print)">打印</Button>
	</div>
	

</template>

<script>
	import axios from 'axios';

	let ajax = () => {

		return new Promise(resolve => {

			axios.post('system/formTable_list', {
					page: 1,
					pagesize: 3,
					list_type: 1,
				})
				.then(response => {
					resolve(response.data);
				})
				.catch(function(error) {
					console.log(error);
				});

		});

	}

	export default {
		components: { //模板

		},
		props: {

		},
		data() { //数据
			return {

				columns1: [
					{
						width: 100,
						title: 'Name',
						key: 'name'
					},
					{
						title: 'Age',
						key: 'age'
					},
					{
						title: 'Address',
						key: 'address'
					}
				],

				data1: [
					{
						name: 'John Brown',
						age: 18,
						address: 'New York No. 1 Lake Park',
						date: '2016-10-03'
					},
					{
						name: 'Jim Green',
						age: 24,
						address: 'London No. 1 Lake Park',
						date: '2016-10-01'
					},
					{
						name: 'Joe Black',
						age: 30,
						address: 'Sydney No. 1 Lake Park',
						date: '2016-10-02'
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						date: '2016-10-04'
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						date: '2016-10-04'
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						date: '2016-10-04'
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						date: '2016-10-04'
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						date: '2016-10-04'
					},
				],

			}
		},
		methods: { //方法
			
		},
		computed: { //计算属性

		},
		created() { //实例被创建完毕之后执行

		},
		mounted() { //模板被渲染完毕之后执行
			
		},
		watch: { //监测数据变化

		},
		beforeRouteEnter(to, from, next) { //最早的钩子函数

			(async() => { //es7异步函数
				console.time('testForEach');
				console.log('开始');
				console.log(await ajax()); //等待异步函数执行完成再执行await，await在async后面
				console.log('结束');
				console.timeEnd('testForEach');
			})();

			next(vm => {
				console.log(to) //vm为vue的实例
				console.log('组件路由勾子beforeRouteEnter的next')
			})

		},
	}
</script>

<style scoped>
	.wrap {
		margin: 0 auto;
		padding: 20px;
		width: 640px;
		border: 1px solid #ccc;
	}
	
	.form .row {
		padding: 10px 0 0;
	}
	
	.btn {
		display: block;
		margin: 20px auto;
		padding: 8px 16px;
	}
	.fr{
	    float:right;
	}
	.vt{
	    vertical-align: top;
	}
</style>