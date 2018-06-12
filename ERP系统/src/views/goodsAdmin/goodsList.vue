<template>

	<div>
		
		<Card>
			
			<h1 slot="title">物品列表</h1>
			
			<div style="padding:15px;">
				
				<table-module
					ref="tabInstance"
					:columns-list="columns"
					stateListId="13"
					seleSeekField="pid_tree_title"
					:pidTreeClassId="13"
					
					tableDataUrl="items/item_list"
					showUrl="items/item_show"
					editUrl="items/item_edit"
					deleUrl="items/item_delete"
					componentViewType="formView"
					componentEditType="formEdit"
					DBnameShowExtend="ExtendItems"
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
        			width:70,
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			title: '物品名称',
                    key: 'name',
        		},
        		{
        			align:'center',
        			width:80,
        			title: '库存数',
                    render: (h, params) => {
						return h('span',params.row.extend_data[0].number)
                    }
        		},
        		{
        			title: '物品其它信息',
                    render: (h, params) => {
							
						let str = '';
						
						params.row.dataPage_show.formData.forEach(item => {
							
							item.formFields.forEach(item2 => {
								
								str += item2.label+'：'+item2.value+'，';
								
							});
							
						});
						
						return h('div',str)
					},
        		},
        		{
                	title: '操作',
                	align:'center',
                	width:120,
                	handle:['edit2','delete'],
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