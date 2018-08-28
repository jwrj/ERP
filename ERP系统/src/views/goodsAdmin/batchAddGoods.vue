<template>

	<div>
		
		<Card>
			
			<h1 slot="title">表格批量添加物品</h1>
			
			<div style="padding:16px;">
				
				<!--废弃旧物品表格-->
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
        	
        	root: 'test-hot',
        	
        	hotsettings: {//初始化设置
        		
		        data: [['物品名称']],
		        
		        colHeaders: true,//显示头部字母
		        rowHeaders: true,//显示左侧行标索引
		        language: 'zh-CN',//语言设置
		        contextMenu: false,//右键菜单功能
		        mergeCells: false,//合并单元格功能
		        minSpareRows:25,//最小多出空白的列数
		        minSpareCols:25,//最小多出空白的行数
		       	manualColumnResize: true,//是否可调整列宽
		       	manualRowResize: true,//是否可调整行高
		        //maxCols: 26,//最大显示列单元格数量
				//maxRows: 26,//最大显示行单元格数量
				stretchH: 'all',//拉伸单元格
				cell: [//单个单元格渲染
					{
						row: 0,
						col: 0,
						readOnly: true
					}
				],
				cells: function(row, column, prop) {//多个单元格渲染
					
					if(row == 0){
						this.renderer = function (instance, td, row, col, prop, value, cellProperties) {
							Handsontable.renderers.TextRenderer.apply(this, arguments);
							td.style.fontWeight = 'bold';
						    td.style.color = '#19be6b';
						    td.style.background = '#f8f8f9';
						}
					}
					
				},
				afterChange: (a,b) => {//单元格数据改变之后回调
					if(b == 'edit'){
						//console.log(this.$refs.hotInstance.table.getSourceData());//获取整个表格的数据
					}
				}
		    }
        	
        }
    },
    methods: {//方法
    	
    	inquire(){//查库存
    		
    		//let tables = this.$refs.smarInstance.finalData.data;
    		
      		let tables = this.formatTableData(this.$refs.hotInstance.table.getSourceData());//格式化表格数据
    		
    		if(tables && tables.length > 0){
    			
	    		this.$axios.post('items/item_batchSearch', {
	    			tables: JSON.stringify(tables),
				})
				.then(response => {
					
					this.renderTabelData(response.data);//渲染表格重复数据
					
					this.$Message.success('查询成功');
					
					//this.repeatData = response.data;
					
				})
				.catch(function (error) {
					console.log(error);
				});
				
    		}else{
    			this.$Message.info('还没有任何数据!');
    		}
    		
    	},
    	submit(){//提交数据
    		
    		//let tables = this.$refs.smarInstance.finalData.data;
    		
    		let tables = this.formatTableData(this.$refs.hotInstance.table.getSourceData());//格式化表格数据
    		
      		//if(true)return false;
    		
    		if(tables && tables.length > 0){
    			
    			this.$axios.post('items/item_batchAdd', {
	    			itemTables: JSON.stringify(tables),
	    			data: '{"pid_tree_title":24,"pid_tree_class":13}',
				})
				.then(response => {
					
					if(response.code == 1){
						
						this.renderTabelData(response.data);//渲染表格重复数据
						
						this.$Message.success('提交成功');
						
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
    	renderTabelData(repeat){//渲染表格重复数据
    		
    		let repeatData = repeat || [];
						
			let allTableData = this.$refs.hotInstance.table.getSourceData();
			
			let rowIndexs = [];
			
			allTableData.forEach((item,index) => {
				
				repeatData.forEach(item2 => {
					
					if(!item2.__isNewItem && item[0] == item2.name){
						rowIndexs.push(index);
					}
				
				})
				
			})
			
			this.hotsettings.cells = function(row, column, prop){
	
        		if(row == 0){
					this.renderer = function (instance, td, row, col, prop, value, cellProperties) {
						Handsontable.renderers.TextRenderer.apply(this, arguments);
						td.style.fontWeight = 'bold';
					    td.style.color = '#19be6b';
					    td.style.background = '#f8f8f9';
					}
				}
        		
        		rowIndexs.forEach(item => {
        			
        			if(row == item && column == 0){
						this.renderer = function (instance, td, row, col, prop, value, cellProperties) {
							Handsontable.renderers.TextRenderer.apply(this, arguments);
						    td.style.background = 'red';
						    td.style.color = '#fff';
						}
					}
        			
        		})
        		
        	}
    		
    	},
    	formatTableData(tabData){//格式化表格数据
    		
    		 /*
		      	格式化返回的data,组装提交后台所需的格式  
		      	需要提交的参数:
		      	itemTables =  [{"itemName":"物品1","fields":[]},{"itemName":"物品888","fields":[]}]
		      	data = { "pid_tree_title":"12"  }//物品分类
      		*/
      		let itemTables = [];
      		
      		let data = tabData;
      		
		    if(data.length > 1){
		    	
		        let header = data[0]; //第一行数据作为字段名
		        
		        for(let i = 1; i < data.length; i++){
			        let h = data[i]; //一行数据,格式 [ 物品名称, 字段值, .....  ]
			        let itemName = h[0];
			        if(itemName == "" || itemName == null){
			        	continue; //不允许空的物品名
			        }
		        	let obj = {
			            itemName: h[0], //每一列的第0个数据是物品名称
			            fields: createField(h, header)
		        	};
		          		itemTables.push(obj);
		        }
		    }

	      	function createField(h, header) {
	        	let arr = [];
	        	for (let i = 0; i < header.length; i++) {
		          	let obj = {
			            delete: false,
			            fun: "",
			            id: "", //必须有但是是空值
			            pid_ft: -1,
			            status: 1,
			            type1: 1,
			            w: 1,
			            x: 1,
			            y: 0
		          	};
			        let f = header[i]; //表头的第i个字段名
			        let value = h[i]; //数据第i列的值
			        if (value == null) {
			        	value = "";
			        }
		          	if (i > 0 && f != "" && f != null) {
		            // >0 意思是不要把物品名称也放进来
			            obj.label = f;
			            obj.value = value;
			            arr.push(obj);
		          	}
		        }
	        	
	        	return arr;
	        	
	    	}

			//得到最终提交的格式 itemTables
		 	return itemTables;
		 	
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