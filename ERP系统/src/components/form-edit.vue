<template>
	
	<div>
		
		<div style="position: relative;">
			
			<Spin fix v-show="loading.pageLoad"></Spin>
			
			<div v-for="item in dataList">
				
				<Card>
					
					<div slot="title" style="display:flex;align-items: center;">
						<h1 v-show="!item.editable">{{item.name}}</h1>
						<Input v-show="item.editable" type="text" placeholder="输入名称" :value="item.name" style="width: 200px" @on-change="textVal($event,item)"></Input>
						<div style="margin-left:15px;">
						    <Button type="ghost" shape="circle" :loading="loading.editLoad" :icon="item.icon || 'edit'" @click="edit(item,item.id,'system/page_edit',true)"></Button>
						</div>
					</div>
					
					
					<div style="padding:15px;">
						
						<!--客户信息-->
						<div v-for="client in item.usDataPageList" style="margin-bottom:15px;">
							
							<Card>
								
								<div slot="title" style="display:flex;justify-content: space-between;align-items: center;">
									
									<h2>{{client.name}}</h2>
									
									<div>
										<span style="font-size:12px;margin-right:10px;">更换客户</span>
										<Select v-model="clientId" filterable style="width:200px">
									        <Option v-for="item in clientList" :value="item.value" :key="item.value">{{ item.label }}</Option>
									    </Select>
										<Button type="primary" @click="clientSave">确认更换</Button>
									</div>
									
								</div>
								
								<div v-for="main in client.formData" style="margin:15px;">
									
									<Card>
										
										<div slot="title">
											
											<h2>{{main.name}}</h2>
											
										</div>
										
										<form-mod :readOnly="true" :pid="Number(main.id)" :form-data="main.formFields"></form-mod>
										
										<div v-for="children in main.children" style="padding: 15px;">
											
											<Card>
												<div slot="title">
													<h3>{{children.name}}</h3>
												</div>
												
												<form-mod :readOnly="true" :pid="Number(children.id)" :form-data="children.formFields"></form-mod>
												
											</Card>
											
										</div>
										
									</Card>
										
								</div>
								
							</Card>
							
						</div>
						<!--客户信息-->
						
						<!--物品列表-->
						<Card v-if="item.itemsList && item.itemsList.length > 0" style="margin-bottom:15px;">
							
							<h2 slot="title">物品列表</h2>
							
							<div style="padding: 15px;">
								
								<Table border @on-selection-change="tableChange" :columns="goodsColumns" :data="item.itemsList"></Table>
								
								<div style="margin-top:10px;">
									
									<Button type="error" icon="trash-a" size="small" @click="batchDele">批量删除</Button>
									
									<Button type="primary" icon="edit" size="small" @click="batchModify">批量修改</Button>
									
									<Button type="dashed" icon="plus-round" size="small" @click="modalIo = true">添加物品</Button>
									
									<div>
										
										<Modal v-model="modalIo" width="500">
									        <p slot="header">添加物品</p>
									        <div style="text-align:center">
									        	
									        	<Form ref="formInstance" :model="formModel" :rules="formRules" :label-width="90">
					
													<FormItem label="选择物品" prop="selectVal">
														<Select v-model="formModel.selectVal" placeholder="请选择物品" clearable filterable style="">
															<Option v-for="item in goodsList" :value="item.value" :label="item.label" :key="item.value">
																<span style="float:left;">{{item.label}}</span>
							            						<span style="float:right;color:#ccc">库存：{{item.number}}</span>
															</Option>
														</Select>
													</FormItem>
													
													<FormItem label="需求数量" prop="needNumber">
														<Input v-model="formModel.needNumber" placeholder="请输入数量"></Input>
													</FormItem>
													
												</Form>
									        	
									        </div>
									        <div slot="footer">
									        	<Button @click="modalIo = false">取消</Button>
									        	<Button type="primary" @click="addGoods">确认</Button>
									        </div>
									    </Modal>
										
									</div>
									
								</div>
							</div>
							
						</Card>
						<!--物品列表-->
						
						<Card>
							
							<div slot="title" style="display:flex;justify-content:space-between;align-items: center;">
								
								<h2>表单</h2>
								
								<div>
									<Button type="ghost" shape="circle" icon="plus" @click="showModal('创建主表单',0)"></Button>
								</div>
								
							</div>
							
							<div v-if="item.title.length > 0" style="padding:15px;">
								
								<div v-for="main in item.title" style="margin-bottom:15px;">
									
									<Card>
										<div slot="title" style="display:flex;align-items: center;">
											<h2 v-show="!main.editable">{{main.name}}</h2>
											<Input v-show="main.editable" type="text" placeholder="输入名称" :value="main.name" style="width: 200px;" @on-change="textVal($event,main)"></Input>
											<Button style="margin-left: 15px;" type="ghost" shape="circle" :loading="loading.editLoad" :icon="main.icon || 'edit'" @click="edit(main,main.id,'system/formTable_edit')"></Button>
											<div style="margin-left:auto;">
												<ButtonGroup shape="circle">
											        <Button type="ghost" icon="plus" @click="showModal('创建子表单',main.id)"></Button>
											        <Button type="ghost" :loading="loading.delLoad" icon="trash-a" @click="del(main.id,'system/formTable_delete')"></Button>
											    </ButtonGroup>
											</div>
										</div>
										
										<form-mod ref="modInstance" @increment="formEvent" :pid="Number(main.id)" :form-data="main.formFields"></form-mod>
										
										<div v-for="children in main.children" style="padding: 15px;">
											
											<Card>
												
												<div slot="title" style="display:flex;align-items: center;">
													<h3 v-show="!children.editable">{{children.name}}</h3>
													<Input v-show="children.editable" type="text" placeholder="输入名称" :value="children.name" style="width: 200px" @on-change="textVal($event,children)"></Input>
													<Button style="margin-left: 15px;" size="small" shape="circle" type="ghost" :loading="loading.editLoad" :icon="children.icon || 'edit'" @click="edit(children,children.id,'system/formTable_edit')"></Button>
													<div style="margin-left:auto;">
													    <Button type="ghost" shape="circle" :loading="loading.delLoad" icon="trash-a" @click="del(children.id,'system/formTable_delete')"></Button>
													</div>
												</div>
												
												<form-mod ref="modInstance" @increment="formEvent" :pid="Number(children.id)" :form-data="children.formFields"></form-mod>
												
											</Card>
											
										</div>
										
									</Card>
										
								</div>
								
								<div style="text-align: center;">
									<Button type="primary" @click="submit">保存字段</Button>
								</div>
								
							</div>
						
						</Card>
						
					</div>
					
				</Card>
				
				
			</div>
			
		</div>
		
		<Modal
		class="modal-box"
		width="300"
        v-model="modal.io"
        :title="modal.title"
        @on-ok="addTitle">
			<Input type="text" placeholder="输入标题名称" v-model="modal.name"></Input>
	    </Modal>
		
	</div>
	
