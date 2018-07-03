<template>
	
	<div>
		
		<Card>
			
			<h1 slot="title">领料</h1>
			
			<div style="border-bottom:1px solid #dddee1;padding:16px 0 0 16px;">
				
				<Form ref="formInstance1" :rules="formRules1" :model="formData" :label-width="94">
					
			        <FormItem label="领料单名称" prop="name">
			            <Input v-model="formData.name" clearable placeholder="输入名称..." style="width:160px;"></Input>
			        </FormItem>
			        
		        </Form>
		        
			</div>
			
			<div style="padding:16px;">
				
	        	<Card>
	        		
	        		<div slot="title" style="display:flex;justify-content: space-between;align-items: center;">
	        			<h2>需要入库的物品列表</h2>
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
		
		<Card style="padding:16px;margin-top:16px;text-align: center;">
			<Button type="primary" @click="submit('formInstance')">提交出库记录</Button>
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
        	
        	goodsColumns: [//物品表头
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
        			width:120,
        			title: '库存数',
                    render: (h, params) => {
						return h('span',params.row.extend_data[0].number)
                    }
        		},
        		{
        			width:160,
        			title: '领料数量',
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
									clearable: true,
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
        	
        	pColumns: [
        		{
        			align: 'center',
        			width: 80,
                    title: 'ID',
                    key: 'id',
                },
        		{
                    title: '订单名称',
                    key: 'name',
                },
        		{
                    title: '日期',
                    key: 'create_time',
                },
        	],
        	
        	purchaseGoods:{//需要购买的物品列表
        		data: []
        	},
        	
        	formRules2: [
                { required: true, message: '必须输入出库数量', trigger: 'blur' }
            ],
            
            formData: {
            	name: '',
            },
            
            formRules1: {
            
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                
            },
            
            //=====================
            modalShow: false,//弹窗显示开关
            
        }
    },
    methods: {//方法
    	
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
    	submit(name){//提交
    		
    		this.$refs['formInstance1'].validate((valid) => {
    			
    			if (valid) {
    				
    				let tf = false;
    				
    				this.purchaseGoods.data.forEach(item => {
    					if(item._checked){
    						tf = true;
    					}
    				});
    				
    				if(this.purchaseGoods.data.length > 0 && tf){//有购买物品
    					
						this.$refs[name].validate((valid) => {
	    			
			                if (valid) {
			                	
			                	let info = {//采购订单信息
			                		
    								name: this.formData.name,
    								
    								pid_tree_title: 32,
    								
    								pid_tree_class: 10,
    								
    							}
			                	
			                	let data = [];//购买的物品列表
			                	
			                	this.purchaseGoods.data.forEach(item => {
			                		
			                		if(item._checked){
			                			
				                		data.push({
				                			
				                			item_id: item.id,//物品ID
				                			
				                			type_pid_tree_title: 22,//出库形式
				                			
				                			action_type: 2,//2出库/1出库
				                			
		    								number: item.inputNumber,//数量
		    								
		    								action_time: '',//日期
		    								
		    								desc: '',//描述
		    								
				                		});
			                			
			                		}
			                		
			                	});
			                	
			                	this.$axios.post('items/warehousing_add', {
    								data: JSON.stringify(data),
    								info: JSON.stringify(info),
								})
								.then(response => {
									
									this.formData.name = '';
									
						    		this.purchaseGoods.data = [];
						    		
						    		this.$refs.tabInstance.submitSucceed();//提交成功后勾选功能数据还原
									
									this.$Message.success('领料成功!');
									
								})
								.catch(function (error) {
									console.log(error);
								});
			                	
			                    
			                } else {
			                	
			                    this.$Message.error('请输入领料数量!');
			                    
			                }
			                
			            })				
    					
    				}else{
    					this.$Message.info('没有要领料的物品!');
    				}
    				
    			}else{
    				this.$Message.error('请输入领料单名称!');
    			}
    			
	    	})
    		
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