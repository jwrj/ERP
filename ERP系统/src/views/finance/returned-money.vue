<template>
	
	<div>
		
		<form-view
			ref="formViewInstance"
			v-show="false"
			:form-view-id="rowId"
			@elseFormId="getFormId"
			:showUrl="rowUrl">
		</form-view>
		
		<div>
				
			<Card>
				
				<div slot="title" style="display:flex;align-items: center;">
					
					<h2 slot="title">回款记录列表</h2>
					
					<span style="font-size: 12px;margin-right:10px;margin-left:auto;">添加记录</span>
					
					<Button type="dashed" size="small" shape="circle" icon="plus-round" @click="modal = true"></Button>
						
				</div>
				
				<div style="padding:16px;">
					
					<Table border :columns="recordColu" :data="recordData"></Table>
					
				</div>
			
			</Card>
			
			<Row :gutter="16" type="flex" style="margin-top:16px;">
				
		        <Col span="7">
		        	
		        	<Card style="height: 100%;">
					
						<h2 slot="title">回款统计</h2>
						
						<div style="padding:16px;">
							
							<h2 style="padding:2px 0;">
								订单总货款：<span style="color:#ed3f14;">{{sumPrice.toFixed(2)}}</span>
								元
							</h2>
							
							<h2 style="padding:2px 0;">
								实收总货款：<span style="color:#ed3f14;">{{receivedMoney.toFixed(2)}}</span>
								元
							</h2>
							
							<h2 style="padding:2px 0;">
								欠款总金额：<span style="color:#ed3f14;">{{floatAdd(sumPrice,receivedMoney).toFixed(2)}}</span>
								元
							</h2>
							
						</div>
						
					</Card>
		        	
		        </Col>
		        
		        <Col span="17">
		        	
		        	<Card style="height: 100%;">
					
						<h2 slot="title">自定义内容</h2>
						
						<form-mod v-if="formID" :readOnly="true" :form-data="formDataList"></form-mod>
						
					</Card>
		        	
		        </Col>
				
			</Row>
			
			<Card style="margin-top:16px;" class="no-print">
				
				<h2 slot="title">自定义（编辑）</h2>
				
				<form-mod ref="modInstance" @increment="formEvent" :pid="Number(formID)" :form-data="formDataList"></form-mod>
				
				<div style="text-align: center;padding:16px 0;">
					<Button type="primary" @click="submitForm">{{formID ? '修改' : '提交'}}</Button>
				</div>
				
			</Card>
				
		</div>
		
		<Modal
	        v-model="modal"
	        width="400"
	        title="添加回款纪录"
	    >
	        <div>
	        	<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
	        		
			        <FormItem label="实收货款(元)" prop="money">
			            <Input type="text" style="width: 160px" v-model="formInline.money" placeholder="输入金额"></Input>
			        </FormItem>
			        
			        <FormItem label="日期" prop="date">
			            <DatePicker type="date" placeholder="选择日期" @on-change="seleDate" :value="formInline.date" style="width: 160px"></DatePicker>
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

import formMod from '@/components/form.vue';

export default {
	components:{//模板
		formView,
		formMod,
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
        	
        	sumPrice:0,//订单总货款
        	
        	receivedMoney: 0,//实总收货款
        	
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
           
           formDatas:[],//提交的表单数据
           
           formDataList:[],//表单数据列表
           
           formID: '',//表单ID
           
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
		floatAdd(arg1,arg2){//解决减法精度问题
    		let r1,r2,m;
		    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
		    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
		    m=Math.pow(10,Math.max(r1,r2));
		    return (arg1*m-arg2*m)/m;
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
				
				if(this.recordData.length > 0){
					
					this.receivedMoney = Number(this.recordData[0].number);
				
					function floatAdd(arg1,arg2){//解决精度问题
					     var r1,r2,m;    
					     try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
					     try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
					     m=Math.pow(10,Math.max(r1,r2));
					     return (arg1*m+arg2*m)/m;
					}
				
					this.recordData.forEach((item,index,arr) => {
						if(index > 0){
							this.receivedMoney = floatAdd(this.receivedMoney,Number(arr[index].number));
						}
					});
					
				}
				
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	getFormShow(id){//读取表单详情
    		
    		this.$axios.post('system/showFormFields', {
    			id: id,
			})
			.then(response => {
				
				this.formID = response.data.info.id;
				
				this.formDataList = response.data.fields;
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	getFormId(id){//侦听获取其他表单ID
    		
    		if(id){
    			this.getFormShow(id);//读取表单详情
    		}
    		
    	},
    	formEvent(){//数据改变时
        	this.formDatas = this.$refs.modInstance.formDynamic.data;
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
    	},
    	submitForm(){//提交表单
    		
    		this.$axios.post('system/addFormToDataPage', {
    			update_form_id: this.formID,
    			fields: JSON.stringify(this.formDatas),
    			for_page_data_id: this.rowId,
    			title: '回款备注表单',
    			pid: 0,
			})
			.then(response => {
				if(response.code == 1){
					if(!this.formID){
						this.getFormShow(response.data.updateData.dataFormTable_id2);//获取其他表单ID
					}
					this.$Message.success('提交成功');
				}
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	
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