</template>

<script>
	
	import formMod from '@/components/form.vue';
	
	export default {
		components:{//模板
			formMod,//表单组件
		},
		props:{
			
			formEditId: {
				type: Number,
				required: true
			},
			
			showUrl:{//详情数据接口
				type: String,
				default: 'system/page_show'
			},
			
			editUrl:{//提交数据接口
				type: String,
				default: 'system/page_edit'
			},
			
		},
		data(){
			return{
				
				loading:{//加载效果
					addLoad:false,
					editLoad:false,
					delLoad:false,
					pageLoad:false,
				},
				
				indentId:this.formEditId,//订单id
				
				dataList:[],//所有数据列表
				
				//=====================================
				
				clientList: [],//客户列表
				
				clientId: '',//当前客户id
				
				tableSelectData: [],//表格当前勾选中的数据
				
				modificationList: [],//表格修改列表
				
				//========================================
				
				modalIo: false,
				
				formModel: {
					selectVal: '',//选中物品ID
					needNumber: '',//购买数量
				},
				
				formRules: {
                    selectVal: [
                    	{ type: 'number', required: true, message: '请选择物品', trigger: 'change' }
                    ],
                    needNumber: [
                        { required: true, message: '请输入数量', trigger: 'blur' }
                    ],
              	},

				goodsList: [],//物品下拉数据列表
				
				
				//========================================
				
				originalTxt:'',//编辑时旧的值
				
				modal:{//点击弹窗的值
					io:false,
					title:'',
					pid:null,
					name:'',
				},
				
				formTableIds:[],//用到的表单列表
				
				formIDS:null,//表单id列表
				
				formDatas:[],//表单数据
				
				goodsColumns: [//物品表头数据
					{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
					{
						width: 100,
						align: 'center',
						title: 'ID',
						key: 'id',
					},
					{
						width: 100,
						align: 'center',
						title: '物品ID',
						key: 'item_id',
					},
					{
						title: '物品名称',
						render: (h, params) => {
							return h('span',params.row.item_info.name)
						},
					},
					{
						width: 160,
						align: 'center',
						title: '需求数量',
						render: (h, params) => {
							let current = this.tableSelectData.filter((item) => {return item.id == params.row.id;});
    						let currentRow = current[0];
    						
							let current2 = this.modificationList.filter((item2) => {return item2.id == params.row.id;});
    						let currentRow2 = current2[0];
    						
    						let _this = this;
    						if(currentRow){
		    					if(currentRow.editable){//显示文本输入框
		    						return h('Input', {
		                                props: {
		                                    type: 'text',
		                                    clearable: true,
		                                    value: currentRow2.number,
		                                    placeholder:'请输入' + params.column.title
		                                },
		                                on: {
		                                    'on-change' (event) {
		                                    	currentRow2.number = event.target.value;
		                                    }
		                                }
		                            });
		    					}
    						}else{
    							return h('span',params.row.number);
    						}
						}
					},
					{
						title: '其它信息',
						render: (h, params) => {
							let str = '';
							
							params.row.item_info.formData.forEach(item => {
								
								item.formFields.forEach(item2 => {
									
									str += item2.label+'：'+item2.value+'，';
									
								});
								
							});
							
							return h('div',str)
						},
					},
				],
				
			}
		},
		methods: {
			getGoodsList(){//获取物品列表
				console.log('获取物品列表');
				this.$axios.post('items/item_list', {
					where: '{"pid_tree_class":["=","13"]}',
					page: 1,
					pageSize: 100000,
				})
				.then(response => {
					
					response.data.dataList.data.forEach(item => {
						
						this.goodsList.push({
							label: item.name,
							value: item.id,
							number: item.extend_data[0].number,
						});
						
					});
					
				})
				.catch(function(error) {
					console.log(error);
				});
				
			},
			addGoods(){//添加物品
				
				let data = [{
					id: '',
					pid_data_page: this.formEditId,
					item_id: this.formModel.selectVal,
					number: this.formModel.needNumber,
					delete: "false"
				}];
				
				this.$refs.formInstance[0].validate((valid) => {
					
                    if (valid) {
                    	
                    	this.$axios.post('system/data_saveAll', {
							data: JSON.stringify(data),
							DBname: "ExtendOrder",
						})
						.then(response => {
							
							this.getTitleList();//获取数据
							this.modalIo = false;
							this.$Message.success('添加成功');
		
						})
						.catch(function(error) {
							console.log(error);
						});
                    	
                    }
                    
               });
				
			},
			getClientList(){//获取客户列表
				console.log('获取客户列表');
				this.$axios.post('system/page_list', {
    				where: '{"pid_tree_title":["=",2]}',
    				page: 1,
    				pageSize: 20000,
    				order: '{"id":"asc"}',
				})
				.then(response => {
					
					let arr = [];
					
					response.data.dataList.data.forEach(item => {
						arr.push({
							label: item.name,
							value: item.id,
						});
					});
					
					this.clientList = arr;
					
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			clientSave(){//保存修改的客户
				
				let data = [
					{
						id: this.indentId,
						use_dataPage_ids: JSON.stringify([[2,this.clientId]]),
						delete:"false",
					}
				];
				
				this.$axios.post('system/data_saveAll', {
					data: JSON.stringify(data),
    				DBname: "DataPage",
				})
				.then(response => {
					this.getTitleList();//获取数据
					this.$Message.success('保存成功!');
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			getTitleList(){//获取数据
				
				this.tableSelectData = [];
				
				this.loading.pageLoad = true;
				
				this.$axios.post(this.showUrl, {
					id:this.indentId,
				})
				.then(response => {
					
					let arr = [];
					
					arr.push({
						id:response.data.id,
						name:response.data.name,
						title:response.data.formData,
						usDataPageList: response.data.use_dataPage_list,
						itemsList: [],
					});
					
					if(response.data.items_list){
						
						response.data.items_list.forEach(item => {
							if(item.item_info){
								arr[0].itemsList.push(item);
							}
						});
						
					}
					
					this.dataList = arr;
					
					if(arr[0].itemsList.length > 0){
						this.getGoodsList();//获取物品列表
					}
					
					if(response.data.use_dataPage_list && response.data.use_dataPage_list.length > 0){
						this.getClientList();//获取客户列表
						this.clientId = response.data.use_dataPage_list[0].id;
					}
					
					if(response.data.dataFormTable_ids){
						
						this.formTableIds = response.data.dataFormTable_ids.split(',');
						
					}else{
						
						this.formTableIds = [];
						
					}
					
					this.loading.pageLoad = false;
					
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			edit(obj,id,url,formTitle = false){//编辑按钮
				
				if(!obj.editable){//编辑
					
					this.originalTxt = obj.name;
					obj.icon = 'checkmark-round';
					obj.editable = true;
					
				}
				else{//保存修改
					
					this.loading.editLoad = true;
					
					if(this.originalTxt !== obj.name){
						
						if(formTitle){
							
							let info = {
								id:id,
		                	    name:obj.name,
							}
								
							this.$axios.post(url, {
								info:JSON.stringify(info),
		                	})
		                	.then(response => {
		                		
		                		this.loading.editLoad = false;
		                		
		                	})
		                	.catch(function (error) {
		                		console.log(error);
		                	});
							
						}else{
							
							this.$axios.post(url, {
								id:id,
		                	    name:obj.name,
		                	    edit_type: 2,
		                	})
		                	.then(response => {
		                		
		                		this.loading.editLoad = false;
		                		
		                	})
		                	.catch(function (error) {
		                		console.log(error);
		                	});
							
						}
						
					}else{
						this.loading.editLoad = false;
					}
					
					obj.icon = 'edit';
					obj.editable = false;
					
				}
				
				this.dataList = JSON.parse(JSON.stringify(this.dataList));
				
			},
			showModal(title,pid){//显示弹窗
				this.modal.io = true;
				this.modal.title = title;
				this.modal.pid = pid;
			},
			addTitle(){//添加标题
				
				this.$axios.post('system/formTable_add', {
					pid:this.modal.pid,
            	    name:this.modal.name,
            	    model:1,
            	    add_type: 2
            	})
            	.then(response => {
            		
            		if(response.data.pid == 0){//添加主标题
            			
            			console.log('添加主标题');
            			
            			this.formTableIds.push(response.data.id);
            			
            			let formIdsStr = this.formTableIds.join(',');
            			
            			let formTableIdsStr = {
            				id:this.indentId,
            				dataFormTable_ids:formIdsStr,
            			};
            			
            			this.$axios.post('system/page_edit', {
            				
	                	    info:JSON.stringify(formTableIdsStr),
	                	    
	                	})
	                	.then(response => {
	                		
	                	})
	                	.catch(function (error) {
	                		console.log(error);
	                	});
	                	
            			this.dataList[0].title.push({
            				id: response.data.id,
            				name: response.data.name,
							pid: response.data.pid,
							model: response.data.model,
							children:[],
            			});
            			
            		}else{//添加子标题
            			
            			console.log('添加子标题');
            			this.dataList[0].title.forEach(item => {
            				if(item.id == this.modal.pid){
		            			item.children.push({
		            				id: response.data.id,
		            				name: response.data.name,
									pid: response.data.pid,
									model: response.data.model,
		            			});
            				}
            			});
            			
            		}
            		
            	})
            	.catch(function (error) {
            		console.log(error);
            	});
			},
			del(id,url){//删除按钮
				
				this.loading.delLoad = true;
				
				this.$axios.post(url, {
					id:id,
					delete_type: 2,
            	})
            	.then(response => {
            		
        			this.dataList[0].title.forEach((main,index2,mainArr) => {
        				if(main.id == id){
        					
        					console.log('删除主标题');
        					
        					mainArr.splice(index2,1);
        					
        					this.formTableIds.forEach((formTableIdsList,formTableIdsIndex,formTableIdsArr) => {
        						
        						if(formTableIdsList == id){
        							
        							formTableIdsArr.splice(formTableIdsIndex,1);
        							
			            			let formIdsStr = this.formTableIds.join(',');
			            			
			            			let formTableIdsStr = {
			            				
			            				id:this.indentId,
			            				dataFormTable_ids:formIdsStr,
			            				
			            			};
			            			
			            			this.$axios.post('system/page_edit', {
										info:JSON.stringify(formTableIdsStr),
				                	})
				                	.then(response => {
				                		
				                	})
				                	.catch(function (error) {
				                		console.log(error);
				                	});
        						}
        						
        					});
        					
        					return false;
        				}
        				main.children.forEach((children,index3,childrenArr) => {
        					if(children.id == id){
        						console.log('删除子标题');
        						childrenArr.splice(index3,1);
        						return false;
        					}
        				});
        			});
            		
            		this.loading.delLoad = false;
            	})
            	.catch(function (error) {
            		console.log(error);
            	});
				
				this.dataList = JSON.parse(JSON.stringify(this.dataList));
			},
			textVal(ev,obj){//设置修改的值
				obj.name = ev.target.value;
			},
			
			//============================================================================
			
			
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
				
				if(this.$refs.modInstance && this.$refs.modInstance.length > 0){
						
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
		        		
		        		if(formDatasString !== '[]'){
		        			
				        	this.$axios.post(this.editUrl, {
				        		
				        		fields:formDatasString,
				        		info: null,
				        		
							})
							.then((response) => {
								if(response.code === 1){
									this.formDatas = [];//清空临时数据
									this.$Message.success('提交成功!');
								}
							})
							.catch(error => {
								console.log(error);
							});
		        			
		        		}else{
		        			this.$Message.info('请操作表单！');
		        		}
						
		        	}else{
		        		this.$Message.error('提交失败');
		        	}
		        	
		        }else{
		        	this.$Message.info('请添加表单标题！');
		        }
	        	
	        },
	        //================================================================
	        tableChange(selection){//表格选项发生改变时
	        	
	        	let io = false;
    		
    			let io2 = true;
	        	
	        	selection.forEach(item1 => {
	        		
	        		item1.editable = true;
	        		
    				if(this.modificationList.length > 0){
    					
    					this.modificationList.forEach(item2 => {
		    					
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
	    					this.modificationList.push(item1);
		    			}else{
		    				
		    				let io3 = true;
		    				
		    				this.modificationList.forEach(item3 => {
		    					if(item1.id == item3.id){
		    						io3 = false;
		    					}
		    				});
		    				
		    				if(io3){
	    						this.modificationList.push(item1);
		    				}
		    				
		    			}
    					
    				}else{
		    			this.modificationList.push(item1);
		    		}
			
	        	});
	        	
	        	this.tableSelectData = selection;
	        	
	        },
	       	batchDele(){//批量删除
	       		
	       		let arr = [];
	       		
	       		this.tableSelectData.forEach(item => {
	       			
	       			arr.push({
       					id: item.id,
       					delete: "true",
       				});
	       			
	       		});
	       		
	       		if(arr.length > 0){
	       			
	       			this.$axios.post('system/data_saveAll', {
    					data: JSON.stringify(arr),
    					DBname: "ExtendOrder",
					})
					.then(response => {
						this.tableSelectData = [];
						this.getTitleList();//获取数据
						this.$Message.success('删除成功!');
					})
					.catch(function (error) {
						console.log(error);
					});
					
	       		}else{
	       			this.$Message.info('请勾选要操作的数据!');
	       		}
	       		
	       	},
	       	batchModify(){//批量修改
	       		
	       		let arr = [];
	       		
	       		this.modificationList.forEach(item => {
	       			
	       			this.tableSelectData.forEach(item2 => {
		       			
		       			if(item.id == item2.id){
		       				arr.push({
		       					id: item.id,
		       					number: item.number,
		       					delete: "false",
		       				});
		       			}
		       			
		       		})
	       			
	       		});
	       		
	       		if(arr.length > 0){
	       			
	       			this.$axios.post('system/data_saveAll', {
    					data: JSON.stringify(arr),
    					DBname: "ExtendOrder",
					})
					.then(response => {
						this.tableSelectData = [];
						this.getTitleList();//获取数据
						this.$Message.success('修改成功!');
					})
					.catch(function (error) {
						console.log(error);
					});
					
	       		}else{
	       			this.$Message.info('请勾选要操作的数据!');
	       		}
	       		
	       	},
			
		},
		mounted(){//模板被渲染完毕之后执行
			
			this.getTitleList();//获取数据
			
		},
		watch:{//监测数据变化
			
		},
	}
</script>

<style scoped>
</style>

<style>
	.modal-box .ivu-modal-mask{
		z-index:9999;
	}
	.modal-box .ivu-modal-wrap{
		z-index:9999;
	}
</style>