<template>
	
	<div>
		
		<Card>
			
			<h1 slot="title">订单发货</h1>
			
			<div style="border-bottom:1px solid #dddee1;padding:16px 0 0 16px;">
				
				<Form ref="formInstance1" :rules="formRules1" :model="formData" :label-width="94">
					
			        <FormItem label="发货单名称" prop="name">
			            <Input v-model="formData.name" clearable placeholder="输入名称..." style="width:160px;"></Input>
			        </FormItem>
			        
		        </Form>
		        
			</div>
			
			<div v-if="procurementList.length > 0" style="padding:16px;border-bottom:1px solid #dddee1;">
				
				<h2 style="padding:0 0 10px;">点击要发货的订单</h2>
				
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
		    			<h2>需要发货的物品列表</h2>
		    			<Button type="primary" size="small" @click="modalShow = true" v-show="cpmBtn">打开物品列表</Button>
		    		</div>
		    		
		    		<div style="padding:16px;">
		    			<Form class="tableFormInstance" ref="formInstance" :model="purchaseGoods" :show-message="false">
		    				<Table border :columns="goodsColumns" :data="purchaseGoods.data"></Table>
		    			</Form>
		    		</div>
		    		
				</Card>
				
			</div>
			
			<div style="padding:16px;text-align: center;">
				<Button type="primary" @click="submit('formInstance')">提交发货单</Button>
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
        	
        	//============物品列表数据===============
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
        	],
        	
        	//=================已选物品列表数据====================
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
        			title: '总库存',
                    render: (h, params) => {
						return h('span',params.row.extend_data[0].number)
                    }
        		},
        		{
        			align:'center',
        			width:120,
        			title: '需求数量',
                    key: 'demandNumber',
        		},
        		{
        			width:160,
        			title: '发货数量',
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
        			align:'center',
        			width:80,
        			title: '状态',
                    render: (h, params) => {
                    	console.log(params.row.pid_status);
                    	if(params.row.pid_status == 9){
                    		return h('span',{
                    			style: {
                    				color: '#bbbec4',
                    			}
                    		},'未发货');
                    	}
                    	if(params.row.pid_status == 10){
                    		return h('span',{
                    			style: {
                    				color: '#19be6b',
                    			}
                    		},'已发货');
                    	}
                    	
                    }
        		},
        		{
                    title: '日期',
                    key: 'create_time',
                },
        	],
        	
        	orderID: '',//订单ID
        	
        	demandNumber: [],//订单物品详情数据
        	
        	procurementList: [],//采购列表
        	
        	dataFormTableIds: '',//用到的表单
        	
        	useDataPageIdArr: '',//其他页面数据
        	
        	purchaseGoods:{//需要购买的物品列表
        		data: []
        	},
        	
        	formRules2: [
                { required: true, message: '必须输入发货数量', trigger: 'blur' }
            ],
            
            formData: {
            	name: '',
            },
            
            formRules1: {
            
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
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
    	
    	//=====================================================
    	
    	selectChange(val){//选择类型
    		
    		if(val == 1){
    			
    			this.cpmBtn = false;
    			
    			
    			
    		}else{
    			
    			this.cpmBtn = true;
    			
    			this.$refs.tabInstance.whereId = [];
    			
    			this.procurementList = [];
    			
    		}
    		
    		this.demandNumber = [];
    		
    		this.purchaseGoods.data = [];
						    		
    		this.$refs.tabInstance.submitSucceed();//提交成功后勾选功能数据还原
    		
    	},
    	
    	getProcurementList(page = 1){//获取订单列表
    		
    		this.$axios.post('system/page_list', {
    			
    			where: '{"pid_tree_title":["=","22"]}',
    			order:'{"id":"desc"}',
    			DBname_extend: 'ExtendOrder',
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
    		this.getProcurementList(page);//订单列表
    	},
    	
    	onCurrentChange(currentRow){//单击某一行时触发
    		
    		this.orderID = currentRow.id;//订单ID
    		
    		this.dataFormTableIds = currentRow.dataFormTable_ids;//用到的表单集合
    		
    		this.useDataPageIdArr = currentRow.use_dataPage_ids;//其他页面数据集合
    		
    		this.modalShow = true;
    		
    		this.cpmBtn = true;
    		
    		let arr = ["or"];
    		
    		this.demandNumber = currentRow.extend_data;//订单物品详情数据
    		
    		currentRow.extend_data.forEach(item => {
    			
    			arr.unshift(["=",item.item_id]);
    			
    		});
    		
    		this.purchaseGoods.data = [];
    		
    		this.$refs.tabInstance.whereId = arr;
    		
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
    		
    		arr.forEach(item => {
    			item.demandNumber = '- -';
    			this.demandNumber.forEach(item2 => {
    				if(item.id == item2.item_id){
    					item.demandNumber = item2.number;
    				}
    			})
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
    								
    								pid_tree_title: 53,
    								
    								pid_tree_class: 10,
    								
    								dataFormTable_ids: this.dataFormTableIds ? this.dataFormTableIds : null,
    								
    								use_dataPage_ids: this.useDataPageIdArr ? this.useDataPageIdArr : null,
    								
    							}
			                	
			                	let data = [];//购买的物品列表
			                	
			                	this.purchaseGoods.data.forEach(item => {
			                		
			                		if(item._checked){
			                			
				                		data.push({
				                			
				                			item_id: item.id,//物品ID
				                			
				                			type_pid_tree_title: 23,//出库形式
				                			
				                			action_type: 2,//2出库/1入库
				                			
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
									
									this.demandNumber = [];
									
						    		this.purchaseGoods.data = [];
						    		
						    		this.$refs.tabInstance.submitSucceed();//提交成功后勾选功能数据还原
						    		
						    		let info = {
						    			id: this.orderID,
						    			pid_status:10,
						    		};
						    		
						    		this.$axios.post('system/page_edit', {//修改订单状态
    									info: JSON.stringify(info),
									})
									.then(response => {
										this.getProcurementList(1);//订单列表
									})
									.catch(function (error) {
										console.log(error);
									});
									
									this.$Message.success('发货成功!');
									
								})
								.catch(function (error) {
									console.log(error);
								});
			                	
			                    
			                } else {
			                	
			                    this.$Message.error('请输入发货数量!');
			                    
			                }
			                
			            })				
    					
    				}else{
    					this.$Message.info('没有要发货的物品!');
    				}
    				
    			}else{
    				this.$Message.error('请完善信息!');
    			}
    			
	    	})
    		
    	},
    },
    computed:{//计算属性
        
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	
    	this.getProcurementList();//获取订单列表
    	
	},
    watch:{//监测数据变化
    	
	}
}
</script>

<style scoped>
</style>