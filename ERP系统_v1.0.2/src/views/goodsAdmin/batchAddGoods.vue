<template>

	<div>
		
		<Card>
			
			<h1 slot="title">表格批量添加物品</h1>
			
			<div style="padding:16px;">
				
				<!--<div style="overflow: auto;">
					<smartTable-newItem ref="smarInstance" :repeatData="repeatData"></smartTable-newItem>
				</div>-->
				
				<div style="width: 100%;height: 600px;overflow: hidden;">
					
					<hot-table ref="hotInstance" :root="root" :settings="hotsettings"></hot-table>
					
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

import HotTable from '@handsontable/vue';

import 'handsontable/languages/zh-CN';

import 'handsontable/dist/handsontable.full.css';

import * as Handsontable from 'handsontable';

export default {
	components:{//模板
		smartTableNewItem,
		HotTable,
	},
	props:{
		
	},
    data () {//数据
        return {
        	
        	repeatData: null,
        	
        	root: 'test-hot',
        	
        	hotsettings: {//初始化设置
        		
		        data: [['物品名称']],
		        
		        colHeaders: true,
		        rowHeaders: true,//显示左侧行标索引
		        language: 'zh-CN',//语言设置
		        contextMenu: true,//右键菜单功能
		        mergeCells: true,//合并单元格功能
		        minSpareRows:25,
		        minSpareCols:25,
		       	manualColumnResize: true,
		       	manualRowResize: true,
		        //maxCols: 26,
				//maxRows: 26,
				stretchH: 'all',
				cell: [
					{
						row: 0,
						col: 0,
						readOnly: true
					}
				],
				cells: function(row, column, prop) {
					
					if(row == 0){
						
						this.renderer = function (instance, td, row, col, prop, value, cellProperties) {
							
							Handsontable.renderers.TextRenderer.apply(this, arguments);
							td.style.fontWeight = 'bold';
						    td.style.color = 'green';
						    td.style.background = '#F0F0F0';
							
						}
						
					}
					
				},
				afterChange: (a,b) => {//单元格数据改变之后回调
					if(b == 'edit'){
						
						console.log(this.$refs.hotInstance.table.getSourceData());//获取整个表格的数据
						
					}
				}
		    }
        	
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
    		
    		console.log(tables);
    		
    		//if(true)return false;
    		
    		if(tables && tables.length > 0){
    			
    			this.$axios.post('items/item_batchAdd', {
	    			itemTables: JSON.stringify(tables),
	    			data: '{"pid_tree_title":24,"pid_tree_class":13}',
				})
				.then(response => {
					
					if(response.code == 1){
						
						this.$Message.success('提交成功');
						
						this.repeatData = response.data;
						
						this.$emit('submitSucceed');
						
					}
					
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
    	
    	window.addEvent("paste",function(e){
    		console.log(e);
    	});
    	
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
</style>