<template>
	
	<div>
		
		<form-view
			ref="formViewInstance"
			v-show="false"
			:form-view-id = "rowId"
			:showUrl="rowUrl">
		</form-view>
		
		<Card>
				
			<div slot="title" style="display:flex;justify-content:space-between;align-items: center;">
				
				<h2>回款记录表</h2>
				
				<Tooltip content="添加回款记录" placement="left">
					<Button type="dashed" size="small" shape="circle" icon="plus-round" @click="modal = true"></Button>
		        </Tooltip>
					
			</div>
			
			<div style="padding:16px;">
				
				<h2 style="padding:10px;margin-bottom:-1px;border:1px solid #dddee1;">
					订单总货款：<span style="color:#ed3f14;">{{sumPrice.toFixed(2)}}</span>
					元
				</h2>
				
				<Table border :columns="recordColu" :data="recordData"></Table>
				
			</div>
			
		</Card>
		
		<Modal
	        v-model="modal"
	        title="添加回款纪录"
	    >
	        <div>
	        	<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
	        		
			        <FormItem label="实收货款(元)" prop="money">
			            <Input type="text" v-model="formInline.money" placeholder="输入金额"></Input>
			        </FormItem>
			        
			        <FormItem label="日期" prop="date">
			            <DatePicker type="date" placeholder="选择日期" @on-change="seleDate" :value="formInline.date" style="width: 200px"></DatePicker>
			        </FormItem>
			        
			    </Form>
	        </div>
	        <div slot="footer">
	            <Button type="ghost" @click="modal = false">取消</Button>
	            <Button type="primary" @click="addRecord">确定</Button>
	        </div>
	    </Modal>
		
	</div>
	
	
</template>

<script>

const editButton = (_this,h,currentRowData,params) => {//编辑按钮
	
	let children = [];
	
	const confirm = h('Button',{//确定
		props: {
			type:'ghost',
			shape:'circle',
			icon:!currentRowData.editting ? 'edit' : 'checkmark-round',
		},
		style:{
			color:!currentRowData.editting ? '#2d8cf0' : '#19be6b',
		},
		on:{
			click: () => {
				if(!currentRowData.editting){//编辑
				
					currentRowData.editting = true;
					
					_this.recordData = JSON.parse(JSON.stringify(_this.recordData));
					
				}else{//保存
					
					currentRowData.editting = false;
					
					if(currentRowData.number != params.row.number){
						
						let data = [{id:params.row.id,number:params.row.number,delete:"false"}];
						
						_this.$axios.post('system/data_saveAll', {
							data: JSON.stringify(data),
							DBname: 'ExtendRepayment',
						})
						.then(response => {
							_this.returnedMoneyList(_this.rowId);//回款列表
						})
						.catch(function (error) {
							console.log(error);
						});
						
					}
					
					_this.recordData = JSON.parse(JSON.stringify(_this.recordData));
					
				}
			}
		}
	});
	
	const cancel = h('Button',{//取消
		props: {
			type:'ghost',
			shape:'circle',
			icon:'close-round',
		},
		style:{
			color:'#ed3f14'
		},
		on:{
			click: () => {
				currentRowData.editting = false;
			}
		}
	});
	
	if(!currentRowData.editting){
		children.push(confirm);
	}else{
		children.push(confirm,cancel);
	}
	
	return h('ButtonGroup',{
		props: {
			shape:'circle',
		}
	},children);
	
}

const delButton = (_this,h,params) => {//删除按钮
	return h('Button',{
		props: {
			type:'ghost',
			shape:'circle',
			icon:'trash-a',
		},
		style:{
			marginLeft:'5px',
			color:'#ed3f14'
		},
		on:{
			click: () => {
				
				let data = [{id:params.row.id,delete:"true"}];
				
				_this.$axios.post('system/data_saveAll', {
					data: JSON.stringify(data),
					DBname: 'ExtendRepayment',
				})
				.then(response => {
					_this.returnedMoneyList(_this.rowId);//回款列表
				})
				.catch(function (error) {
					console.log(error);
				});
				
			}
		}
	});
}

import formView from '@/components/form-view.vue';

