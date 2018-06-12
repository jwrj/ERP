<template>
	
	<div>
		
		<Card>
			
			<h1 slot="title">环节配置</h1>
			
			<div style="border-bottom:1px solid #dddee1;padding:16px 0 0 16px;">
				
				<Form ref="formInstance1" :rules="formRules1" :model="formData" :label-width="94">
					
					<FormItem label="生产单名称" prop="name">
			            <Input v-model="formData.name" placeholder="输入名称..." style="width:160px;"></Input>
			        </FormItem>
			        
		        </Form>
		        
			</div>
			
			<div style="padding:16px 16px 0;border-bottom:1px solid #dddee1;">
				
				<Steps>
					<template v-for="item in linkList">
			        	<Step style="width:200px;margin-bottom:16px;" :title="item.label" :status="item.status" :icon="item.icon" :content="item.content"></Step>
			        </template>
			    </Steps>
				
			</div>
			
			<Row :gutter="16" type="flex" style="padding:16px;">
				
		        <Col span="10">
		        	
		        	<Card style="height:100%;min-height:687px;">
		        		
		        		<h1 slot="title">环节需要完成的物品（从右侧选择）</h1>
		        		
		        		<div style="width:100%;position: absolute;top:45px;bottom:0;overflow:auto;">
		        			
		        			<div style="padding:16px;display:flex;align-items: center;border-bottom:1px solid #e9eaec;">
		        				<p style="margin-right:10px;flex-shrink: 0;">选择环节</p>
			        			<Select v-model="stepId">
							        <Option v-for="item in linkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							    </Select>
			        		</div>
		        			
			        		<ul style="padding:0 16px 16px;">
			        			
			        			<Form ref="formInstance" :model="purchaseGoods" :label-width="70" inline>
        							
				        			<li v-for="(item,index) in purchaseGoods.data" v-if="item._checked" style="padding-top:20px;border-bottom:1px dashed #dddee1;">
				        				
			        					<Row :gutter="10" style="margin-bottom:10px;">
									        <Col span="8">ID：{{item.id}}</Col>
									        <Col span="8">名称：{{item.name}}</Col>
									        <Col span="8">库存：{{item.extend_data[0].number}}</Col>
									    </Row>
										    
			        					<Row :gutter="10">
			        						
									        <Col span="12">
									        	<FormItem
					        						label="任务数量"
					        						:prop="'data.' + index + '.number'"
					        						:rules="formRules"
					        					>
					        						<Input v-model="item.number" placeholder="请输入数量" style="width:96px;"></Input>
					        						
					        					</FormItem>
									        </Col>
									        
									        <Col span="12">
									        	
									        </Col>
									        
									    </Row>
				        					
				        			</li>
				        			
			        			</Form>
			        			
			        		</ul>
			        		
			        		<div style="text-align: center;padding-bottom:16px;">
			        			<Button type="primary" @click="finish('formInstance')">保存配置</Button>
			        		</div>
			        		
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
								tableDataUrl="items/item_list"
								@selectAlter="selectAlter"
								DBnameShowExtend="ExtendItems"
							>
							</table-module>
		        		</div>
		        		
					</Card>
		        	
		        </Col>
		        
		    </Row>
			
		</Card>
		
		
		<Card style="padding:16px;margin-top:16px;text-align: center;">
			<Button type="primary" @click="submit('formInstance')">提交生产单</Button>
		</Card>
		
	</div>
	
</template>

<script>
	
import tableModule from '@/components/table-module.vue';

export default {
	components:{//模板
		tableModule,
	},
    data () {//数据
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
        			title: '物品其它信息',
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
        	],
        	
        	purchaseGoods:{//需要购买的物品列表
        		data: []
        	},
        	
        	formRules: [
                { required: true, message: '必须输入任务数量', trigger: 'blur' }
            ],
            
            formData: {
            	name:'',
            },
            
            formRules1: {
            
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                
            },
            
            linkList:[],//环节列表
            
            stepId: '',//环节id
            
            configurationList: [],//配置列表
        	
        }
    },
    methods: {//方法
    	selectAlter(data){//勾选发生改变时
    		this.purchaseGoods.data = data;
    	},
    	submit(name){//提交
    		
    		this.$refs['formInstance1'].validate((valid) => {
    			
    			if (valid) {
    				
    				if(this.configurationList.length > 0){
    					
    					let info = {
    						name: this.formData.name,
    						pid_tree_title: 43,
    						pid_tree_class: 9,
    					}
    					
    					this.$axios.post('orders/produce_add', {
			    			data: JSON.stringify(this.configurationList),
			    			info: JSON.stringify(info),
						})
						.then(response => {
							this.$Message.success('提交成功!');							
						})
						.catch(function (error) {
							console.log(error);
						});
    					
    				}else{
    					this.$Message.info('没有任何配置!');
    				}
    				
    			}else{
    				this.$Message.error('请完善信息!');
    			}
    			
	    	})
    		
    	},
    	getLink(){//获取生产环节
    		
    		this.$axios.post('orders/produce_process', {
    			pid_tree_class: 18
			})
			.then(response => {
				
				response.data.forEach(item => {
					
					this.linkList.push({
						label: item.name,
						value: item.id,
						status: 'wait',
						icon: 'ios-information-outline',
						content: '未配置'
					});
					
				});
				
				if(this.linkList.length > 0){
					this.stepId = this.linkList[0].value;
				}
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	finish(name){//完成配置
    		
    		this.$refs[name].validate((valid) => {
	    		
                if (valid) {
                	
                	let itemSettings = [];
                	
                	this.purchaseGoods.data.forEach(item => {
                		
                		if(item._checked){
                			
                			itemSettings.push([
                				Number(item.id),
                				Number(item.number)
                			]);
                			
                		}
                		
                	});
                	
                	let configuration = {
                		id:"",
	                	step_pid_tree_title: this.stepId,
	                	item_settings: JSON.stringify(itemSettings),
	                	delete: "false"
                	}
                	
                	if(this.configurationList.length > 0){
                		
                		let io = true;
                		
                		this.configurationList.forEach((item,index,arr) => {
                			
                			if(item.step_pid_tree_title == this.stepId){
                				
                				io = false;
                				arr.splice(index,1,configuration);
                				
                			}else{
                				
                			}
                			
                		});
                		
                		if(io){
                			this.configurationList.push(configuration);
                		}
                		
                	}else{
                		
                		this.configurationList.push(configuration);
                		
                	}
                	
                	this.linkList.forEach(item => {
                		
                		if(item.value == this.stepId){
                			
                			item.status = 'finish';
                			
                			item.icon = 'ios-checkmark-outline';
                			
                			item.content = '已配置';
                			
                			this.$Message.success('成功配置了 '+item.label+' 环节');
                			
                		}
                		
                	});
                	
                	console.log(this.configurationList);
                	
                }
                
			})
    		
    	},
    },
    computed:{//计算属性
        
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	this.getLink();//获取生产环节
	},
    watch:{//监测数据变化
    	
	}
}
</script>

<style scoped>
</style>