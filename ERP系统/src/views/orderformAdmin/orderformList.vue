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
		.catch(function (error) {
			console.log(error);
		});
		
	});
	
}

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
	beforeRouteEnter (to, from, next) {//最早的钩子函数
		
		(async () => {//es7异步函数
			console.time('testForEach');
			console.log('开始');
		    console.log(await ajax());//等待异步函数执行完成再执行await，await在async后面
		    console.log('结束');
		    console.timeEnd('testForEach');
		})();
		
	    next(vm => {
	      console.log(to)  //vm为vue的实例
	      console.log('组件路由勾子beforeRouteEnter的next')
	    })
	}
}
</script>

<style scoped>
</style>