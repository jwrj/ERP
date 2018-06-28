<template>
	<div>
		
		<Card>
			<div style="padding:24px 0 0;">
				
    			<Form ref="formItem" :model="formItem" :rules="ruleItem" label-position="right" :label-width="80" inline>
    				
			        <FormItem label="订单名称" prop="name">
			            <Input v-model="formItem.name" style="width: 160px;" placeholder="请输入订单名称"></Input>
			        </FormItem>
			        
			        <FormItem label="选择客户" prop="clientModel">
			        	
			            <Select v-model="formItem.clientModel" filterable placeholder="无数据" style="width:150px" @on-change="clientSele">
					        <Option v-for="item in clientList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
					    
					    <Button type="dashed" icon="plus-round" @click="addClient">新增客户</Button>
					    
					    <Button type="primary" icon="edit" @click="editClient">编辑客户</Button>
					    
			        </FormItem>
			        
				</Form>
				
				
			</div>
		</Card>
		
    	<Card v-if="clientList.length > 0" style="margin-top:15px;">
    		
    		<h1 slot="title">订单客户</h1>
    		
    		<div style="padding:15px;">
	    		<form-view ref="viewInstance"></form-view>
    		</div>
    		
    	</Card>
    	
    	<Card style="margin-top:15px;">
    		
    		<h1 slot="title">订单物品</h1>
    		
	    	<div style="padding:16px;">
				
	        	<Card>
	        		
	        		<div slot="title" style="display:flex;justify-content: space-between;align-items: center;">
	        			<h2>订单需求物品列表</h2>
	        			<Button type="primary" size="small" @click="modalShow = true">打开物品列表</Button>
	        		</div>
	        		
	        		<div style="padding:16px;">
	        			<Form class="tableFormInstance" ref="formInstance" :model="purchaseGoods" :show-message="false">
	        				<Table border :columns="goodsColumns" :data="purchaseGoods.data"></Table>
	        			</Form>
	        		</div>
	        		
				</Card>
				
			</div>
			
		</Card>
    	
    	<!--弹窗选数据-->
		<Modal v-model="modalShow" width="80%">
	        <p slot="header">物品列表</p>
	        <div>
    			<table-module
					ref="tabInstance"
					:columns-list="columns"
					:pidTreeClassId="13"
					stateListId="13"
					:clientSelect="true"
					
					tableDataUrl="items/item_list"
					seleSeekField="pid_tree_title"
					DBnameShowExtend="ExtendItems"
					@selectAlter="selectAlter"
				>
				</table-module>
	        </div>
	        <div slot="footer">
	            <Button @click="modalShow = false">关闭</Button>
	        </div>
	    </Modal>
	    <!--弹窗选数据-->
    	
    	<div style="margin-top:15px;">
    		<new-form
    			ref="newFormInstance"
    			:pid-tree-class="4"
    			:pageId="22"
				titleName="订单信息"
				buttonName="新增订单"
				submitUrl="orders/order_add"
    		>
    		</new-form>
    	</div>
	    
	    <Modal v-model="modalShow2" width="80%">
	    	
	    	<p slot="header">配件列表</p>
	        <div>
	        	<Table border :columns="columns2" :data="data2"></Table>
	        </div>
	        <div slot="footer">
	            <Button @click="modalShow2 = false">关闭</Button>
	        </div>
	    	
	    </Modal>
	    
	</div>
</template>

<script>


import newForm from '@/components/new-form.vue';

import formView from '@/components/form-view.vue';

import tableModule from '@/components/table-module.vue';


export default {
	components:{//模板
		newForm,
		formView,
		tableModule,
	},
	data(){
		return {
			
			//==============弹窗配件数据=================
        	
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
        	
        	//======================================
			
			columns: [
        		{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
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
                    	
                    	return h('span',params.row.warehousingFinal);
						
                    }
        		},
        		{
        			align:'center',
        			width:80,
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
						
						return h('div',str)
					},
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
        	],
        	
        	//===========================================
        	
        	goodsColumns: [
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
        			title: '其它信息',
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
        			width:160,
        			title: '需求数量',
        			render: (h, params) => {
        				
        				let current = this.purchaseGoods.data.filter(item => {return item.id === params.row.id;});
    					let currentRow = current[0];
    					
    					return h('FormItem',{
    						props: {
    							prop: 'data.' + params.index + '.inputNumber',
    							rules: this.formRules2
    						},
    					},[
    						h('Input',{
								props: {
									value: currentRow.inputNumber,
									placeholder: '请输入'+params.column.title,
								},
								on: {
	                                'on-change' (event) {
	                                	currentRow.inputNumber = event.target.value;
	                                }
	                            }
							})
    					])
						
                    }
        		},
        	],
        	
        	purchaseGoods:{//需要购买的物品列表
        		data: []
        	},
        	
        	//===========================================
            
            modalShow: false,//弹窗显示开关
        	
        	formRules2: [
                { required: true, message: '必须输入数量', trigger: 'blur' }
            ],
            
            //===========================================
            
			clientList: [],//客户列表
			
            formItem:{//名称表单值
				name: '',
				clientModel: '',
			},
			
			ruleItem:{//表单判断
				name:[
                    { required: true, message: '请输入订单名称', trigger: 'blur' }
                ],
				clientModel:[
                    { type: 'number', required: true, message: '请选择客户', trigger: 'change' }
                ],
			},
            
		}
	},
	methods: {
		selectAlter(data){//勾选发生改变时
    		
    		let arr = [];
    		
    		data.forEach(item => {
    			if(item._checked){
    				arr.push(item);
    			}else{
    				item.inputNumber = '';
    			}
    		})
    		
    		this.purchaseGoods.data = arr;
    		
    	},
		getClient(){//获取客户列表
			this.$axios.post('oa/customer_list', {
				where: '{"pid_tree_title": ["=","2"]}',
				order: '{"id":"asc"}',
			})
			.then(response => {
				
				response.data.dataList.data.forEach(item => {
					
					this.clientList.push({
						label: item.name,
						value: Number(item.id),
					});
					
				});
				
				
				if(this.clientList.length > 0){
					this.formItem.clientModel = this.clientList[0].value;
				}
				
			})
			.catch(function (error) {
				console.log(error);
			});
		},
		clientSele(id){//选择客户
			this.$refs.newFormInstance.useDataPageIdArr = [];
			this.$refs.viewInstance.getTitleList(id);
		},
		addClient(){//添加客户
			this.$router.replace({
				name:'addClient',
			});
		},
		editClient(){//编辑客户
			this.$router.replace({
				name:'clientList',
			});
		},
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
	},
	computed:{//计算属性
        
    },
    created(){
    	
	},
	mounted(){
		this.getClient();//获取客户列表
	}
}
</script>

<style scoped>
	.h2{
		padding-left:20px;
	}
</style>