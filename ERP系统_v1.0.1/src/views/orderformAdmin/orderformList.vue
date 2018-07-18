<template>
	
	<div>
		
		<Card>
			
			<h1 slot="title">订单列表</h1>
			
			<div style="padding: 15px;">
				
				<!--
					:table-data="tabDataList"
					:page-info="pageInfo"
					:city-list="cityList"
					@alterCurrent="getDataList"
				-->
				
				<!--如果出现两个表格组件路由会有同步现象-->
				<table-module
					ref="tabInstance"
					:columns-list="columns"
					:pageId="22"
					stateListId="16"
					seleSeekField="pid_status"
					
					tableDataUrl="orders/order_list"
					deleUrl="orders/order_delete"
					showUrl="orders/order_show"
					componentViewType="formView"
					componentEditType="formEdit"
				>
				</table-module>
				
			</div>
			
		</Card>
		
	</div>
	
</template>

<script>
	
import tableModule from '@/components/table-module.vue';

export default {
	components:{//模板
		tableModule,
	},
    data () {//数据
        return {
        	
        	columns:[
        		{
        			align:'center',
        			width:70,
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			title: '名称',
                    key: 'name',
                    editable: true,
        		},
        		{
        			align:'center',
        			width:80,
        			title: '状态',
                    render: (h, params) => {
                    	console.log(params.row.pid_status);
                    	if(params.row.pid_status == 9){
                    		return h('span',{
                    			style: {
                    				color: '#bbbec4',
                    			}
                    		},'未发货');
                    	}
                    	if(params.row.pid_status == 10){
                    		return h('span',{
                    			style: {
                    				color: '#19be6b',
                    			}
                    		},'已发货');
                    	}
                    	
                    }
        		},
        		{
        			title: '日期',
                    key: 'create_time',
        		},
        		{
                	title: '操作',
                	align:'center',
                	width:150,
                	handle:['edit2','details','delete'],
                },
        	],
        	
        }
    },
    methods: {//方法
    	
    },
    computed:{//计算属性
        
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	
	},
    watch:{//监测数据变化
    	
	},
}
</script>

<style scoped>
</style>