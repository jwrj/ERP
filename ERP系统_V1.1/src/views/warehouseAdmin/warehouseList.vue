<template>

	<div>
		
		<Card>
			
			<h1 slot="title">入库列表</h1>
			
			<div style="padding: 15px;">
				
				<table-module
					ref="tabInstance"
					:columns-list="columns"
					:pageId="8"
					:pidTreeClassId="10"
					
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
	props:{
		
	},
    data () {//数据
        return {
        	
        	columns: [
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