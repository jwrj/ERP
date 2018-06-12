<template>

	<div>
		
		<Card>
			
			<h1 slot="title">订单列表（点击需要发货的订单）</h1>
			
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
	props:{
		
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
        			width:70,
        			title: '状态',
                    key: 'pid_status',
        		},
        		{
        			title: '日期',
                    key: 'create_time',
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