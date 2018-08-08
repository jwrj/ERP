<template>

	<div>
		<Card>
		        		
    		<h1 slot="title">采购列表</h1>
    		
    		<div style="padding:16px;">
    			<table-module
					ref="tabInstance"
					:columns-list="columns"
					:pageId="6"
					:printBtn="true"
					
					tableDataUrl="items/purchase_list"
					deleUrl="items/purchase_delete"
					showUrl="items/purchase_show"
					editUrl="items/purchase_edit"
					componentViewType="pParticulars"
					componentEditType="purchaseEdit"
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
        	
        	columns: [//表头数据
        		{
        			align:'center',
        			width:70,
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			title: '采购名称',
                    key: 'name',
        		},
        		{
        			title: '创建日期',
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
		
	}
}
</script>

<style scoped>
</style>