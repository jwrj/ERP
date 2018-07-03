<template>
	
	<div>
		
    	<Card>
    		
    		<div slot="title" style="display: flex;align-items: center;justify-content: space-between;">
    			<h1>{{titleName}}</h1>
    			<div>
    				<span style="margin-right:6px;font-size:12px;">选择模板</span>
    				<Select ref="seleInstance" v-model="defaultTem" filterable placeholder="无数据" @on-change="template" style="width:150px">
    			        <Option v-for="item in templateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    			    </Select>
    			    <div style="display: inline-block;">
    			    	<cpm-mod
    			    		@upPageData="upPage"
    			    		titleName="模板管理"
				    		module-type="tempAdmin" 
				    		width="80%"
				    		:butName="{io:true,name:'模板管理'}"
				    		:confirmBut="{io:true,name:'更新页面数据'}"
				    	>
    			    	</cpm-mod>
    			    </div>
    			</div>
    		</div>
    		
    		<div style="position: relative;">
    			
    			<Spin fix v-show="pageLoad"></Spin>
    			
	    		<div style="padding:15px 15px 0;">
	    			
				    <div v-for="item in titleList">
					    <Card style="margin-bottom:15px;">
					    	<h1 slot="title">{{item.name}}</h1>
					    	<form-mod ref="modInstance" @increment="formEvent" :pid="item.id" :form-data="item.formFields"></form-mod>
					    	
					    	<template v-for="item2 in item.children" v-if="true">
						    	<Card :bordered="false" dis-hover>
							    	<h2 slot="title" class="h2">{{item2.name}}</h2>
						    		<form-mod ref="modInstance" @increment="formEvent" :pid="item2.id" :form-data="item2.formFields"></form-mod>
						    	</Card>
					    	</template>
					    </Card>
				    </div>
			    </div>
			    
			    <div style="text-align: center;padding:40px 15px 15px;border-top:1px solid #e9eaec;">
			    	<Button type="primary" @click="submit">{{buttonName}}</Button>
			    </div>
			    
			</div>
		    
	    </Card>
	    
	</div>
	
</template>

<script>
	
import formMod from '@/components/form.vue';

import cpmMod from '@/components/cpm-mod.vue';

import bus from '../../static/public/js/eventBus.js';//中央事件总线

