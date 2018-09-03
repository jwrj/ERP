<template>
	
	<div>
		
		<Card>
			
			<h1 slot="title">订单基本信息填写</h1>
			
			<div style="padding:24px 0 1px;">
				
				<Form ref="formItem" :model="formItem" :rules="ruleItem" label-position="right" :label-width="90">
					
			        <FormItem label="订单名称" prop="name">
			            <Input v-model="formItem.name" clearable style="max-width: 200px;" placeholder="请输入订单名称"></Input>
			        </FormItem>
			        
			        <FormItem label="选择客户" prop="clientModel">
			        	
			            <Select v-model="formItem.clientModel" filterable placeholder="无数据" style="max-width:260px" @on-change="clientSele">
					        <Option v-for="item in clientList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
					    
					    <Button type="primary" icon="edit" @click="editClient">客户管理</Button>
					    
			        </FormItem>
			        
			        <FormItem label="送货信息">
			            <Checkbox v-model="addressIo" @on-change="checkbox"></Checkbox>
			        </FormItem>
			        
		        </Form>
			        
			</div>
			
		</Card>
		
    	<Card style="margin-top:16px;" v-if="clientList.length > 0">
    		
    		<h1 slot="title">订单客户</h1>
    		
    		<div>
	    		<form-view ref="viewInstance"></form-view>
    		</div>
    		
    	</Card>
    	
    	<Card style="margin-top:16px;" v-if="addressIo">
    		
    		<div slot="title" style="display:flex;align-items: center;">
    			
    			<h1>订单送货信息</h1>
    			
    			<div style="margin-left: auto;">
    				
	    			<label style="margin-right:10px;font-size: 12px;">选择送货地址</label>
	    			
		    		<Select v-model="formItem.address" filterable placeholder="无数据" style="width:150px" @on-change="addressSele">
				        <Option v-for="item in addressList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
				    
				    <Button type="primary" icon="edit" @click="editAddress">地址管理</Button>
    			</div>
    			
    		</div>
    		
    		<div v-if="addressList.length > 0">
	    		<form-view ref="viewInstance2"></form-view>
    		</div>
    		
    	</Card>
    	
    	<Card style="margin-top:16px;">
    		
    		<h1 slot="title">订单物品</h1>
    		
	    	<div style="padding:0 16px 16px;">
				
	        	<Card dis-hover :bordered="false">
	        		
	        		<div style="margin-top:16px;padding: 14px 0 14px 30px;display:flex;align-items: center;">
	        			<p style="margin-right: 16px;">已选物品列表</p>
	        			<Button type="primary" size="small" @click="modalShow = true">打开物品列表</Button>
	        		</div>
	        		
	        		<div>
	        			<Form class="tableFormInstance" ref="formInstance" :model="purchaseGoods" :show-message="false">
	        				<Table border :columns="goodsColumns" :data="purchaseGoods.data"></Table>
	        			</Form>
	        		</div>
	        		
				</Card>
				
			</div>
			
		</Card>
    	
    	<div style="margin-top:16px;">
    		<new-form
    			ref="newFormInstance"
    			:pid-tree-class="4"
    			:pageId="22"
				titleName="订单附加信息"
				buttonName="新增订单"
				submitUrl="orders/order_add"
    		>
    		</new-form>
    	</div>
	    	
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
					:recombinationData="true"
					
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
                    fixed: 'left',
                    align: 'center'
                },
        		{
        			align:'center',
        			width:70,
        			fixed: 'left',
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			minWidth:160,
        			ellipsis: true,
        			fixed: 'left',
        			title: '物品名称',
                    key: 'name',
        		},
        		{
        			width:100,
        			fixed: 'left',
        			title: '客户库存',
                    render: (h, params) => {
                    	
                    	return h('span',params.row.warehousingFinal);
						
                    }
        		},
        		{
        			width:100,
        			fixed: 'left',
        			title: '总库存',
                    render: (h, params) => {
						return h('span',params.row.extend_data[0] ? params.row.extend_data[0].number : 0)
                    }
        		},
        		{
                	title: '配件',
                	align:'center',
                	fixed: 'right',
                	width:100,
                	render: (h, params) => {
                		
                		let _this = this;
                		
                		return h('Button',{
        					props: {
                                type: 'success',
                                size: 'small',
                                disabled: params.row.extend_data[0] ? params.row.extend_data[0].parts ? false : true : true,
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
        				},params.row.extend_data[0] ? params.row.extend_data[0].parts ? '查看配件' : '无配件' : '无配件');
                		
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
						return h('span',params.row.extend_data[0] ? params.row.extend_data[0].number : 0)
                    }
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
			
			addressList: [],//地址列表
			
			addressIo: true,
			
			seleOnOff1: false,
			
			seleOnOff2: false,
			
            formItem:{//名称表单值
				name: '',
				clientModel: '',
				address: '',
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
				pageSize: 99999,
				where: '{"pid_tree_title": ["=","2"]}',
				order: '{"id":"desc"}',
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
			
			if(this.clientList.length <= 0)return false
			
			this.$refs.newFormInstance.useDataPageIdArr = [];
			
			this.$refs.viewInstance.getTitleList(id);
			
			if(this.seleOnOff1){
				if(this.addressList.length > 0){
					setTimeout(() => {
						this.$refs.viewInstance2.getTitleList(this.formItem.address);
					},30);
				}
			}else{
				
				this.seleOnOff1 = true;
				
			}
			
		},
		editClient(){//客户管理
			this.$router.replace({
				name:'addClient',
			});
		},
		editAddress(){//地址管理
			this.$router.replace({
				name:'address',
			});
		},
		getAddress(){//获取地址列表
			this.$axios.post('system/page_list', {
				pageSize: 99999,
				where: '{"pid_tree_title": ["=","27"]}',
				order: '{"id":"desc"}',
			})
			.then(response => {
				
				response.data.dataList.data.forEach(item => {
					
					this.addressList.push({
						label: item.name,
						value: Number(item.id),
					});
					
				});
				
				if(this.addressList.length > 0){
					this.formItem.address = this.addressList[0].value;
				}
				
			})
			.catch(function (error) {
				console.log(error);
			});
		},
		addressSele(id){//选择地址
			
			if(this.addressList.length <= 0)return false
			
			this.$refs.newFormInstance.useDataPageIdArr = [];
			
			if(this.seleOnOff2){
				if(this.clientList.length > 0){
					this.$refs.viewInstance.getTitleList(this.formItem.clientModel);
				}
			}else{
				
				this.seleOnOff2 = true;
				
			}
			
			setTimeout(() => {
				this.$refs.viewInstance2.getTitleList(id);
			},30);
			
		},
		checkbox(tf){
			
			this.addressList = [];
			
			this.formItem.address = '';
			
			this.$refs.newFormInstance.useDataPageIdArr = [];
			
			if(tf){
				this.getAddress();//获取地址列表
			}
			
			if(!tf && this.clientList.length > 0){
				this.$refs.viewInstance.getTitleList(this.formItem.clientModel);
			}
			
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
		
		if(this.addressIo){
			this.getAddress();//获取地址列表
		}
		
	},
}
</script>

<style scoped>
	.h2{
		padding-left:20px;
	}
</style>