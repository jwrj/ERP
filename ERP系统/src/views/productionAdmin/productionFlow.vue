<template>

	<Card>
		
		<h1 slot="title">{{$route.query.name}} — 流程控制</h1>
		
		<div style="padding:16px;">
			
			<Row :gutter="16">
				
		        <Col span="6">
		        	
		        	<Card>
		        		
		        		<h1 slot="title">生产流程</h1>
		        		
		        		<div style="padding:10px;display:inline-block;">
		        			
		        			<div v-for="item in linkList" style="text-align: center;">
		        				<Button :type="item.type ? 'primary' : 'ghost'" @click="clickLink(item.id,item)">{{item.name}}</Button>
		        				<div style="margin:0 auto;border-left:1px solid #2d8cf0;width:0;height:40px;"></div>
		        			</div>
		        			
		        		</div>
		        		
					</Card>
		        	
		        </Col>
		        
		        <Col span="18">
		        	
		        	<Card>
		        		
		        		<h1 slot="title">环节任务</h1>
		        		
		        		<div style="padding:16px;">
		        			<Table class="tableZKPadd" border :columns="taskColumns" :data="taskData"></Table>
		        		</div>
		        		
					</Card>
					
		        </Col>
		        
		    </Row>
		    
		</div>
	    
	</Card>
	
</template>

<script>
	
import recordTable from '@/components/record-table.vue';
	
export default {
	components:{//模板
		recordTable,
	},
    data () {//数据
        return {
        	
        	linkList: [],//环节列表
        	
        	pidStepId: '',//环节ID
        	
        	taskColumns: [
        		{
        			title: '记录',
        			width:60,
        			align: 'conter',
                   	type: 'expand',
                   	render: (h, params) => {
                        return h(recordTable, {
                            props: {
                            	pidDataPage: Number(this.$route.query.pid_data_page),
                            	itemId: params.row.id,
                            	pidStepId: this.pidStepId,
                            },
                        })
                    }
                },
        		{
        			align: 'center',
        			width: 100,
                    title: 'ID',
                    key: 'id'
                },
        		{
                    title: '任务物品',
                    key: 'name'
                },
        		{
                    title: '任务数量',
                    key: 'number'
                },
        	],
        	
        	taskData: [],
        	
        }
    },
    methods: {//方法
    	
    	getLinkData(){//获取环节数据
    		
    		this.$axios.post('orders/produce_process', {
    			pid_tree_class: 18
			})
			.then(response => {
				
				this.linkList = response.data;
				
				if(this.linkList.length > 0){
					this.clickLink(this.linkList[0].id,this.linkList[0]);//点击查看环节
				}
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	clickLink(stepId,obj){//点击查看环节
    		
    		this.pidStepId = stepId;
    		
    		this.linkList.forEach(item => {
    			item.type = false;
    		});
    		
    		obj.type = true;
    		
    		let pidDataPage = Number(this.$route.query.pid_data_page);
    		
    		this.$axios.post('orders/produce_step_show', {
    			pid_data_page: pidDataPage,
    			step_pid_tree_title: stepId,
			})
			.then(response => {
				this.taskData = response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
    		
    	},
    	
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	
    	this.getLinkData();//获取环节数据
    	
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style>
	.tableZKPadd td.ivu-table-expanded-cell{
		padding:10px;
	}
</style>