<template>

	<div>
		<Row :gutter="16" type="flex">
			
			<Col :xs="24" :sm="24" :md="11" :lg="8">
				
				<Card id="Card1">

					<div class="user">
		
						<div class="tx">
						</div>
		
						<div class="content">
							<h1 style="color:#2d8cf0;font-size: 26px !important;">Admin</h1>
							
							<p>super admin</p>
						</div>
							
					</div>
					
					<div class="date">
						<p>上次登录时间：2018.7.18-10:56:30</p>
						<p>上次登录地点：广西南宁</p>
					</div>
		
				</Card>
				
			</Col>
			
        	<Col :xs="24" :sm="24" :md="13" :lg="16">
        		<Card id="Card2">
        			<p>12323213</p>
        			<p>12323213</p>
        			<p>12323213</p>
        			<p>12323213</p>
        			<p>12323213</p>
        			<p>12323213</p>
				</Card>
        	</Col>
        	
        	<Col span="24">
        		<Card id="Card3">
					<p>系统使用说明</p>
				</Card>
        	</Col>
        	
		</Row>
		
	</div>

</template>

<script>
	export default {
		components: { //模板

		},
		props: {

		},
		data() { //数据
			return {

			}
		},
		methods: { //方法

			ajax() {

				this.$axios.post('接口路径', {

					})
					.then(response => {

					})
					.catch(function(error) {
						console.log(error);
					});

			},

		},
		computed: { //计算属性

		},
		created() { //实例被创建完毕之后执行

		},
		mounted() { //模板被渲染完毕之后执行

		},
		watch: { //监测数据变化

		}
	}
</script>

<style scoped lang="less">

	.Public (@height: auto, @pT: 16px, @pLR: 16px, @pB: 16px) {
		height: @height;
		margin-bottom: 16px;
		padding:@pT @pLR @pB;
		box-sizing: border-box;
	}
	
	#Card1{
		.Public(216px,0px);
		overflow: hidden;
		.user{
			display: flex;
			align-items: center;
			border-bottom: 2px solid #e9eaec;
			padding: 20px 0;
			.tx {
				width: 80px;
				height: 80px;
				background: #ccc;
				flex-shrink: 0;
			}
			.content{
				margin-left:40px;
				width:100%;
			}
		}
		.date{
			margin-top:10px;
			p{
				padding:6px;
				white-space: nowrap;
			}
		}
	}
	#Card2{
		.Public(100%);
		max-height: 216px;
	}
	#Card3{
		.Public;
	}
</style>