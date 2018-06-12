<template>

	<div>
		
		<Card>
			
			<h1 slot="title">订单列表</h1>
			
			<div style="padding: 15px;">
				
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

import returnedMoney from '@/views/billEdit/returned-money.vue';
	
export default {
	components:{//模板
		tableModule,
		returnedMoney,
	},
	props:{
		
	},
    data () {//数据
        return {
        	columns:[
        		{
        			title: '回款记录',
        			width:100,
        			align: 'conter',
                   	type: 'expand',
                   	render: (h, params) => {
                        return h(returnedMoney, {
                            props: {
                            	rowId: params.row.id,
                            	rowUrl: 'orders/order_show',
                            },
                        })
                    }
                },
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
        			width:70,
        			title: '状态',
                    key: 'pid_status',
        		},
        		{
        			title: '日期',
                    key: 'create_time',
        		},
        		{
                	title: '操作',
                	align:'center',
                	width:80,
                	handle:['details'],
                },
        	],
        	
        }
    },
    methods: {//方法
    	
    	ajax(){
    		
    		this.$axios.post('接口路径', {
    			
			})
			.then(response => {
				
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
    	
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
</style>