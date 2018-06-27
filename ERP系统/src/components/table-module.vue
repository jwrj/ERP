<!--万能列表组件-->
<template>
	
	<div style="background:#fff;position: relative;" ref="tabInstance">
		
		<Spin fix v-show="loads.tabLoading"></Spin>
		
		<div v-if="screenTop" style="display:flex;margin-bottom:10px;">
			<!--日期-->
			<DatePicker v-if="dateScreen" :value="screenVal.date" @on-change="formattedDate" type="daterange" placeholder="选择时间" style="margin-right:10px;"></DatePicker>
			<!--状态下拉列表-->
		    <Select v-if="cityList.length > 1" :value="screenVal.orderStatus" @on-change="dropSele" style="width:200px;margin-right:10px;">
		        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
			<!--客户下拉列表-->
		    <Select v-if="clientSelect" :value="screenVal.client" @on-change="clientChange" placeholder="选择客户" style="width:200px;margin-right:10px;">
		        <Option v-for="item in clientList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
		    <!--搜索框-->
			<Input class="seekBox" v-if="searchBox" @on-click="seekBut" @on-enter="seekBut" v-model="screenVal.seekTxtVal" placeholder="搜索名称" icon="ios-search" style="width:300px;margin-left:auto;"></Input>
			<Button v-show="screenVal.seekTxtVal != ''" style="margin-left:2px;" type="ghost" @click="emptyBut" size="small" icon="close-round"></Button>
		</div>
		
		<!--表格-->
		<Table
			:columns="columnsList"
			:data="tabDataList"
			
			highlight-row
			border
			class="table-box tableZKPadd"
			
			@on-select="onSelect"
			@on-select-cancel="onSelectCancel"
			@on-select-all="onSelectAll"
			@on-selection-change="onSelectionChange"
		>
		</Table>
		<!--表格-->
		
		<div v-if="BottomBar" style="display:flex;margin-top:10px;">
			
			<div style="display:flex;align-items:center;margin-right:10px;">
				
				<p v-if="checkNumber">
					已选
					<span style="color:#ed3f14;">{{selectedNum}}</span>
					条
				</p>
				
			</div>
			
			<!--分页-->
			<div style="margin-left:auto;">
				<Page
					v-if="pagingBox"
					ref="page"
					placement="top"
					:total="pageNumInfo.total"
					:current="pageNumInfo.currentPage"
					show-total
					show-elevator
					show-sizer
					@on-change="changePage"
					@on-page-size-change="pageSize"
				>
				<!--size="small"设置为迷你分页-->
				</Page>
			</div>
			<!--分页-->
			
		</div>
		
		<!--弹窗-->
		<cpm-mod
			ref="cpmModInstance"
			direction="defau"
			:titleName="titleName"
    		width="80%"
    		:butName="{io:false}"
    		:confirmBut="confirmBut"
    		:module-type="componentType"
    		@upPageData="upPage"
    	>
    	</cpm-mod>
    	<!--弹窗-->
    	
	</div>
	
</template>

<script>

//======================================================================================

