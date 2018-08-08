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
        			
        			<h1 slot="title">系统使用说明</h1>
        			
        			<div style="padding: 16px;">
        				<p>需要使用高版本浏览器运行该系统。</p>
        				<p>如：谷歌浏览器、火狐浏览器等。</p>
        			</div>
        			
				</Card>
        	</Col>
        	
        	<Col span="24">
        		<Card id="Card3">
        			
        			<h1 slot="title">更新日志</h1>
        			
        			<div style="padding: 16px;">
        				
        				<Timeline class="Timeline">
        					
					        <TimelineItem>
					            <Icon type="trophy" slot="dot"></Icon>
					            <span class="title">v1.0.2</span>
					            <p class="content">
					            	<Icon type="ios-star-outline"></Icon>
					            	物品表加入了规格表头显示的功能。
					            </p>
					        </TimelineItem>
					        
					        <TimelineItem>
					        	<span class="title">v1.0.1</span>
					        	<p class="content">
					        		<Icon type="ios-star-outline"></Icon>
					        		优化UI，增加皮肤功能。
					        	</p>
					        </TimelineItem>
					        
					    </Timeline>
        				
        			</div>
        			
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
		.Public(100%,0,0,0);
		max-height: 216px;
	}
	#Card3{
		.Public(auto,0,0,0);
	}
	.Timeline{
		.title{
			font-weight: bold;
		}
		.content{
			padding: 8px 0 8px 10px;
			line-height: 20px;
			font-size: 14px;
			i{
				font-size: 12px;
				margin-right: 8px;
			}
		}
	}
</style>