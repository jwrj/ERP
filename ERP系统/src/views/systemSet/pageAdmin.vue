<template>
	<div>
		
		<Card>
			
			<h1 slot="title">创建页面</h1>
			
			<div style="padding:15px 15px 0px;position: relative;">
				
				<Spin fix v-show="loading.pageClassLoad"></Spin>
				
				<Form ref="pageForm" :model="pageForm" :rules="pageRules" :label-width="70" inline>
					
					<FormItem label="页面名称" prop="pageName">
						<Input v-model="pageForm.pageName" placeholder="输入页面名称" clearable style="width: 150px"></Input>
					</FormItem>
					
					<FormItem label="选择模块" prop="pageClassId">
						<Select style="width:160px" filterable v-model="pageForm.pageClassId" placeholder="无数据" @on-change="selectPageClass">
					        <Option v-for="item in pageClassList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
					    <Button @click="addPage('pageForm')" type="dashed" icon="plus-round">创建页面</Button>
				    </FormItem>
					
				</Form>
					
			</div>
			
		</Card>
		
		<Card style="margin-top:15px;">
			
			<h1 slot="title">页面列表</h1>
			
			<div style="padding:15px;position: relative;">
				
				<Spin fix v-show="loading.tabLoad"></Spin>
				
				<Table class="table-box" border :columns="tabColumns" :data="tabData"></Table>
				
			</div>
			
		</Card>

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
						
						_this.tabData = JSON.parse(JSON.stringify(_this.tabData));
						
					}else{//保存
						
						currentRowData.editting = false;
						
						if(currentRowData.name !== params.row.name){
							currentRowData.name = params.row.name;
							_this.editPage(params.row.id,params.row.name);//编辑页面
						}
						
						_this.tabData = JSON.parse(JSON.stringify(_this.tabData));
						
						
						
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
					_this.tabData.forEach((item,index,arr) => {
						if(item.id === params.row.id){
							arr.splice(index,1);
						}
					});
					_this.delPage(params.row.id);//删除页面
				}
			}
		});
	}
	export default {
		components:{//模板
		},
		data(){
			return{
				
				
				loading: {//加载效果
					
					pageClassLoad: false,
					
					tabLoad: false,
					
				},
				
				tabColumns: [//表头数据
                    {
                        title: '页面名称',
                        key: 'name',
                        editable: true,
                    },
                    {
                        title: '页面ID',
                        key: 'id'
                    },
                    {
                    	title: '操作',
                    	align:'center',
                    	width:150,
                    	handle:['edit', 'delete'],
                    },
                ],
                tabData: [],//表格数据
				
				pageClassList:[],//页面分类列表
				
				pageForm:{//表单值
					pageName:'',
					pageClassId:'',//页面分类id
				},
				
				pageRules:{//表单验证
					pageName: [
                        { required: true, message: '必须输入名称', trigger: 'blur' }
                    ],
					pageClassId: [
                        { type: 'number', required: true, message: '选择需要创建页面的模块', trigger: 'change' }
                    ],
				},
				
			}
		},
		methods: {
			
			init(){//初始化
				
				let _this = this;
    			
    			this.tabColumns.forEach(item => {//初始化表格内容
    				
    				if(item.editable){//编辑字段
	    				item.render = (h, params) => {
	    					
	    					let current = _this.tabData.filter((item) => {return item.id === params.row.id;});
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
    						
    						let current = _this.tabData.filter((item) => {return item.id === params.row.id;});
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
			
			//===========================================================================================
			pageClass(){//获取页面分类
				
				this.loading.pageClassLoad = true;
				
				this.loading.tabLoad = true;

				this.$axios.post('system/treeClass_list', {
				    id: 1,
				})
				.then(response => {
					
					response.data[0].children.forEach((item) => {
						this.pageClassList.push({
							label:item.name,
							value:item.id
						});
						
					});
					
					if(this.pageClassList.length > 0){//默认值
						this.pageForm.pageClassId = this.pageClassList[0].value;
					}
					
					this.loading.pageClassLoad = false;
					
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			selectPageClass(id){//选择页面分类
				
				this.getPageList(id);//读取页面列表
				
			},
			getPageList(id){//读取页面列表
				
				this.loading.tabLoad = true;
				
				this.$axios.post('system/treeTitle_list', {
					pid_tree_class:id,
				})
				.then(response => {
					
					this.tabData = response.data;
					
					this.loading.tabLoad = false;
					
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			addPage(name){//创建页面
				
				this.$refs[name].validate((valid) => {
                    if (valid) {
                    	this.$axios.post('system/treeTitle_add', {
						    name: this.pageForm.pageName,
						    pid_tree_class:this.pageForm.pageClassId,
						})
						.then(response => {
							if(response.code === 1){
								this.tabData.push({
									name:response.data.name,
									id:response.data.id,
								});
								this.pageForm.pageName = '';
								this.$Message.success('创建成功');
							}
						})
						.catch(function (error) {
							console.log(error);
						});
                    } else {
                        this.$Message.error('创建失败!');
                    }
                })
			},
			editPage(id,name){//编辑页面
				this.$axios.post('system/treeTitle_edit', {
				    id:id,
				    name:name,
				    pid_tree_class: this.pageForm.pageClassId,
				})
				.then(response => {
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			delPage(id){//删除页面
				this.$axios.post('system/treeTitle_delete', {
				    id: id,
				})
				.then(response => {
				})
				.catch(function (error) {
					console.log(error);
				});
			},
		},
		created(){//实例被创建完毕之后执行
			this.init();//初始化
		},
		mounted(){//模板被渲染完毕之后执行
	    	this.pageClass();//获取页面分类
		},
		watch:{//监测数据变化
			
		},
	}
</script>

<style>
	.table-box .ivu-table-body{
		overflow:initial;
	}
</style>