const editButton = (_this,h,currentRow,params) => {//编辑按钮(不出现弹窗效果)
		
	let children = [];
	
	const confirm = h('Button',{//确定
		props: {
			type:'ghost',
			shape:'circle',
			icon:!currentRow.editable ? 'edit' : 'checkmark-round',
		},
		style:{
			color:!currentRow.editable ? '#2d8cf0' : '#19be6b',
		},
		on:{
			click: () => {
				if(!currentRow.editable){//编辑
				
					currentRow.editable = true;
					
					_this.tabDataList = JSON.parse(JSON.stringify(_this.tabDataList));
					
				}else{//保存
					
					currentRow.editable = false;
					
					if(currentRow.name !== params.row.name){
						
						currentRow.name = params.row.name;
						
					}
					
					_this.tabDataList = JSON.parse(JSON.stringify(_this.tabDataList));
					
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
				currentRow.editable = false;
			}
		}
	});
	
	if(!currentRow.editable){
		children.push(confirm);
	}else{
		children.push(confirm,cancel);
	}
	
	return h('ButtonGroup',{
		props: {
			shape:'circle',
		},
		style: {
			margin:'2px',
		}
	},children);
	
}

const editButton2 = (_this,h,params) => {//编辑按钮2(出现弹窗效果)

	return h('Tooltip',{
		props: {
			content:'编辑',
			placement:'top',
		},
		style:{
		},
	},[
		h('Button',{
			props: {
				type:'ghost',
				shape:'circle',
				icon:'edit',
			},
			style:{
				margin:'2px',
				color:'#2d8cf0'
			},
			on:{
				click: () => {
					
					console.log('点击了编辑按钮');
					
					_this.titleName = '编辑';//弹窗的标题名称
					
					_this.componentType = _this.componentEditType;//弹窗弹出的组件类型
					
					_this.confirmBut = {io:true,name:'更新页面数据'};//弹窗是否显示更新页面数据按钮
					
					_this.$refs.cpmModInstance.indentId = params.row.id;//当前行的ID
					
					_this.$refs.cpmModInstance.row = params.row;//当前行的数据
					
					_this.$refs.cpmModInstance.viewUrl = _this.showUrl;//详情的url
					
					_this.$refs.cpmModInstance.editUrl = _this.editUrl;//编辑的url
					
					_this.$refs.cpmModInstance.modal = true;//显示弹窗
					
				}
			}
		})
	]);
	
}

const detailsButton = (_this,h,params) => {//详情按钮
	
	return h('Tooltip',{
		props: {
			content:'详情',
			placement:'top',
		},
		style:{
		},
	},[
		h('Button',{
			props: {
				type:'ghost',
				shape:'circle',
				icon:'document-text',
			},
			style:{
				margin:'2px',
				color:'#19be6b'
			},
			on:{
				click: () => {
					
					console.log('点击了详情按钮');
					
					_this.titleName = '详情';//弹窗的标题名称
					
					_this.componentType = _this.componentViewType;//弹窗弹出的组件类型
					
					_this.confirmBut = {io:false};//弹窗是否显示更新页面数据按钮
					
					_this.$refs.cpmModInstance.indentId = params.row.id;//当前行的ID
					
					_this.$refs.cpmModInstance.viewUrl = _this.showUrl;//详情的url
					
					_this.$refs.cpmModInstance.modal = true;//显示弹窗
					
				}
			}
		})
	]);
	
}

const scheduleButton = (_this,h,params) => {//进度（点击会跳转路由的按钮）
	
	return h('Tooltip',{
		props: {
			content:'进度',
			placement:'top',
		},
		style:{
		},
	},[
		h('Button',{
			props: {
				type:'ghost',
				shape:'circle',
				icon:'refresh',
			},
			style:{
				margin:'2px',
				color:'#19be6b'
			},
			on:{
				click: () => {
					
					console.log('点击了进度按钮');
					
					//动态路由
		    		_this.$router.push(
			    		{
			    			name: 'productionFlow_index',
			    			query: {//状态信息
			    				pid_data_page: params.row.id,
			    				name: params.row.name,
			    			},
			    		}
		    		);
					
				}
			}
		})
	]);
	
}

const delButton = (_this,h,params) => {//删除按钮
	
	return h('Poptip',{
		props: {
			confirm:true,
	        title:"您确认删除这条内容吗？",
	        transfer:true,
	        placement:"top-end"
        },
        on:{
        	
			'on-ok'(){
				
				//删除类型
				if(_this.delType == 'ordinaryDel'){//普通操作
					
					_this.ordinaryDel(params.row.id);
					
				}else if(_this.delType == 'allPowerfulDel'){//万能操作
					
					_this.allPowerfulDel(params.row.id);
					
				}
				
			},
			
			'on-cancel'(){
				
			}
			
		}
	},[
		h('Tooltip',{
			props: {
				content:'删除',
				placement:'top',
				transfer:true,
			},
			style:{
			},
		},[
			h('Button',{
				props: {
					type:'ghost',
					shape:'circle',
					icon:'trash-a',
					loading:_this.loads.delLoading,
				},
				style:{
					margin:'2px',
					color:'#ed3f14'
				},
				on:{
					click: () => {
						
					}
				}
			})
		])
	]);
	
}


//======================================================================================

import cpmMod from '@/components/cpm-mod.vue';

export default {
	props:{
		
	 	columnsList:{//表头数据
	 		type: Array,
            required: true,//必需传值
	 	},
	 	//==================================================
	 	pageId:{//树标题(页面)ID（以树标题ID来筛选）
	 		type: Number,
	 	},
	 	
	 	pidTreeClassId:{//树分类ID（以树分类ID来筛选）
	 		type: Number,
	 	},
	 	
	 	stateListId:{//要读取的树标题分类ID（就是下拉要显示的树标题数据）
	 		type: String,
	 		default: '',
	 	},
	 	
	 	seleSeekField: {//下拉筛选的字段名称
	 		type: String,
	 	},
	 	//---------------万能接口------------------------
	 	DBnameShowExtend: {//列出详情数据（不是万能接口的话，目前只有物品列表有这个字段可加）
	 		type: String,
	 	},
	 	
	 	DBnameDataPage: {//万能列表要获取的数据表名称
	 		type: String,
	 	},
	 	
	 	DBname: {//用万能操作接口时的数据表名称
	 		type: String,
	 		default: '',
	 	},
	 	
	 	//======================以下默认的接口都是页面普通接口==================================
	 	
	 	tableDataUrl: {//获取表格数据接口
	 		type: String,
	 		default: 'system/page_list',
	 	},
	 	
	 	showUrl: {//点击详情的接口
	 		type: String,
	 		default: 'system/page_show',
	 	},
	 	
	 	editUrl: {//点击编辑的接口
	 		type: String,
	 		default: 'system/page_edit',
	 	},
	 	
	 	deleUrl: {//点击删除的接口
	 		type: String,
	 		default: 'system/page_delete',
	 	},
	 	
	 	componentViewType: {//详情组件类型
	 		type: String,
	 	},
	 	
	 	componentEditType: {//编辑组件类型
	 		type: String,
	 	},
	 	
	 	delType: {//删除类型
	 		type: String,
	 		default: 'ordinaryDel',
	 	},
	 	
	 	//======================控件开关==================================
	 	
	 	screenTop:{//整个筛选栏
	 		type: Boolean,
	 		default: true,
	 	},
	 	
	 	dateScreen:{//日期控件
	 		type: Boolean,
	 		default: true,
	 	},
	 	
	 	searchBox:{//搜索框控件
	 		type: Boolean,
	 		default: true,
	 	},
	 	
	 	BottomBar: {//整个下边栏
	 		type: Boolean,
	 		default: true,
	 	},
	 	
	 	pagingBox:{//分页控件
	 		type: Boolean,
	 		default: true,
	 	},
	 	
	 	clientSelect:{//客户下拉列表
	 		type: Boolean,
	 		default: false,
	 	},
	 	
	},
	components:{//模板
		cpmMod,
	},
    data () {
        return {
        	
        	whereId: [],//入库传过来的物品id
        	
        	componentType: '',//组件类型
        	
        	titleName:'',//弹窗标题
        	
        	confirmBut:{},//弹窗确定按钮
        	
        	loads:{//加载
        		
        		tabLoading:false,//表格
        		
        		delLoading:false,//删除按钮
        		
        	},
        	
        	tabDataList: [],//表格数据
        	
        	pageNumInfo: {},//页码信息
        	
        	cityList: [],//下拉数据
        	
        	clientList: [],//客户列表
        		
            stateInfo:{//状态信息
            	page:1,
            	pageSize:10,
            },
            
            screenVal:{//筛选
            	date:[],//日期
            	orderStatus:0,//下拉
            	seekTxtVal:'',//搜索框值
            	client: '',//客户ID
            },
            
            checkedData: [],//已选中数据列表
            
            selectedNum: 0,//已选条数
            
        }
    },
    methods:{
    	
    	init(){//初始化
				
			let _this = this;
			
			this.columnsList.forEach(item => {//初始化表格内容
				
				if(item.editable){//要编辑的表格字段(编辑多个字段时用到)
    				item.render = (h, params) => {
    					
    					let current = _this.tabDataList.filter(item => {return item.id === params.row.id;});
    					let currentRow = current[0];
    					
    					if(!currentRow.editable){//隐藏文本输入框
    						
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
				
				if(item.editOnly){//要单独编辑的表格字段(编辑一个字段时用到)
					
					let lText = (h,currentRow,params) => {//左边的文本
						
						if(!currentRow.editable){//隐藏文本输入框
    						
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
						
					};
					
					let rButton = (h,currentRow,params) => {//右边的按钮
						
						let children = [];
	
						const confirm = h('Button',{//确定
							props: {
								type:'text',
								shape:'circle',
								size: 'small',
								icon:!currentRow.editable ? 'edit' : 'checkmark-round',
							},
							style:{
								color:!currentRow.editable ? '#2d8cf0' : '#19be6b',
							},
							on:{
								click: () => {
									
									if(!currentRow.editable){//编辑
										
										this.tabDataList.forEach(item => {
											item.editable = false;
										})
										
										currentRow.editable = true;
										
										_this.tabDataList = JSON.parse(JSON.stringify(_this.tabDataList));
										
									}else{//保存
										
										currentRow.editable = false;
					
										if(currentRow.name !== params.row.name){
											
											currentRow.name = params.row.name;
											
										}
										
										_this.tabDataList = JSON.parse(JSON.stringify(_this.tabDataList));
										
									}
								}
							}
						});
						
						const cancel = h('Button',{//取消
							props: {
								type:'text',
								shape:'circle',
								size: 'small',
								icon:'close-round',
							},
							style:{
								color:'#ed3f14'
							},
							on:{
								click: () => {
									currentRow.editable = false;
								}
							}
						});
						
						//显示按钮类型
						if(!currentRow.editable){
							children.push(confirm);
						}else{
							children.push(confirm,cancel);
						}
						
						return h('ButtonGroup',{
							props: {
								shape:'circle',
								size: 'small',
							},
							style: {
								marginLeft:'10px',
								flexShrink: '0',
							}
						},children);
						
					};
					
					//=============================================================
					
    				item.render = (h, params) => {
    					
    					let current = _this.tabDataList.filter((item) => {return item.id === params.row.id;});
    					let currentRow = current[0];
    					
    					return h('div',{
    						style: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}
    					},[
    						lText(h,currentRow,params),
    						rButton(h,currentRow,params)
    					])
	    					
	    			}
    				
    			}
				
				if(item.handle){//添加操作按钮
					item.render = (h, params) => {
						
						let current = _this.tabDataList.filter((item) => {return item.id === params.row.id;});
    					let currentRow = current[0];
    					
						let children = [];
	    				
	    				item.handle.forEach(item => {
		    				if(item === 'edit'){//编辑按钮
		    					
		    					children.push(editButton(this,h,currentRow,params));
		    					
		    				}else if(item === 'edit2'){//编辑按钮2
		    					
		    					children.push(editButton2(this,h,params));
		    					
		    				}else if(item === 'details'){//详情按钮
		    					
		    					children.push(detailsButton(this,h,params));
		    					
		    				}else if(item === 'schedule'){//进度
		    					
		    					children.push(scheduleButton(this,h,params));
		    					
		    				}else if(item === 'delete'){//删除按钮
		    					
		    					children.push(delButton(this,h,params));
		    					
		    				}
		    			});
		    			
                		return h('div',children);
                	}
	    		}
				
			})
		},
    	
    	//===================================================
    	formattedDate(val){//选择日期
    		
    		this.stateInfo.date = val;
    		
    		this.setRoutePara();//设置路由参数
    		
    	},
    	dropSele(val){//下拉选择
    		
    		this.stateInfo.orderStatus = val;
    		
    		this.setRoutePara();//设置路由参数
    		
    	},
    	clientChange(val){//客户选择
    		
    		this.stateInfo.client = val;
    		
    		this.setRoutePara();//设置路由参数
    		
    	},
    	seekBut(){//搜索按钮
    		
    		this.stateInfo.seek = this.screenVal.seekTxtVal;
    		
    		this.setRoutePara();//设置路由参数
    		
    	},
    	emptyBut(){//搜索清空按钮
    		
    		this.screenVal.seekTxtVal = '';
    		
    		this.stateInfo.seek = this.screenVal.seekTxtVal;
    		
    		this.setRoutePara();//设置路由参数
    		
    	},
    	
    	//=======================================================================
    	
    	onSelect(arr,row){//单选
    		
    		let io = true;
    		
    		this.checkedData.forEach((item,index) => {
    			if(item.id == row.id){
    				io = false;
					item._checked = true;
    			}
    		});
    		
    		if(io){
    			row._checked = true;
    			this.checkedData.push(row);
    		}
    		
    	},
    	onSelectCancel(arr,row){//取消单选
    		
    		this.checkedData.forEach((item,index) => {
    			if(item.id == row.id){
					item._checked = false;
    			}
    		});
    		
    	},
    	onSelectAll(arr){//全选
    		
    		let io = false;
    		
    		let io2 = true;
    		
    		if(this.checkedData.length > 0){
    			
    			arr.forEach(item1 => {
    				
    				this.checkedData.forEach(item2 => {
    					
    					if(item1.id != item2.id){
    						io = false;
    					}else{
    						io = true;
    					}
    					
    					if(io){
    						io2 = false;
    					}
    				
	    			});
	    			
	    			if(io2){
	    				item1._checked = true;
    					this.checkedData.push(item1);
	    			}else{
	    				
	    				let io3 = true;
	    				
	    				this.checkedData.forEach((item3,index,arr) => {
	    					if(item1.id == item3.id){
	    						io3 = false;
	    						item3._checked = true;
	    					}
	    				});
	    				
	    				if(io3){
	    					item1._checked = true;
    						this.checkedData.push(item1);
	    				}
	    				
	    			}
    				
	    		});
	    		
    			
    		}else{
    			
    			arr.forEach(item => {
    				item._checked = true;
    				this.checkedData.push(item);
	    		});
    			
    		}
    		
    	},
    	onSelectionChange(arr){//取消全选||选项发生改变时
    		
    		if(arr.length == 0){
    			
    			this.checkedData.forEach(item1 => {
    				
    				this.tabDataList.forEach(item2 => {
    					
    					if(item1.id == item2.id){
    						item1._checked = false;
    					}
    					
    				});
    				
	    		});
    			
    		}
    		
    		this.selectedNum = 0;//已选条数
    		
    		this.checkedData.forEach(item3 => {
    			if(item3._checked){
    				this.selectedNum++;
    			}
    		});
    		
    		//选项发生改变时
    		this.$emit('selectAlter',this.checkedData);
    		
    	},
    	
    	submitSucceed(){//提交成功后勾选功能数据还原
    		
    		this.checkedData = [];
    		
    		this.selectedNum = 0;//已选条数
						    		
    		this.getDataList(this.stateInfo);//获取数据列表
    		
    	},
    	
    	//==========================================================================
        changePage(currentPage){//改变页码时触发
        	
        	this.stateInfo.page = currentPage;//设置状态值
        	
            this.setRoutePara();//设置路由参数
            
        },
        pageSize(currentRow){//改变显示条数时触发
        	
        	this.stateInfo.pageSize = currentRow;//设置状态值
        	
        	this.setRoutePara();//设置路由参数
        	
        },
        
        //============================================================
        setRoutePara(){ //设置路由参数
        	//动态路由
    		this.$router.push(
	    		{
	    			name: this.$route.name,
	    			query: this.stateInfo,//状态信息
	    		}
    		);
    	},
    	holdState(){//保持状态
    		
    		let query = this.$route.query;
    		
    		if(query.page || query.pageSize){//页码，显示条数
    			
    			this.stateInfo.page = Number(query.page);
    			
    			this.stateInfo.pageSize = Number(query.pageSize);
    			
    		}
    		
    		if(query.date !== undefined){//日期
    			console.log('日期');
    			
    			if(query.date[0] == '' || query.date[1] == ''){
    				
    				this.screenVal.date = [];
    			
    				this.stateInfo.date = [];
    				
    			}else{
    				
    				this.screenVal.date = query.date;
    			
    				this.stateInfo.date = query.date;
    				
    			}
    			
    		}
    		
    		if(query.orderStatus){//下拉
    			
    			console.log('下拉');
    			
				this.screenVal.orderStatus = Number(query.orderStatus);

				this.stateInfo.orderStatus = Number(query.orderStatus);
				
    		}
    		
    		if(query.client){//客户列表
    			
    			console.log('客户列表');
    			
				this.screenVal.client = Number(query.client);

				this.stateInfo.client = Number(query.client);
				
    		}
    		
    		if(query.seek !== undefined){//搜索框
    			
    			console.log('搜索框');
    			
    			this.stateInfo.seek = query.seek;
    			
    			this.screenVal.seekTxtVal = query.seek;
    			
    		}
    		
    		this.$nextTick(() => {
    			
	    		if(this.$refs.page){
		    			
		    		this.$refs.page.currentPageSize = this.stateInfo.pageSize;
		    		
	    		}
	    		
	    	});
    		
    	},
    	
    	//====================================================================
    	
    	getClient(){//获取客户列表
    		
    		this.$axios.post('oa/customer_list', {
    			where: '{ "pid_tree_title":  ["=","2"] }',
    			page: 1,
    			pageSize: 99999,
    			order:'{"id":"desc"}',
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
				
			})
			.catch(function (error) {
				console.log(error);
			});
    		
    	},
    	
    	getDataList(stateInfo){//获取数据列表
    		
    		this.loads.tabLoading = true;
    		
    		let where = {};
    		
    		let whereOR = {};
    		
    		if(this.pageId){
    			where.pid_tree_title = ["=",this.pageId];
    		}
    		
    		if(this.whereId.length >= 2){
    			where.id = this.whereId;
    		}else if(this.whereId.length == 1){
    			where.id = ["=",null];
    		}
    		
    		if(this.pidTreeClassId){
    			where.pid_tree_class = ["=",this.pidTreeClassId];
    		}
    		
    		if(stateInfo.seek){//搜索框
    			
    			where.name = ["like","%"+stateInfo.seek+"%"];
    			
    		}
    		
    		if(stateInfo.date && stateInfo.date.length > 0){//日期
    			
    			//开始时间
    			let begin = Date.parse(new Date(stateInfo.date[0] + " 00:00:00")) / 1000;
    			
    			//结束时间
    			let end = Date.parse(new Date(stateInfo.date[1] + " 23:59:59")) / 1000;
    			
    			where.create_time = [ [">=",begin] , ["<=",end] , "and"];
    			
    		}
    		
    		if(stateInfo.orderStatus && this.seleSeekField){//下拉

				where[this.seleSeekField] = ["=",stateInfo.orderStatus];
    			
    		}
    		
    		this.$axios.post(this.tableDataUrl, {
    			
        		page:stateInfo.page,//页码
        		
        		pageSize:stateInfo.pageSize,//每页显示条数
        		
        		where:JSON.stringify(where),//筛选
        		
        		whereOR:JSON.stringify(whereOR),//多字段筛选
        		
        		order:'{"id":"desc"}',//排序，升序：asc，降序：desc
        		
        		status_class:this.stateListId,//下拉状态列表
        		
        		DBname_dataPage: this.DBnameDataPage ? this.DBnameDataPage : '',//万能列表用到的字段，填写基础表
        		
        		DBname_show_extend: this.DBnameShowExtend ? this.DBnameShowExtend : '',//是否显示详情页的数据
        		
        		warehousing_user_id: this.clientSelect ? stateInfo.client : '',//需要检索的客户ID
        		
        		warehousing_action_type: this.clientSelect ? 1 : '',//出库或入库，1：出库，2：入库
        		
        		warehousingFinal: '',//统计客户的总库存
        		
			})
			.then((response) => {
				
				let res = response.data.dataList;
				
				this.pageNumInfo = {//页码信息
					
					currentPage: res.current_page,//当前页码
					
					lastPage: res.last_page,//最后一页
					
					pageSize: Number(res.per_page),//每页显示数量
					
					total: res.total,//总数
					
				}
				
				this.tabDataList = response.data.dataList.data;//表格数据列表
				
				let arr = [{
        			label:'全部数据',
        			value:0,
        		}];
				
				response.data.statusList.forEach(item => {//下拉数据列表
					
					arr.push({
						label:item.name,
						value:item.id,
					});
					
				});
				
				this.cityList = arr;
				
				this.loads.tabLoading = false;
				
			})
			.catch(error => {
				console.log(error);
			});
			
    	},
    	
    	//==================================================================
    	ordinaryDel(id){//删除方法
    		
    		this.loads.delLoading = true;
    		
    		this.$axios.post(this.deleUrl, {
    			id:id,
			})
			.then((response) => {
				
				if(response.code == 1){
					
					this.getDataList(this.stateInfo);//获取数据列表
					
					this.loads.delLoading = false;
					
					this.$Message.success('删除成功');
					
				}
				
			})
			.catch(error => {
				console.log(error);
			});
			
    	},
    	
    	allPowerfulDel(id){//万能删除
    		this.loads.delLoading = true;
				
			let data = [
				{
					id: id,
					delete: "true"
				}
			]
			
			this.$axios.post('system/data_saveAll', {
				data: JSON.stringify(data),
    			DBname: this.DBname,
			})
			.then(response => {
				this.getDataList(this.stateInfo);//获取数据列表
				this.loads.delLoading = false;
				this.$Message.success('删除成功');
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	
    	//===============================================
    	upPage(){
    		this.getDataList(this.stateInfo);//获取数据列表
    	},
    	
    },
    
    computed:{//计算属性
    	
    	checkNumber(){//是否显示勾选条数
    		
    		let io = false;
    		
        	this.columnsList.forEach(item => {
        		
        		if(item.type == 'selection'){
        			io = true;
        		}
        		
        	});
        	
        	return io;
        	
        }
    	
    },
   
    mounted(){//模板被渲染完毕之后执行
    	
    	this.getDataList(this.stateInfo);//获取数据列表
    	
    	if(this.clientSelect){
    		this.getClient();//获取客户列表
    	}
    	
    },
    
    created(){//实例被创建完毕之后执行
    	
    	this.init();//初始化
    	
    	this.holdState();//保持状态
    	
    },
    
    watch:{//监测数据变化
    	
    	'$route' (to, from) {// 对路由变化作出响应...
    		
    		console.log('路由变化作出响应...');
    		
    		this.holdState();//保持状态
    		
			this.getDataList(this.stateInfo);//获取数据列表
    		
	    },
	    
	    'pageNumInfo'(newVal){//页码信息发生改变
	    	
	    	console.log('页码信息发生了变化');
	    	
	    	if(this.checkedData.length > 0){//选项状态
	    		
	    		this.tabDataList.forEach(item1 => {
	    			this.checkedData.forEach(item2 => {
	    				if(item1.id == item2.id){
	    					item1._checked = item2._checked;
	    				}
	    			});
	    		});
	    		
	    		let num = 0;
	    		
	    		this.checkedData.forEach(item3 => {
	    			if(item3._checked){
	    				num++;
	    			}
	    		});
	    		
	    		this.selectedNum = num;
	    		
	    	}
	    	
	    	if(this.stateInfo.page > newVal.lastPage){//筛选时当前的页码大于最后一页的页码时执行
    			this.stateInfo.page = 1;//页码跳转到第一页
    			this.setRoutePara(); //设置路由参数
	    	}
	    	
	    }
    	
    }
}
</script>

<style>
	.table-box .ivu-table-body{
		overflow:initial;
	}
	.seekBox i{
		cursor: pointer;
		border-left:1px solid #DDDEE1;
	}
	.tableZKPadd td.ivu-table-expanded-cell{
		padding:10px;
	}
</style>