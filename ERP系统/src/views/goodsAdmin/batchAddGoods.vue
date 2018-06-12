<template>

	<div>
		
		<Card>
			
			<h1 slot="title">批量添加物品（这里添加的物品都为成品）</h1>
			
			<div style="padding:16px;">
				
				<div style="overflow: auto;">
					<smartTable-newItem ref="smarInstance" :repeatData="repeatData"></smartTable-newItem>
				</div>
				
				<div style="text-align: center;margin-top:16px;">
					<Button type="primary" @click="inquire">查库存</Button>
					<Button type="primary" @click="submit">提交</Button>
				</div>
				
			</div>
			
		</Card>
			
	</div>
	
</template>

<script>
	
import smartTableNewItem from '@/components/smartTable_newItem.vue';
	
export default {
	components:{//模板
		smartTableNewItem,
	},
	props:{
		
	},
    data () {//数据
        return {
        	
        	repeatData: null,
        	
        }
    },
    methods: {//方法
    	
    	inquire(){//查库存
    		
    		let tables = this.$refs.smarInstance.finalData.data;
    		
    		if(tables && tables.length > 0){
    			
	    		this.$axios.post('items/item_batchSearch', {
	    			tables: JSON.stringify(tables),
				})
				.then(response => {
					this.$Message.success('查询成功');
					this.repeatData = response.data;
				})
				.catch(function (error) {
					console.log(error);
				});
				
    		}else{
    			this.$Message.info('还没有任何数据!');
    		}
    		
    		
    	},
    	submit(){//提交数据
    		
    		let tables = this.$refs.smarInstance.finalData.data;
    		
    		if(tables && tables.length > 0){
    			
    			this.$axios.post('items/item_batchAdd', {
	    			itemTables: JSON.stringify(tables),
	    			data: '{"pid_tree_title":24,"pid_tree_class":13}',
				})
				.then(response => {
					this.$Message.success('提交成功');
					this.repeatData = response.data;
				})
				.catch(function (error) {
					console.log(error);
				});
    			
    		}else{
    			this.$Message.info('还没有任何数据!');
    		}
    		
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