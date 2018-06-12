<template>
	<div>
		
		<Card>
			
			<div class="edit" slot="title">
				<h1>创建模板</h1>
				<div>
					<span style="margin-right:6px;font-size:12px;">选择主模块</span>
					<Select style="width:160px" filterable :disabled="fatherPageClassId ? true : false" v-model="pageClassId" placeholder="无数据" @on-change="selectPageClass">
				        <Option v-for="item in pageClassList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
				</div>
			</div>
			
			<div style="padding:15px 15px 0;position: relative;">
				
				<Spin fix v-show="loading.pageClassLoad"></Spin>
				
				<Form ref="addTemplate" :model="addTemplate" :rules="TemplateRules" :label-width="80" inline>
					
					<FormItem prop="tempName" label="模板名称">
						<Input v-model="addTemplate.tempName" placeholder="输入模板名称" clearable style="width: 150px"></Input>
					</FormItem>
					
					<FormItem prop="pageId" label="选择页面">
						<Select style="width:160px" :disabled="fatherModulePageId ? true : false" filterable v-model="addTemplate.pageId" placeholder="无数据" @on-change="selePage">
					        <Option v-for="item in allPage" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
					    
					    <Button :loading="loading.addLoad" @click="addTemp('addTemplate')" type="dashed" icon="plus-round">创建模板</Button>
				    </FormItem>
					
				</Form>
					
			</div>
			
		</Card>
		
		<Card style="margin-top:15px;">
			
			<div class="edit" slot="title">
				<h1>编辑模板</h1>
				
				<div>
					<span style="margin-right:6px;font-size:12px;">选择模板</span>
					<Select ref="sele" filterable style="width:160px" v-model="temDefaultVal.tempID" placeholder="无数据" :label-in-value="true" @on-change="template">
				        <Option v-for="item in templateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
				</div>
			</div>
			
			<div style="padding: 15px;position: relative;">
				
				<Spin fix v-show="loading.pageLoad"></Spin>
				
				<div v-for="item in tempPrice">
					
					<Card>
						
						<div slot="title" style="display:flex;align-items: center;">
							<h1 v-show="!item.editable">{{item.name}}</h1>
							<Input v-show="item.editable" type="text" placeholder="输入模板名称" :value="item.name" style="width: 200px" @on-change="textVal($event,item)"></Input>
							<Button style="margin-left:10px;" shape="circle" type="ghost" :loading="loading.editLoad" :icon="item.icon || 'edit'" @click="edit(item,item.id,'system/template_edit')"></Button>
							<div style="margin-left:auto;">
								<ButtonGroup shape="circle">
							        <Button type="ghost" icon="plus" @click="showModal('创建主表单',0)"></Button>
							        <Button type="ghost" :loading="loading.delLoad" icon="trash-a" @click="del(item.id,'system/template_delete')"></Button>
							    </ButtonGroup>
							</div>
						</div>
						
						<div v-for="main in item.title" style="padding:0 15px 15px;">
							
							<Card style="margin-top:15px;">
								
								<div slot="title" style="display:flex;align-items: center;">
									<h2 v-show="!main.editable">{{main.name}}</h2>
									<Input v-show="main.editable" type="text" placeholder="输入标题名称" :value="main.name" style="width: 200px" @on-change="textVal($event,main)"></Input>
									<Button style="margin-left:10px;" shape="circle" type="ghost" :loading="loading.editLoad" :icon="main.icon || 'edit'" @click="edit(main,main.id,'system/formTable_edit')"></Button>
									<div style="margin-left:auto;">
										<ButtonGroup shape="circle">
									        <Button type="ghost" icon="plus" @click="showModal('创建子表单',main.id)"></Button>
									        <Button type="ghost" :loading="loading.delLoad" icon="trash-a" @click="del(main.id,'system/formTable_delete')"></Button>
									    </ButtonGroup>
									</div>
								</div>
								
								<form-mod ref="modInstance" @increment="formEvent" :pid="Number(main.id)" :form-data="main.formFields" :operability="true"></form-mod>
								
								<div v-for="children in main.children" style="padding:0 15px 15px;">
									
									<Card>
										
										<div slot="title" style="display:flex;align-items: center;">
											<h3 v-show="!children.editable">{{children.name}}</h3>
											<Input v-show="children.editable" type="text" placeholder="输入标题名称" :value="children.name" style="width: 200px" @on-change="textVal($event,children)"></Input>
											<Button style="margin-left:10px;" shape="circle" type="ghost" :loading="loading.editLoad" :icon="children.icon || 'edit'" @click="edit(children,children.id,'system/formTable_edit')"></Button>
											<div style="margin-left:auto;">
												<ButtonGroup shape="circle">
											        <Button type="ghost" :loading="loading.delLoad" icon="trash-a" @click="del(children.id,'system/formTable_delete')"></Button>
											    </ButtonGroup>
											</div>
										</div>
										
										<form-mod ref="modInstance" @increment="formEvent" :pid="Number(children.id)" :form-data="children.formFields" :operability="true"></form-mod>
										
									</Card>
									
								</div>
								
							</Card>
							
						</div>
						
					</Card>
				</div>
				
				<div style="text-align: center;padding:15px 15px 0;">
					<Button type="primary" @click="submit">保存字段</Button>
				</div>
				
			</div>
			
		</Card>
		
		<Modal
		class="modal-box"
		width="300"
        v-model="modal.io"
        :title="modal.title"
        @on-ok="addTitle">
				<Input type="text" placeholder="输入名称" v-model="modal.name"></Input>
	    </Modal>
		
	</div>
