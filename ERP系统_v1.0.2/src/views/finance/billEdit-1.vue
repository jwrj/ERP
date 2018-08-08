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
					:ordClientSelect="true"
					:debtShow="true"
					
					tableDataUrl="orders/order_list"
					deleUrl="orders/order_delete"
					showUrl="orders/order_show"
					componentViewType="formView"
					componentEditType="formEdit"
				>
				</table-module>
				
			</div>
			
		</Card>
		
		<!--回款记录弹窗-->
		<Modal v-model="modalShow" width="80%">
	    	
	    	<p slot="header">回款详情</p>
	        <div>
	        	<returned-money
	        		ref="print"
        			v-if="modalShow"
        			:rowId="rowId"
        			rowUrl="orders/order_show"
        		>
	        	</returned-money>
	        </div>
	        <div slot="footer">
	        	<Button type="info" icon="ios-printer" class="no-print" @click="$print($refs.print.$el)">打印</Button>
	            <Button @click="modalShow = false">关闭</Button>
	        </div>
	    	
	    </Modal>
	    <!--回款记录弹窗-->
	    
	</div>
	
</template>

<script>
	
import tableModule from '@/components/table-module.vue';

import returnedMoney from '@/views/finance/returned-money.vue';
	
export default {
	components:{//模板
		tableModule,
		returnedMoney,
	},
	props:{
		
	},
    data () {//数据
        return {
        	
        	modalShow: false,
        	
        	rowId: null,
        	
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
        			title: '回款记录',
                    width:90,
        			align: 'center',
                   	render: (h, params) => {
                   		
                   		let _this = this;
                   		
                   		return h('Button',{
                   			props: {
                   				type: 'primary',
                   				size: 'small',
                            },
                   			on: {
                   				click(){
                   					
                   					_this.rowId = params.row.id;
                   					
                   					_this.modalShow = true;
                   					
                   				}
                   			},
                   		},'查看');
                   	}
        		},
        		{
                	title: '编辑物品单价',
                	align:'center',
                	width:120,
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
	table, td, th {
	    border: 1px solid black;
	}
	td{
		padding:10px;
	}
</style>