export default {
	components:{//模板
		formMod,
		cpmMod,
	},
	props:{
		
		pidTreeClass:Number,//页面分类id
		
		pageId:{//页面id
			type:Number,//类型
			required: true,//必传
		},
		
		parentInfo: {//info
			type:Object,//类型
		},
		
		titleName:{//标题名称
			type: String,
      		default: '标题'
		},
		
		buttonName:{//按钮名称
			type: String,
      		default: '提交'
		},
		
		submitUrl:{//提交的URL
			type: String,
      		default: 'system/page_submit'
		},
	},
	data(){
		return {
			
            pageLoad:false,//数据加载中
            
			formIDS:null,//表单id列表
			
			templateList:[],//模板列表
			
			defaultTem:'',//默认模板
			
			titleList:[],//标题列表
			
			formDatas:[],//表单数据
			
			useDataPageIdArr: [],//其他页面数据
			
		}
	},
	methods: {
		getTemplate(){//获取模板列表
			
			this.pageLoad = true;
			
			this.$axios.post('system/template_list', {
				pid_tree_title:this.pageId,
			})
			.then(response => {
				
				this.templateList = [];
				
				let arr = [];
				
				response.data.forEach((item) => {
					arr.push({
						label:item.name,
						value:item.id,
					});
				});
				
				this.templateList = arr;
				
				if(this.templateList.length > 0){//设置默认模板
					this.defaultTem = this.templateList[0].value;
				}
				
				this.$refs.seleInstance.optionInstances.forEach((item,index,arr) => {
					item.searchLabel = this.templateList[index].label;
				});
	
			})
			.catch(function (error) {
				console.log(error);
			});
		},
		template(price){//选择模板
			
			this.formList(price);//读取标题表单列表
			
		},
        formList(templateId){//读取标题表单列表
        	
        	this.pageLoad = true;
        	
        	this.$axios.post('orders/order_into', {
        		template_list_id:this.pageId,
        		use_template_id:templateId,
			})
			.then((response) => {
				
				this.titleList = response.data.templateForm;
				
				let formFields = [];
				
				response.data.templateForm.forEach(item => {
					formFields.push(...item.formFields);
				})
				
				this.formDatas = formFields;
				
				this.formIDS = response.data.pageInfo.use_templateFormIDS;

				this.pageLoad = false;
				
			})
			.catch(error => {
				console.log(error);
			});
        },
        formEvent(){//数据改变时
        	let arr = [];
        	this.$refs.modInstance.forEach(item => {
        		arr.push(...item.formDynamic.data)
        	});
        	this.formDatas = arr;
        	
        },
        submit(){//表单提交
        	
        	let num1 = 0;
        	
			let num2 = 0;
			
        	this.$parent.$refs['formItem'].validate((valid) => {
        		
                if (valid) {
                	
					this.$refs.modInstance.forEach((item) => {
						item.$refs.formDynamic.validate((valid) => {
							num1++;
							if(valid){
								num2++;
							}
				        })
		        	});
	        	
		        	if(num1 === num2){
		        		
		        		let formDatasString = JSON.stringify(this.formDatas);
						
		        		let info = {
		        			name:this.$parent.formItem.name,
		        			pid_tree_title:this.pageId,
		        			use_dataPage_ids: this.useDataPageIdArr.length > 0 ? JSON.stringify(this.useDataPageIdArr) : null,
		        			for_user_id: this.$parent.purchaseGoods ? this.$parent.formItem.clientModel : null,
		        		}
		        		
		        		let infoString = JSON.stringify(info);
		        		
	        			if(this.$parent.purchaseGoods){//有物品选择的页面提交（如：新增订单页）
	        				
	        				let tf = false;
			
		    				this.$parent.purchaseGoods.data.forEach(item => {
		    					if(item._checked){
		    						tf = true;
		    					}
		    				});
		        			
							if(this.$parent.purchaseGoods.data.length > 0 && tf){
								
								this.$parent.$refs['formInstance'].validate((valid) => {
		        				
			        				if (valid) {
			        					
			        					let data = [];
		                	
					                	this.$parent.purchaseGoods.data.forEach(item => {
					                		
					                		if(item._checked){
					                			
						                		data.push({
				    								item_id: item.id,
				    								number: item.inputNumber,
						                		});
					                			
					                		}
					                		
					                	});
			        					
							        	this.$axios.post(this.submitUrl, {
							        		fields:formDatasString,
							        		info:infoString,
							        		template_FormTable_ids:this.formIDS,
							        		data: JSON.stringify(data),
										})
										.then((response) => {
											if(response.code === 1){
												
												this.formDatas = [];//清空临时数据
												
												this.formList(this.defaultTem);//读取标题表单列表
												
												//======================================
												
												this.$parent.formItem.name = '';
												
									    		this.$parent.purchaseGoods.data = [];
									    		
									    		this.$parent.$refs.tabInstance.submitSucceed();//提交成功后勾选功能数据还原
									    		
												this.$Message.success('提交成功!');
												
											}
										})
										.catch(error => {
											console.log(error);
										});
										
			        				}else{
			        					
			        					this.$Message.error('请输入需求数量!');
			        					
			        				}
									
			        			});
							
							}else{
								this.$Message.info('没有选择任何物品!');
							}
	        				
	        			}else{//没有物品选择的页面提交（如：新增客户页）
	        				
	        				this.$axios.post(this.submitUrl, {
				        		fields:formDatasString,
				        		info: this.parentInfo ? JSON.stringify(this.parentInfo) : infoString,
				        		template_FormTable_ids:this.formIDS,
							})
							.then((response) => {
								if(response.code === 1){
									
									this.$parent.formItem.name = '';
									
									this.formDatas = [];//清空临时数据
									
									this.formList(this.defaultTem);//读取标题表单列表
									
									this.$Message.success('提交成功!');
									
									this.$emit('submitChange');//侦听父级事件
									
								}
							})
							.catch(error => {
								console.log(error);
							});
	        				
	        			}
		        		
		        	}else{
		        		this.$Message.error('字段名不能为空！');
		        	}
                	
                } else {
                    this.$Message.error('请完善信息！');
                }
                
            })
        	
        },
        upPage(){//更新页面
        	this.getTemplate();//获取模板列表
        	this.formList(this.defaultTem);//读取标题表单列表
        },
	},
	computed:{//计算属性
        
    },
    created(){
	},
	mounted(){
		
		this.getTemplate();//获取模板列表
		
		bus.$on('viewWatch',(val)=>{//监听器
			this.useDataPageIdArr.push(val);
		});
		
	}
}
</script>

<style scoped>
	.h2{
		padding-left:20px;
	}
</style>