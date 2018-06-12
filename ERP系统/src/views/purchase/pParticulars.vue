<template>
	
	<div>
		
		 <Card>
		 	
		 	<h1 slot="title">{{data.name}}</h1>
		 	
		 	<div style="padding:16px;">
		 		
		 		<Table :columns="tableColumns" :data="data.goodsList" border></Table>
		 		
		 	</div>
		 	
		 </Card>
		
	</div>

</template>

<script>
export default {
	components:{//模板
		
	},
	props:{
		
		id:Number,//ID
		
		showUrl:String,//详情url接口
		
	},
    data () {//数据
        return {
        	
        	tableColumns: [
				{
        			title: 'ID',
                    key: 'id',
                    width: 80,
                    align: 'center'
        		},
        		{
        			title: '物品名称',
                    key: 'name',
                    width: 280,
        		},
        		{
        			title: '购买数量',
                    key: 'number',
                    width: 100,
                    align: 'center'
        		},
        		{
        			title: '物品信息',
                    key: 'info',
        		},
        	],
        	
        	data: {},
        	
        }
    },
    methods: {//方法
    	
    	getTableData(){
    		
    		this.$axios.post(this.showUrl, {
    			id: this.id,
			})
			.then(response => {
				
				this.data = {
					id: response.data.id,
					name: response.data.name,
					goodsList: []
				};
				
				response.data.items_list.forEach(item => {
					
					if(item.item_info){
						
						let info = '';
						
						item.item_info.formData.forEach(item2 => {
							
							item2.formFields.forEach(item3 => {
								
								info += item3.label+'：'+item3.value+'，';
								
							});
							
						});
						
						this.data.goodsList.push({
							id: item.item_info.id,
							name: item.item_info.name,
							number: item.number,
							info:info,
						});
						
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
    	
    	this.getTableData();
    	
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
</style>