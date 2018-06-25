<template>
	
	<div>
		
		<Card>
			
			<h1 slot="title">入库记录</h1>
			
			<div style="border-bottom:1px solid #dddee1;padding:16px 0 0 16px;">
				
				<Form ref="formInstance1" :rules="formRules1" :model="formData" :label-width="94">
					
					<FormItem label="入库方式" prop="way">
			            <Select v-model="formData.way" @on-change="selectChange" style="width:200px">
					        <Option v-for="item in storageWayList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
			        </FormItem>
			        
					<FormItem label="选择客户" prop="client" v-if="clientShow">
			            <Select v-model="formData.client" filterable style="width:200px">
					        <Option v-for="item in clientList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
			        </FormItem>
			        
					<FormItem label="入库记录名称" prop="name">
			            <Input v-model="formData.name" clearable placeholder="输入名称..." style="width:160px;"></Input>
			        </FormItem>
			        
		        </Form>
		        
			</div>
			
			<div v-if="procurementList.length > 0" style="padding:16px;border-bottom:1px solid #dddee1;">
				
				<h2 style="padding:0 0 10px;">点击要入库的采购单</h2>
				
				<Table :highlight-row="true" border :columns="pColumns" :data="procurementList" @on-current-change="onCurrentChange"></Table>
				
				<div style="display: flex;margin-top:10px;">
					<div style="margin-left:auto;">
						<Page :total="total" show-total :page-size="pageSize" @on-change="pageChange"></Page>
					</div>
				</div>
				
			</div>
			
			<div style="padding:16px;">
				
	        	<Card>
	        		
	        		<div slot="title" style="display:flex;justify-content: space-between;align-items: center;">
	        			<h2>需要入库的物品列表</h2>
	        			<Button type="primary" size="small" @click="modalShow = true" v-show="cpmBtn">打开物品列表</Button>
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
			<Button type="primary" @click="submit('formInstance')">提交入库记录</Button>
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
        			width:160,
        			title: '入库数量',
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
        	
        	pColumns: [//采购表头
        		{
        			align: 'center',
        			width: 80,
                    title: 'ID',
                    key: 'id',
                },
        		{
                    title: '采购名称',
                    key: 'name',
                },
        		{
                    title: '日期',
                    key: 'create_time',
                },
        	],
        	
        	procurementList: [],//采购列表
        	
        	storageWayList: [],//入库类型列表
        	
        	clientList: [],//客户列表
        	
        	clientShow: false,
        	
        	purchaseGoods:{//需要购买的物品列表
        		data: []
        	},
        	
        	formRules2: [
                { required: true, message: '必须输入入库数量', trigger: 'blur' }
            ],
            
            formData: {
            	way: '',
            	name: '',
            	client: '',
            },
            
            formRules1: {
            
	            way: [
                    { type: 'number', required: true, message: '请选择方式', trigger: 'change' }
                ],
                
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                
                client: [
                    { type: 'number', required: true, message: '请选择客户', trigger: 'change' }
                ],
                
            },
            
            total: 0,
            pageSize:0,
            
            //=====================
            modalShow: false,//弹窗显示开关
            
            cpmBtn: false,
            
        }
    },
    methods: {//方法
    	
    	getTypeList(){//获取类型列表
    		
    		this.$axios.post('items/warehousing_into', {
    			type_pid_tree_class: 19,
			})
			.then(response => {
				
				response.data.select_list.forEach(item => {
					
					this.storageWayList.push({
						label: item.name,
						value: item.id,
					});
					
				});
				
				if(this.storageWayList.length > 0){
					this.formData.way = this.storageWayList[0].value;
				}
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	
    	selectChange(val){//选择类型
    		
    		if(val == 16){
    			
    			this.cpmBtn = false;
    			
    			this.clientShow = false;
    			
    			this.formData.client = '';
    			
    			this.getProcurementList();//采购列表
    			
    		}else{
    			
    			if(val == 19){
    				
    				this.clientShow = true;
    				
    				this.$axios.post('oa/customer_list', {
        				where: '{"pid_tree_title":["=","2"]}',
		    			order: '{"id":"desc"}',
		    			page: 1,
		    			pageSize: 99999,
					})
					.then(response => {
						
						let arr = [];
						
						response.data.dataList.data.forEach(item => {
							
							arr.push({
								label: item.name,
								value: item.id,
							});
							
						})
						
						this.clientList = arr;
						
						if(this.clientList.length > 0){
							this.formData.client = this.clientList[0].value;
						}
						
					})
					.catch(function (error) {
						console.log(error);
					});
    				
    			}else{
    				this.clientShow = false;
    				this.formData.client = '';
    			}
    			
    			this.cpmBtn = true;
    			
    			this.$refs.tabInstance.whereId = [];
    			
    			this.procurementList = [];
    			
    		}
    		
    		this.purchaseGoods.data = [];
			
			this.$refs.tabInstance.submitSucceed();//提交成功后勾选功能数据还原
    		
    	},
    	
    	getProcurementList(page = 1){//采购列表
    		
    		this.$axios.post('items/purchase_list', {
    			
    			where: '{"pid_tree_title":["=","6"]}',
    			order: '{"id":"asc"}',
    			page: page,
    			pageSize: 5,
    			
			})
			.then(response => {
				
				this.procurementList = response.data.dataList.data;
				
				this.total = response.data.dataList.total;
				this.pageSize = Number(response.data.dataList.per_page);
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	
    	pageChange(page){//页码改变
    		this.getProcurementList(page);//采购列表
    	},
    	
    	onCurrentChange(currentRow){//单击某一行时触发
    		
    		this.cpmBtn = true;
    		
    		this.modalShow = true;
    		
    		let arr = ["or"];
    		
    		currentRow.extend_data.forEach(item => {
    			
    			arr.unshift(["=",item.item_id]);
    			
    		});
    		
    		this.$refs.tabInstance.whereId = arr;
    		
    		this.purchaseGoods.data = [];
						    		
			this.$refs.tabInstance.submitSucceed();//提交成功后勾选功能数据还原
    		
    	},
    	
    	//=======================================================
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
    								
    								pid_tree_title: 8,
    								
    								pid_tree_class: 10,
    								
    							}
			                	
			                	let data = [];//购买的物品列表
			                	
			                	this.purchaseGoods.data.forEach(item => {
			                		
			                		if(item._checked){
			                			
				                		data.push({
				                			
				                			item_id: item.id,//物品ID
				                			
				                			type_pid_tree_title: this.formData.way,//入库形式
				                			
				                			action_type: 1,//2出库/1入库
				                			
		    								number: item.inputNumber,//数量
		    								
		    								action_time: '',//日期
		    								
		    								for_user_id: this.formData.client ? this.formData.client : null,//客户
		    								
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
						    		
									this.$Message.success('入库成功!');
									
								})
								.catch(function (error) {
									console.log(error);
								});
			                	
			                    
			                } else {
			                	
			                    this.$Message.error('请输入入库数量!');
			                    
			                }
			                
			            })				
    					
    				}else{
    					this.$Message.info('没有要入库的物品!');
    				}
    				
    			}else{
    				this.$Message.error('请输入入库记录名称!');
    			}
    			
	    	})
    		
    	},
    },
    computed:{//计算属性
        
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	this.getTypeList();//获取类型列表
	},
    watch:{//监测数据变化
    	
	}
}
</script>

<style scoped>
</style>