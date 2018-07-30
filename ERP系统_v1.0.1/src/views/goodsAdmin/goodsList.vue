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
					:clientSelect="true"
					
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
		
		<!--配件列表弹窗-->
		<Modal v-model="modalShow2" width="80%">
	    	
	    	<p slot="header">配件列表</p>
	        <div>
	        	<Table border :columns="columns2" :data="data2"></Table>
	        </div>
	        <div slot="footer">
	            <Button @click="modalShow2 = false">关闭</Button>
	        </div>
	    	
	    </Modal>
	    
	    <!--记录列表弹窗-->
		<Modal v-model="modalShow3" width="80%">
	    	
	    	<p slot="header">记录列表</p>
	        <div>
	        	<Table border :columns="columns3" :data="data3"></Table>
	        </div>
	        <div slot="footer">
	            <Button @click="modalShow3 = false">关闭</Button>
	        </div>
	    	
	    </Modal>
			
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
        	
        	//==============配件弹窗数据=================
        	
        	modalShow2: false,
        	
        	columns2: [
        		{
        			align:'center',
        			width:100,
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			title: '物品名称',
                    key: 'name',
        		},
        	],
        	
        	data2: [],
        	
        	//==============出入库记录弹窗数据=================
        	
        	modalShow3: false,
        	
        	columns3: [
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
        			align:'center',
        			width:120,
        			title: '数量',
        			key: 'number',
        		},
        	],
        	
        	data3: [],
        	
        	//================物品数据======================
        	
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
        			width:100,
        			title: '客户库存',
                    render: (h, params) => {
                    	
                    	if(params.row.warehousingFinal){
                    		
                    		return h('span',params.row.warehousingFinal);
                    		
                    	}else{
                    		
                    		return h('span',0);
                    		
                    	}
						
                    }
        		},
        		{
        			align:'center',
        			width:100,
        			title: '总库存',
                    render: (h, params) => {
						return h('span',params.row.extend_data[0].number)
                    }
        		},
        		{
        			title: '物品参数',
                    render: (h, params) => {
							
						let str = '';
						
						params.row.dataPage_show.formData.forEach(item => {
							
							item.formFields.forEach(item2 => {
								
								str += item2.label+'：'+item2.value+'，';
								
							});
							
						});
						
						return h('div',str ? str : '- -')
						
					},
        		},
        		{
                	title: '出入库记录',
                	align:'center',
                	width:100,
                	render: (h, params) => {
                		
                		let _this = this;
                		
                		return h('div',[
                		
                			h('Button',{
                				props: {
                					type: 'primary',
                					size: 'small',
                				},
                				on: {
                           			click(){
                           				
                           				_this.warehouseRecord(params.row.id,2);//出库记录
                           				
                           				_this.columns3.forEach(item => {
                           					if(item.key == 'number'){
                           						item.title = '出库数量';
                           					}
                           				})
                           				
                           			}
                           		},
                			},'出'),
                			
                			h('Button',{
                				props: {
                					type: 'primary',
                					size: 'small',
                				},
                				style: {
                					marginLeft: '4px',
                				},
                				on: {
                           			click(){
                           				
                           				_this.warehouseRecord(params.row.id,1);//入库记录
                           				
                           				_this.columns3.forEach(item => {
                           					if(item.key == 'number'){
                           						item.title = '入库数量';
                           					}
                           				})
                           				
                           			}
                           		},
                			},'入')
                		
                		]);
                		
                	}
                },
        		{
                	title: '配件',
                	align:'center',
                	width:100,
                	render: (h, params) => {
                		
                		let _this = this;
                		
                		return h('Button',{
        					props: {
                                type: 'success',
                                size: 'small',
                                disabled: params.row.extend_data[0].parts ? false : true,
                           },
                           style: {
                           		marginLeft: '4px',
                           },
                           on: {
                           		click(){
                           			
                           			_this.modalShow2 = true;
                           			
                           			_this.showConfiguration(params.row.extend_data[0].parts);
                           			
                           		}
                           }
        				},params.row.extend_data[0].parts ? '查看配件' : '无配件');
                			
                	}
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
    	
    	showConfiguration(str){//点击查看配置
    		
    		let where = ["or"];
    		
    		this.data2 = [];
    		
    		if(str){
    			
   				let partsList = str.split(',');
   				
	    		partsList.forEach(item => {
	    			
	    			where.unshift(["=",item]);
	    			
	    		})
	    		
	    		this.$axios.post('items/item_list', {
	    			where: '{ "id": '+ JSON.stringify(where) +' }',
	    			page: 1,
	    			pageSize: 99999,
				})
				.then(response => {
					
					this.data2 = response.data.dataList.data;
					
				})
				.catch(function (error) {
					console.log(error);
				});
				
   			}
    		
    	},
    	
    	warehouseRecord(goods_id,action_type){//出入库记录
    		
    		this.modalShow3 = true;
    		
    		let where = {
    			item_id: ["=",goods_id],
    			action_type: ["=" , action_type],
    		}
    		
    		let views = [
    		
    			[ "extend_warehousing", "id, pid_data_page, item_id, number, action_type", "", "" ],
    			
    			[ "data_page", "name", "data_page.id = extend_warehousing.pid_data_page", "" ]
    			
    		];
    		
    		this.$axios.post('system/views', {
    			page: 1,
    			pageSize: 99999,
    			where: JSON.stringify(where),
    			order:'{"id":"desc"}',
    			views: JSON.stringify(views),
			})
			.then(response => {
				
				this.data3 = response.data.dataList.data;
				
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