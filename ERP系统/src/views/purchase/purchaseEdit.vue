<template>

	<div>

		<Card>

			<div slot="title" v-for="(item,i) in title" style="display:flex;justify-content: space-between;align-items: center;">
				<h1 v-if="!item.editable">{{item.name}}</h1>
				<Input v-if="item.editable" :value="item.name" @on-change="inputChange" style="width:150px;"></Input>
				<div>
					<ButtonGroup shape="circle">
						<Button type="ghost" shape="circle" :loading="loads.titleEditLoad" :icon="item.editable ? 'checkmark-round' : 'edit'" @click="edit(item,i)"></Button>
						<Button v-if="item.editable" type="ghost" shape="circle" icon="close-round" @click="cancel(item)"></Button>
					</ButtonGroup>
				</div>
			</div>

			<div style="padding:16px;">

				<Table :loading="loads.tabLoading" :columns="tabColumns" :data="tabData" border></Table>

				<div style="margin-top:16px;">

					<Form ref="formInstance" :model="formModel" :rules="formRules" inline>

						<FormItem prop="selectVal">
							
							<Select v-model="formModel.selectVal" placeholder="请选择物品" clearable filterable style="width:350px">
								<Option v-for="item in goodsList" :value="item.value" :label="item.label" :key="item.value">
									<span style="float:left;">{{item.label}}</span>
            						<span style="float:right;color:#ccc">库存：{{item.number}}</span>
								</Option>
							</Select>
							
						</FormItem>

						<FormItem prop="needNumber">
							
							<Input v-model="formModel.needNumber" placeholder="请输入购买数量" style="width:120px;"></Input>
							
							<Button type="dashed" icon="plus-round" @click="addGoods('formInstance')">添加物品</Button>
							
						</FormItem>

					</Form>

				</div>

			</div>

		</Card>

	</div>

</template>

