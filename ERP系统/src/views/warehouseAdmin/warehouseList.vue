<template>

	<div>
		
		<Card>
			
			<h1 slot="title">出入库列表</h1>
			
			<div style="padding:16px;">
				
				<table-module
					ref="tabInstance"
					:columns-list="columns"
					stateListId="10"
					seleSeekField="pid_tree_title"
					:pidTreeClassId="10"
					tableDataUrl="items/warehousing_list"
				>
				</table-module>
				
			</div>
			
		</Card>
			
	</div>
	
</template>

<script>
	
import tableModule from '@/components/table-module.vue';

import warehouseP from '@/components/warehouseP.vue';
	
export default {
	components:{//模板
		tableModule,
	},
	props:{
		
//		name: {
//			type: Array | Number | String | Object,//类型
//			required: true,//必传
//			default: '',//默认值
//		}
		
	},
    data () {//数据
        return {
        	
        	columns: [
        		{
        			title: '详情',
        			width:60,
        			align: 'conter',
                   	type: 'expand',
                   	render: (h, params) => {
                        return h(warehouseP, {
                            props: {
                            	rowId: params.row.id,
                            },
                        })
                    }
                },
        		{
        			align:'center',
        			width:100,
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			title: '名称',
                    key: 'name',
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