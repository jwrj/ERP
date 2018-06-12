<template>
	<div>
		
		<Card>
			<div style="padding:24px 0 0;">
				
    			<Form ref="formItem" :model="formItem" :rules="ruleItem" label-position="right" :label-width="90" inline>
    				
			        <FormItem label="发货单名称" prop="name">
			            <Input v-model="formItem.name" style="width: 160px;" placeholder="请输入名称"></Input>
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
    		
    		<h1 slot="title">发货客户</h1>
    		
    		<div style="padding:15px;">
	    		<form-view ref="viewInstance"></form-view>
    		</div>
    		
    	</Card>
    	
    	
    	<Card style="margin-top:15px;">
    		
    		<h1 slot="title">发货物品</h1>
    		
	    	<Row :gutter="16" type="flex" style="padding:15px;">
					
		        <Col span="10">
		        	
		        	<Card style="height:100%;min-height:687px;">
		        		
		        		<h1 slot="title">需要发货的物品列表（从右侧选择）</h1>
		        		
		        		<div style="width:100%;position: absolute;top:45px;bottom:0;overflow:auto;">
		        			
			        		<ul style="padding:0 16px 16px;">
			        			
			        			<Form ref="formInstance" :model="purchaseGoods" :label-width="70" inline>
	    							
				        			<li v-for="(item,index) in purchaseGoods.data" v-if="item._checked" style="padding-top:20px;border-bottom:1px dashed #dddee1;">
				        				
			        					<Row :gutter="10" style="margin-bottom:10px;">
									        <Col span="12">名称：{{item.name}}</Col>
									        <Col span="12">库存：{{item.extend_data[0].number}}</Col>
									    </Row>
										    
			        					<Row :gutter="10">
			        						
									        <Col span="12">
									        	<FormItem
					        						label="发货数量"
					        						:prop="'data.' + index + '.number'"
					        						:rules="formRules"
					        					>
					        						<Input v-model="item.number" placeholder="请输入数量" style="width:96px;">元</Input>
					        						
					        					</FormItem>
									        </Col>
									        
									        <Col span="12">
									        	<FormItem
					        						label="单价(元)"
					        						:prop="'data.' + index + '.price'"
					        						:rules="priceRules"
					        					>
					        						<Input v-model="item.price" placeholder="请输入价格" style="width:96px;"></Input>
					        						
					        					</FormItem>
					        					
									        </Col>
									        
									    </Row>
				        					
				        			</li>
				        			
			        			</Form>
			        			
			        		</ul>
			        		
		        		</div>
		        		
					</Card>
					
		        </Col>
		        
		        <Col span="14">
		        	
		        	<Card>
		        		
		        		<h1 slot="title">物品列表</h1>
		        		
		        		<div style="padding:16px;">
		        			<table-module
								ref="tabInstance"
								:columns-list="columns"
								stateListId="13"
								seleSeekField="pid_tree_title"
								:pidTreeClassId="13"
								@selectAlter="selectAlter"
								
								tableDataUrl="items/item_list"
								showUrl="items/item_show"
								componentViewType="formView"
								componentEditType="formEdit"
							>
							</table-module>
		        		</div>
		        		
					</Card>
		        	
		        </Col>
		        
		    </Row>
		</Card>
    	
    	
    	
    	<div style="margin-top:15px;">
    		<new-form
    			:pid-tree-class="6"
    			:pageId="27"
				titleName="其它信息"
				buttonName="提交发货单"
				submitUrl="system/page_into"
    		>
    		</new-form>
    	</div>
	    
	    
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
        			width:80,
        			title: '库存数',
                    render: (h, params) => {
						return h('span',params.row.extend_data[0].number)
                    }
        		},
        		{
                	title: '操作',
                	align:'center',
                	width:80,
                	handle:['details'],
                },
        	],
        	
        	purchaseGoods:{//需要购买的物品列表
        		data: []
        	},
        	
        	formRules: [
                { required: true, message: '必须输入购买数量', trigger: 'blur' }
            ],
            
        	priceRules: [
                { required: true, message: '必须输入价格', trigger: 'blur' }
            ],
			
			
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
    		this.purchaseGoods.data = data;
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