<script>
	const editButton = (_this, h, currentRowData, params) => { //编辑按钮

		let children = [];

		const confirm = h('Button', { //确定
			props: {
				type: 'ghost',
				shape: 'circle',
				loading: _this.loads.editLoading,
				icon: !currentRowData.editting ? 'edit' : 'checkmark-round',
			},
			style: {
				color: !currentRowData.editting ? '#2d8cf0' : '#19be6b',
			},
			on: {
				click: () => {
					if(!currentRowData.editting) { //编辑

						currentRowData.editting = true;

						_this.tabData = JSON.parse(JSON.stringify(_this.tabData));

					} else { //保存

						currentRowData.editting = false;

						if(currentRowData.number != params.row.number) {

							_this.loads.editLoading = true;

							let data = [{
								id: params.row.id,
								pid_data_page: params.row.pid_data_page,
								item_id: params.row.item_id,
								number: params.row.number,
								delete: 'false'
							}];

							_this.$axios.post('items/purchase_edit', {
									data: JSON.stringify(data),
									info: null,
								})
								.then(response => {
									
									_this.tabData.forEach(item => {
										if(item.id == params.row.id){
											item.number = params.row.number
										}
									});
									
									_this.loads.editLoading = false;
									
								})
								.catch(function(error) {
									console.log(error);
								});

						}

						_this.tabData = JSON.parse(JSON.stringify(_this.tabData));

					}
				}
			}
		});

		const cancel = h('Button', { //取消
			props: {
				type: 'ghost',
				shape: 'circle',
				icon: 'close-round',
			},
			style: {
				color: '#ed3f14'
			},
			on: {
				click: () => {
					currentRowData.editting = false;
				}
			}
		});

		if(!currentRowData.editting) {
			children.push(confirm);
		} else {
			children.push(confirm, cancel);
		}

		return h('ButtonGroup', {
			props: {
				shape: 'circle',
			}
		}, children);

	}

	const delButton = (_this, h, params) => { //删除按钮

		return h('Poptip', {
			props: {
				confirm: true,
				title: "您确认删除这条内容吗？",
				transfer: true,
				placement: "top-end"
			},
			on: {

				'on-ok' () {

					console.log('点击了删除');

					_this.loads.delLoading = true;

					let data = [{
						id: params.row.id,
						pid_data_page: params.row.pid_data_page,
						item_id: params.row.item_id,
						delete: 'true'
					}];

					_this.$axios.post('items/purchase_edit', {
							data: JSON.stringify(data),
							info: null,
						})
						.then(response => {

							_this.tabData.forEach((item, index, arr) => {

								if(item.id == params.row.id) {
									arr.splice(index, 1);
								}

							});

							_this.loads.delLoading = false;

							_this.$Message.success('删除成功');

						})
						.catch(function(error) {
							console.log(error);
						});

				},

				'on-cancel' () {

				}

			}
		}, [
			h('Tooltip', {
				props: {
					content: '删除',
					placement: 'top',
					transfer: true,
				},
				style: {},
			}, [
				h('Button', {
					props: {
						type: 'ghost',
						shape: 'circle',
						icon: 'trash-a',
						loading: _this.loads.delLoading,
					},
					style: {
						margin: '2px',
						color: '#ed3f14'
					},
					on: {
						click: () => {

						}
					}
				})
			])
		]);

	}

	export default {
		components: { //模板

		},
		props:{
			
			id:Number,//采购单ID
			
			editUrl: String,//编辑url接口
			
		},
		data() { //数据
			return {

				loads: { //加载

					tabLoading: false, //表格

					editLoading: false, //编辑按钮

					delLoading: false, //删除按钮

					titleEditLoad: false, //名称编辑按钮

				},

				title: [{name: '',}],//采购名

				old: '', //旧的值

				inputVal: '', //input值

				tabColumns: [{
						title: 'ID',
						key: 'id',
						width: 80,
						align: 'center'
					},
					{
						title: '物品ID',
						key: 'item_id',
						width: 80,
						align: 'center'
					},
					{
						title: '物品名称',
						key: 'name',
					},
					{
						title: '购买数量',
						key: 'number',
						width: 100,
						align: 'center',
						editable: true,
					},
					{
	        			title: '物品信息',
	                    key: 'info',
	        		},
					{
						title: '操作',
						align: 'center',
						width: 150,
						handle: ['edit', 'delete'],
					},
				],

				tabData: [],//表格数据
				
				formModel: {
					selectVal: '',//选中物品ID
					needNumber: '',//购买数量
				},
				
				formRules: {
                    selectVal: [
                    	{ type: 'number', required: true, message: '请选择物品', trigger: 'change' }
                    ],
                    needNumber: [
                        { required: true, message: '请输入购买数量', trigger: 'blur' }
                    ]
               },

				goodsList: [],//物品下拉数据列表

			}
		},
		methods: { //方法

			init() { //初始化

				let _this = this;

				this.tabColumns.forEach(item => { //初始化表格内容

					if(item.editable) { //编辑字段
						item.render = (h, params) => {

							let current = _this.tabData.filter((item) => {
								return item.id === params.row.id;
							});
							let currentRow = current[0];

							if(!currentRow.editting) { //隐藏文本输入框

								return h('span', currentRow[item.key]);

							} else { //显示文本输入框
								return h('Input', {
									props: {
										type: 'text',
										value: currentRow[item.key],
										placeholder: '请输入' + item.title
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

					if(item.handle) { //添加操作按钮
						item.render = (h, params) => {

							let current = _this.tabData.filter((item) => {
								return item.id === params.row.id;
							});
							let currentRowData = current[0];

							let children = [];

							item.handle.forEach(item => {
								if(item === 'edit') { //编辑按钮

									children.push(editButton(this, h, currentRowData, params));

								} else if(item === 'delete') { //删除按钮

									children.push(delButton(this, h, params));

								}
							});

							return h('div', children);
						}
					}

				})
			},

			//=========================================================
			getTableData() { //获取表格数据

				this.loads.tabLoading = true;

				this.$axios.post('items/purchase_show', {
						id: this.id,
					})
					.then(response => {

						this.title[0].name = response.data.name;
						
						let arr = [];
						
						response.data.items_list.forEach((item,index) => {

							if(item.item_info) {
								
								let info = '';
						
								item.item_info.formData.forEach(item2 => {
									
									item2.formFields.forEach(item3 => {
										
										info += item3.label+'：'+item3.value+'，';
										
									});
									
								});
								
								arr.push({
									id: item.id,
									item_id: item.item_id,
									pid_data_page: item.pid_data_page,
									name: item.item_info.name,
									number: item.number,
									delete: 'false',
									info: info,
								});
								
							}

						});
						
						this.tabData = arr;

						this.loads.tabLoading = false;

					})
					.catch(function(error) {
						console.log(error);
					});

			},
			edit(obj, index) { //编辑规格名称

				if(!obj.editable) { //编辑

					this.inputVal = obj.name;

					if(this.old !== '') {
						this.title[this.old].editable = false;
					}

					this.old = index;

					obj.editable = true;

				} else { //保存

					if(obj.name !== this.inputVal) {

						this.loads.titleEditLoad = true;

						obj.name = this.inputVal;

						let info = {
							id: this.id,
							name: this.inputVal,
							id_tree_title: 6
						}

						this.$axios.post('items/purchase_edit', {
							data: null,
							info: JSON.stringify(info),
						})
						.then(response => {

							this.loads.titleEditLoad = false;

						})
						.catch(function(error) {
							console.log(error);
						});

					}

					obj.editable = false;

				}

				this.title = JSON.parse(JSON.stringify(this.title));

			},
			cancel(obj) { //取消
				obj.editable = false;
			},
			inputChange(ev) { //文本框数据改变时
				this.inputVal = ev.target.value;
			},
			getGoodsList(){//获取物品列表
				
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
			addGoods(name){//添加物品
				
				let data = [{
					id: '',
					pid_data_page: this.id,
					item_id: this.formModel.selectVal,
					number: this.formModel.needNumber,
					delete: "false"
				}];
				
				this.$refs[name].validate((valid) => {
					
                    if (valid) {
                    	
                    	this.$axios.post(this.editUrl, {
							data: JSON.stringify(data),
							info: null,
						})
						.then(response => {
							
							this.getTableData();//获取表格数据
							
							this.$Message.success('添加成功');
		
						})
						.catch(function(error) {
							console.log(error);
						});
                    	
                    }
                    
               });
				
			},

		},
		computed: { //计算属性

		},
		created() { //实例被创建完毕之后执行

			this.init(); //初始化

		},
		mounted() { //模板被渲染完毕之后执行

			this.getTableData(); //获取表格数据
			
			this.getGoodsList();//物品列表

		},
		watch: { //监测数据变化

		}
	}
</script>

<style scoped>

</style>