</template>

<script>
	
	import formMod from '@/components/form.vue';
	
	export default {
		components:{//模板
			formMod,
		},
		data(){
			return{
				
				fatherPageClassId:this.$parent.$parent.$parent.$parent.pidTreeClass,//父组件页面分类id
				
				fatherModulePageId:this.$parent.$parent.$parent.$parent.pageId,//父组件页面id
				
				pageClassList:[],//页面分类列表
				
				pageClassId:'',//页面分类id
				
				loading:{//加载效果
					addLoad:false,
					editLoad:false,
					delLoad:false,
					pageClassLoad:false,
					pageLoad:false,
				},
				
				originalTxt:'',//编辑时旧的值
				
				modal:{//点击弹窗的值
					io:false,
					title:'',
					pid:null,
					name:'',
				},
				
				formTableIds:[],//模板用到的表单标题
				
				allPage:[],//所有页面列表
				
				addTemplate:{//创建模板表单值
					tempName:'',
					pageId:'',
				},
				
				TemplateRules:{//创建模板表单条件
					tempName: [
                        { required: true, message: '必须输入名称', trigger: 'blur' }
                    ],
                    pageId: [
						//验证的类型很重要，默认是字符串，类型不对验证会不能通过
                        { type: 'number', required: true, message: '选择页面', trigger: 'change' }
                    ],
				},
				
				templateList:[],//模板列表
				
				tempPrice:[],//选中的模板数据
				
				temDefaultVal:{//默认模板值
					tempID:'',//当前模板id
					label:'',//当前模板label
				},
				
				formIDS:null,//表单id列表
				
				formDatas:[],//表单数据
			}
		},
		methods: {
			pageClass(){//获取页面分类
				
				this.loading.pageClassLoad = true;
				this.loading.pageLoad = true;
				
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
						this.pageClassId = this.fatherPageClassId ? this.fatherPageClassId : this.pageClassList[0].value;
					}
					
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			selectPageClass(id){//选择页面分类
				
				this.getPage(id);//获取页面列表
				
			},
			getPage(id){//获取页面列表
				
				this.loading.pageClassLoad = true;
				
				this.$axios.post('/system/treeTitle_list', {
					pid_tree_class:id,
				})
				.then(response => {
					
					let arr = [];
					
					response.data.forEach((item) => {
						arr.push({
							label:item.name,
							value:item.id,
						});
					});
					
					this.allPage = arr;
					
					if(this.allPage.length > 0){
						this.addTemplate.pageId = this.fatherModulePageId ? this.fatherModulePageId : this.allPage[0].value;
					}
					
					this.loading.pageClassLoad = false;
					
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			selePage(pageId){//选择页面
				
				this.getTemplate(pageId);//获取模板列表
				
			},
			getTemplate(){//获取模板列表
				
				this.$axios.post('system/template_list', {
					pid_tree_title:this.addTemplate.pageId,
				})
				.then(response => {
					let arr = [];
					response.data.forEach((item) => {
						arr.push({
							label:item.name,
							value:item.id,
						});
					});
					
					this.templateList = arr;
					if(this.templateList.length > 0){//默认模板
						this.temDefaultVal.tempID = this.templateList[0].value;
						this.temDefaultVal.label = this.templateList[0].label;
					}
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			template(price){//选择模板
				
				let arr = [{
					name: price.label ? price.label : this.temDefaultVal.label,
					id: price.value,
					title: [],
				}];
				this.tempPrice = arr;
				if(!this.tempPrice[0].id){
					this.tempPrice.length = 0;
					return false;
				}
				this.getTitleList(this.addTemplate.pageId,price.value);//获取标题、字段数据
				
			},
			getTitleList(pageId,tempId){//获取标题、字段数据
				
				this.loading.pageLoad = true;
				
				this.$axios.post('system/page_into', {
					template_list_id:pageId,//当前页面id
					use_template_id:tempId,//当前模板id
				})
				.then(response => {
					
					this.tempPrice[0].title = response.data.templateForm;
					
					response.data.templateList.forEach(item => {
						if(item.id == tempId){
							if(item.formTable_ids){
								this.formTableIds = item.formTable_ids.split(',');
							}else{
								this.formTableIds = [];
							}
						}
					});
					
					this.formIDS = response.data.pageInfo.use_templateFormIDS;
					this.loading.pageLoad = false;
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			addTemp(name){//创建模板
				this.$refs[name].validate((valid) => {
                    if (valid) {
                    	this.loading.addLoad = true;
                    	this.$axios.post('system/template_add', {
						    name: this.addTemplate.tempName,
						    pid_tree_title:this.addTemplate.pageId,
						})
						.then(response => {
							
							if(response.code === 1){
								
								this.templateList.push({
									label:response.data.name,
									value:response.data.id,
								});
								
								if(this.templateList.length > 0){//默认模板
									this.temDefaultVal.tempID = this.templateList[0].value;
									this.temDefaultVal.label = this.templateList[0].label;
								}
								
								this.addTemplate.tempName = '';
								
								this.$Message.success('创建成功');
								
								this.loading.addLoad = false;
								
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
			edit(obj,id,url){//编辑按钮
				
				if(!obj.editable){//编辑
					
					this.originalTxt = obj.name;
					obj.icon = 'checkmark-round';
					obj.editable = true;
					
				}
				else{//保存修改
					
					this.loading.editLoad = true;
					
					if(this.originalTxt !== obj.name){
						
						this.$axios.post(url, {
							id:id,
	                	    name:obj.name,
	                	    edit_type: 1
	                	})
	                	.then(response => {
	                		
	                		this.$refs.sele.optionInstances.forEach((item,index,arr) => {
            					if(item.showLabel == id){
            						item.searchLabel = obj.name;
            					}
            				});
            				
	                		this.templateList.forEach((item,index,arr) => {
            					if(item.value == id){
            						arr[index].label = obj.name;
            						this.$refs.sele.options = this.templateList;
            						this.$refs.sele.selectedSingle = obj.name;
            					}
            				});
	                		
	                		this.loading.editLoad = false;
	                	})
	                	.catch(function (error) {
	                		console.log(error);
	                	});
						
					}else{
						this.loading.editLoad = false;
					}
					
					obj.icon = 'edit';
					obj.editable = false;
					
				}
				
				this.tempPrice = JSON.parse(JSON.stringify(this.tempPrice));
				
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
            	    add_type: 1
            	})
            	.then(response => {
            		if(response.data.pid == 0){//添加主标题
            			console.log('添加主标题');
            			this.formTableIds.push(response.data.id);
            			
            			let str = this.formTableIds.join(',');
            			
            			this.$axios.post('system/template_edit', {
            				
							id:this.temDefaultVal.tempID,
	                	    formTable_ids:str,
	                	    
	                	})
	                	.then(response => {
	                		
	                	})
	                	.catch(function (error) {
	                		console.log(error);
	                	});
            			Number
            			this.tempPrice[0].title.push({
            				id: response.data.id,
            				name: response.data.name,
							pid: response.data.pid,
							model: response.data.model,
							children:[],
            			});
            			console.log();
            			
            		}else{//添加子标题
            			console.log('添加子标题');
            			this.tempPrice[0].title.forEach(item => {
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
					delete_type: 1
            	})
            	.then(response => {
            		
            		this.tempPrice.forEach((template,index1,temArr) => {
            			if(template.id == id){
            				
            				this.templateList.forEach((list,listLndex,listArr) => {
            					if(list.value == template.id){
            						listArr.splice(listLndex,1);
            						if(this.templateList.length > 0){//默认模板
										this.temDefaultVal.tempID = this.templateList[0].value;
										this.temDefaultVal.label = this.templateList[0].label;
									}
            					}
            				});
            				
            				console.log('删除模板');
            				temArr.splice(index1,1);
            				return false;
            			}
            			template.title.forEach((main,index2,mainArr) => {
            				if(main.id == id){
            					
            					console.log('删除主标题');
            					
            					mainArr.splice(index2,1);
            					
            					this.formTableIds.forEach((formTableIdsList,formTableIdsIndex,formTableIdsArr) => {
            						
            						if(formTableIdsList == id){
            							
            							formTableIdsArr.splice(formTableIdsIndex,1);
            							
				            			let str = this.formTableIds.join(',');
				            			
				            			this.$axios.post('system/template_edit', {
											id:this.temDefaultVal.tempID,
					                	    formTable_ids:str,
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
            		});
            		
            		this.loading.delLoad = false;
            	})
            	.catch(function (error) {
            		console.log(error);
            	});
				
				this.tempPrice = JSON.parse(JSON.stringify(this.tempPrice));
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
		        			
				        	this.$axios.post('system/page_editTemplate', {
				        		fields:formDatasString,
							})
							.then((response) => {
								if(response.code === 1){
									this.getTitleList(this.addTemplate.pageId,this.temDefaultVal.tempID);//获取标题、字段数据
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
		        	this.$Message.info('请添加表单！');
		        }
	        	
	        },
			
			
			
			
			
		},
		mounted(){//模板被渲染完毕之后执行
			this.pageClass()//读取页面分类
		},
		watch:{//监测数据变化
			
		},
	}
</script>

<style scoped>
	.edit{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>

<style>
	.modal-box .ivu-modal-mask{
		z-index:9999;
	}
	.modal-box .ivu-modal-wrap{
		z-index:9999;
	}
</style>