<template>
	
	<div>
		
		<Card>
			
			<h1 slot="title">领料单列表</h1>
			
			<div style="padding: 15px;">
				
				<table-module
					ref="tabInstance"
					:columns-list="columns"
					:pageId="32"
					:pidTreeClassId="10"
					:printBtn="true"
					
					tableDataUrl="items/warehousing_list"
					showUrl="items/warehousing_show"
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
        			title: '领料单名称',
                    key: 'name',
                    editable: true,
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
    	
	}
}
</script>

<style scoped>
</style>