export default {
	components:{//模板
		formView,
	},
	props:{
		
		rowId: {
			type: Number
		},
		
		rowUrl: {
			type: String
		},
		
	},
    data () {//数据
        return {
        	
        	sumPrice:0,
        	
        	recordColu: [
        		{
        			align:'center',
        			width:100,
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			title: '实收货款(元)',
        			key: 'number',
        			editable: true,
        		},
        		{
        			title: '日期',
                    key: 'create_time',
        		},
        		{
                	title: '操作',
                	align:'center',
                	width:150,
                	handle:['edit', 'delete'],
                },
        	],
        	
        	recordData: [],
        	
        	modal: false,
        	
        	formInline: {
        		money: '',
        		date: '',
        	},
        	
        	ruleInline: {
                money: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ],
                date: [
                    { required: true, message: '选择日期', trigger: 'change' }
                ],
           },
        	
        }
    },
    methods: {//方法
    	init(){//初始化
			
			let _this = this;
			
			this.recordColu.forEach(item => {//初始化表格内容
				
				if(item.editable){//编辑字段
    				item.render = (h, params) => {
    					
    					let current = _this.recordData.filter((item) => {return item.id === params.row.id;});
    					let currentRow = current[0];
    					
    					if(!currentRow.editting){//隐藏文本输入框
    						
    						return h('span',currentRow[item.key]);
    						
    					}else{//显示文本输入框
    						return h('Input', {
                                props: {
                                    type: 'text',
                                    value: currentRow[item.key],
                                    placeholder:'请输入'+item.title
                                },
                                on: {
                                    'on-change' (event) {
                                    	params.row[item.key] = event.target.value;
                                    }
                                }
                            });
    					}
    					
    				}
    			}
				
				if(item.handle){//添加操作按钮
					item.render = (h, params) => {
						
						let current = _this.recordData.filter((item) => {return item.id === params.row.id;});
    					let currentRowData = current[0];
    					
						let children = [];
	    				
	    				item.handle.forEach(item => {
		    				if(item === 'edit'){//编辑按钮
		    					
		    					children.push(editButton(this,h,currentRowData,params));
		    					
		    				}else if(item === 'delete'){//删除按钮
		    					
		    					children.push(delButton(this,h,params));
		    					
		    				}
		    			});
		    			
                		return h('div',children);
                	}
	    		}
				
			})
		},
    	seleDate(val){
    		this.formInline.date = val;
    	},
    	returnedMoneyList(orderId){//回款列表
    		
    		let where = {"order_id":["=",orderId]};
    		
    		this.$axios.post('system/page_list', {
    			where: JSON.stringify(where),
    			page: 1,
    			pageSize: 20000,
    			order: '{"id":"asc"}',
    			DBname_dataPage: 'ExtendRepayment',
			})
			.then(response => {
				this.recordData = response.data.dataList.data;
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	addRecord(){//添加纪录
    		this.$refs['formInline'].validate((valid) => {
				
                if (valid) {
                	
                	let data = {
                		order_id: this.rowId,
                		number: this.formInline.money,
                	}
                	
                	this.$axios.post('financial/repayment_add', {
                		data: JSON.stringify(data),
                		info: '{"name":"回款记录","pid_tree_title":"29"}',
					})
					.then(response => {
						if(response.code == 1){
							this.returnedMoneyList(this.rowId);//回款列表
							this.modal = false;
							this.$Message.success('记录添加成功！');
						}
					})
					.catch(function (error) {
						console.log(error);
					});
                	
                }
                
            });
    	}
    	
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	this.init();//初始化
	},
    mounted(){//模板被渲染完毕之后执行
    	
    	this.returnedMoneyList(this.rowId);//回款列表
    	
    	clearInterval(time);
		let time = setInterval(() => {
			if(this.$refs.formViewInstance){
				if(this.$refs.formViewInstance.sumPrice.length > 0){
					this.sumPrice = this.$refs.formViewInstance.sumPrice[0];
					clearInterval(time);
				}
			}else{
				clearInterval(time);
			}
		},10);
    	
	},
    watch:{//监测数据变化
    	
	}
}
</script>

<style scoped>
</style>