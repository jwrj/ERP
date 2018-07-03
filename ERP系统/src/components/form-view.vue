<template>
	
	<div ref="instance" style="position: relative;">
		
		<Spin fix v-show="loading.pageLoad"></Spin>
		
		<div v-for="item in dataList">
			
			<Card>
				
				<div slot="title">
					
					<h1>{{item.name}}</h1>
					
				</div>
				
				<div style="padding:0 15px 15px 15px;">
				
					<!--其他页面数据-->
					<div v-for="client in item.usDataPageList" style="margin-top:15px;">
						
						<Card>
							
							<div slot="title">
								
								<h2>{{client.name}}</h2>
								
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
					<!--其他页面数据-->
					
					<!--物品列表-->
					<Card v-if="item.itemsList && item.itemsList.length > 0" style="margin-top:15px;">
						
						<h2 slot="title">物品列表</h2>
						
						<!--默认显示-->
						<div v-if="$route.name != 'billEdit-1' && $route.name != 'delivergoodsList' && $route.name != 'pickingList'" style="padding: 15px;">
							
							<Table border :columns="goodsColumns" :data="item.itemsList"></Table>
							
						</div>
						<!--默认显示-->
						
						<!--发货单显示-->
						<div v-if="$route.name == 'delivergoodsList'" style="padding: 15px;">
							
							<Table border :columns="goodsColumns3" :data="item.itemsList"></Table>
							
						</div>
						<!--发货单显示-->
						
						<!--领料单显示-->
						<div v-if="$route.name == 'pickingList'" style="padding: 15px;">
							
							<Table border :columns="goodsColumns4" :data="item.itemsList"></Table>
							
						</div>
						<!--发货单显示-->
						
						<!--财务显示-->
						<div v-if="$route.name == 'billEdit-1'" style="padding: 15px;">
							
							<Table border :columns="goodsColumns2" :data="item.itemsList" @on-selection-change="tableChange"></Table>
							
							<h2 style="position:relative;text-align:center;padding:10px;margin-top:-1px;border:1px solid #dddee1;">
								<Spin size="small" fix v-if="loading.spinShow"></Spin>
								总货款：<span style="color:#ed3f14;" v-if="sumPriceIo">{{Number(sumPrice[0]).toFixed(2)}}</span>
								元
							</h2>
							
							<div style="padding:10px 0;">
								<Button type="primary" icon="edit" size="small" @click="batchModify">批量修改</Button>
							</div>
							
						</div>
						<!--财务显示-->
						
					</Card>
					<!--物品列表-->
					
					<!--附加表单数据-->
					<div v-for="main in item.title" style="margin-top:15px;">
						
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
					<!--附加表单数据-->
				
				</div>
				
			</Card>
			
		</div>
			
	</div>
	
</template>

<script>
	
	import formMod from '@/components/form.vue';
	
	import bus from '../../static/public/js/eventBus.js';//中央事件总线
	
	export default {
		components:{//模板
			formMod,
		},
		props:{
			
			formViewId: {//订单id
				type: Number,
			},
			
			showUrl: {//数据接口
				type: String,
				default: 'system/page_show'
			},
			
		},
		data(){
			return{
				
				loading:{//加载效果
					pageLoad:false,
					spinShow:false,
				},
				
				dataList:[],//所有数据列表
				
				useDataPageIds: [],//别的页面数据信息
				
				sumPrice: [],//总金额
				
				sumPriceIo: false,//显示
				
				//==================默认数据======================
				goodsColumns: [//物品表头数据
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
						key: 'number',
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
				
				//==================发货单数据======================
				goodsColumns3: [//物品表头数据
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
						title: '发货数量',
						key: 'number',
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
				
				//==================发货单数据======================
				goodsColumns4: [//物品表头数据
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
						title: '领料数量',
						key: 'number',
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
				
				//====================财务数据================================
				
				tableSelectData: [],//表格当前勾选中的数据
				
				modificationList: [],//表格修改列表
				
				goodsColumns2: [//物品表头数据
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
						key: 'number',
					},
					{
						width: 160,
						align: 'center',
						title: '单价(元)',
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
		                                    value: currentRow2.price,
		                                    placeholder:'请输入' + params.column.title
		                                },
		                                on: {
		                                    'on-change' (event) {
		                                    	currentRow2.price = event.target.value;
		                                    }
		                                }
		                            });
		    					}
    						}else{
    							return h('span',params.row.price);
    						}
						}
					},
					{
						align: 'center',
						title: '小计(元)',
						render: (h, params) => {
							
							let num = params.row.number;
							
							let price = Number(params.row.price);
							
							let sum = (num*10) * (price*10) / 100;
							
							this.sumPrice[params.index] = sum;
							
							if(params.index > 0){
								
								function floatAdd(arg1,arg2){//解决精度问题
								     var r1,r2,m;    
								     try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
								     try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
								     m=Math.pow(10,Math.max(r1,r2));
								     return (arg1*m+arg2*m)/m;   
								}
								
								this.sumPrice[0] = floatAdd(this.sumPrice[0],this.sumPrice[params.index]);
								
							}
							
							return h('span',sum.toFixed(2))
						},
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
			getTitleList(id){//获取数据
				
				this.loading.pageLoad = true;
				
				this.$axios.post(this.showUrl, {
					id:id,
				})
				.then(response => {
					
					this.$emit('elseFormId',response.data.dataFormTable_id2);//侦测用到的其他表单ID（如：回款记录下用到）
					
					let arr = [];
					
					arr.push({
						
						id: response.data.id,
						name: response.data.name,
						title: response.data.formData,
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
					
					this.useDataPageIds[0] = response.data.pid_tree_title;//数据所属的树标题id
					
					this.useDataPageIds[1] = response.data.id;//数据页自己的id
					
					bus.$emit('viewWatch',this.useDataPageIds);//触发器
					
					this.loading.pageLoad = false;
					
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			
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
	        batchModify(){//批量修改
	       		
	       		let arr = [];
	       		
	       		this.modificationList.forEach(item => {
	       			
	       			this.tableSelectData.forEach(item2 => {
		       			
		       			if(item.id == item2.id){
		       				arr.push({
		       					id: item.id,
		       					price: item.price,
		       					delete: "false",
		       				});
		       			}
		       			
		       		})
	       			
	       		});
	       		
	       		if(arr.length > 0){
	       			
	       			this.sumPriceIo = false;
	       			
	       			this.loading.spinShow = true;
	       			
	       			this.$axios.post('system/data_saveAll', {
    					data: JSON.stringify(arr),
    					DBname: "ExtendOrder",
					})
					.then(response => {
						
						this.tableSelectData = [];
						
						this.getTitleList(this.formViewId);//获取数据
						
						setTimeout(() => {
							this.sumPriceIo = true;
							this.loading.spinShow = false;
						},1000);
						
						this.$parent.$parent.$parent.getDataList(this.$parent.$parent.$parent.stateInfo);
						
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
		computed:{//计算属性
			
    	},
		mounted(){//模板被渲染完毕之后执行
			
			this.sumPriceIo = true;
			
			this.formViewId ? this.getTitleList(this.formViewId) : '';//获取数据
			
		},
		watch:{//监测数据变化
		},
	}
</script>

<style scoped>
</style>