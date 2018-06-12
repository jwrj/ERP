<template>

	<div>
		
		<Card>
			
			<h2 slot="title">信息</h2>
			
			<div style="padding:10px;">
				
				<Table border :columns="columns" :data="dataList"></Table>
				
			</div>
			
		</Card>
			
	</div>
	
</template>

<script>
export default {
	components:{//模板
		
	},
	props:{
		
		rowId: {
			type: Number,//类型
		}
		
	},
    data () {//数据
        return {
        	
        	columns: [
        		{
        			align: 'center',
        			width: 100,
                    title: 'ID',
                    key: 'id',
                },
        		{
        			align: 'center',
        			width: 100,
                    title: '物品ID',
                    render: (h, params) => {
                    	return h('span',params.row.item_info.id)
                    }
                },
        		{
                    title: '物品名称',
                    render: (h, params) => {
                    	return h('span',params.row.item_info.name)
                    }
                },
        		{
                    title: '数量',
                    key: 'number',
                    render: (h, params) => {
                    	if(params.row.action_type == 1){
                    		params.column.title = '入库数量'
                    	}
                    	else if(params.row.action_type == 2){
                    		params.column.title = '出库数量'
                    	}
                    	
                    	return h('span',params.row.number)
                    }
                },
        		{
                    title: '日期',
                    key: 'create_time',
                },
        	],
        	
        	dataList: [],
        	
        }
    },
    methods: {//方法
    	
    	getDataList(){//获取数据列表
    		
    		this.$axios.post('items/warehousing_show', {
    			id: this.rowId,
    			item_info_field: '["id","name"]',
			})
			.then(response => {
				
				response.data.extend_data.forEach(item => {
					
					if(item.item_info){
					
						this.dataList.push(item);
						
					}
					
				});
				
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
    	this.getDataList();//获取数据列表
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
</style>