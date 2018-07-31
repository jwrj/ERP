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
					
					<!--物品列表-->
					<Card v-if="item.itemsList && item.itemsList.length > 0" style="margin-top:15px;">
						
						<h2 slot="title">物品列表</h2>
						
						<!--公共-->
						<div v-if="showTabelType.All" style="padding: 16px;">
							
							<Table
							border
							:columns="showTabelType.columnsList"
							:data="item.itemsList"
							>
							</Table>
							
						</div>
						
						<!--财务显示-->
						<div v-if="showTabelType.C" style="padding: 15px;">
							
							<Table border :columns="showTabelType.columnsList" :data="item.itemsList" @on-selection-change="tableChange"></Table>
							
							<h2 style="position:relative;text-align:center;padding:10px;margin-top:-1px;border:1px solid #dddee1;">
								<Spin size="small" fix v-if="loading.spinShow"></Spin>
								总货款：<span style="color:#ed3f14;" v-if="sumPriceIo">{{Number(sumPrice[0]).toFixed(2)}}</span>
								元
							</h2>
							
							<div style="padding:10px 0;">
								<Button type="primary" icon="edit" size="small" @click="batchModify">批量修改</Button>
							</div>
							
						</div>
						
					</Card>
					
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
				
				columnsAll: [//公共数据
					{
						width:70,
						align: 'center',
						fixed: 'left',
						title: 'ID',
						key: 'id',
					},
					{
						width:80,
						align: 'center',
						fixed: 'left',
						title: '物品ID',
						key: 'item_id',
					},
					{
						minWidth:160,
	        			ellipsis: true,
	        			fixed: 'left',
						title: '物品名称',
						render: (h, params) => {
							return h('span',params.row.item_info.name)
						},
					},
					{
						width: 100,
						fixed: 'left',
						title: '需求数量',
						key: 'number',
						differ: true,
					},
				],
				
				//====================财务数据================================
				
				tableSelectData: [],//表格当前勾选中的数据
				
				modificationList: [],//表格修改列表
				
				financeColumns: [//物品表头数据
					{
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'center',
                    },
					{
						width:70,
						align: 'center',
						fixed: 'left',
						title: 'ID',
						key: 'id',
					},
					{
						width:80,
						align: 'center',
						fixed: 'left',
						title: '物品ID',
						key: 'item_id',
					},
					{
						minWidth:160,
	        			ellipsis: true,
	        			fixed: 'left',
						title: '物品名称',
						render: (h, params) => {
							return h('span',params.row.item_info.name)
						},
					},
					{
						width: 100,
						title: '需求数量',
						fixed: 'left',
						key: 'number',
					},
					{
						width: 120,
						fixed: 'left',
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
						width: 120,
						fixed: 'left',
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
	       	
	       	//=====================表头显示规格============================
		
			formatData( _ajaxData, _columns, place = +0 ){//_ajaxData:ajax返回的数组,也是表格主体要遍历的数据, _columns:原始表头 ,place:插入位置，默认位置为未尾部（从元素后面倒数插入）
	
				//先拿到所有字段和值----------------------------------------------------
				let itemArr = _ajaxData;//原始的物品数组
				// console.log(itemArr);
				
				let allFields = [];//去掉无关字段后的原始物品数组
				for(let i=0;i<itemArr.length;i++){
					let item = itemArr[i].item_info;//item=一项物品
					for(let p=0;p<item.formData.length;p++){
						let ff = item.formData[p].formFields;//ff=物品的一个表单的字段数组
						for(let t=0;t<ff.length;t++){
							allFields.push({
								hid:itemArr[i].id,
								id:ff[t].id,
								label:ff[t].label,
								value:ff[t].value,
							});
						}
					}
				}
	
				//对数组进行去重
				let finalArr = [];//finalArr是去重后的数组
				for(let i=0;i<allFields.length;i++){
					let fined = false;
					for(let p=0;p<finalArr.length;p++){
						if(finalArr[p].label==allFields[i].label){
							fined = true;
							break;
						}
					}
					if(!fined){
						finalArr.push(allFields[i]);
					}
					
				}
	
				//-------------------------------------------
				//动态产生表头
				
				let newColumns = [];
				
				newColumns.push(..._columns);
				
				for(let i=0;i<finalArr.length;i++){
					let h = {
						minWidth: 140,
						title:finalArr[i].label,
						key:'f'+finalArr[i].id,
					}
					newColumns.splice(_columns.length-(place) , 0, h );
				}
	
				//重新加入数据
				
				for(let i=0;i<_ajaxData.length;i++){//重复执行给data1插入新数据
					
					let d = _ajaxData[i];
					
					finalArr.forEach(item => {
						_ajaxData[i]['f'+ item.id ] = '- -';
					});
					
					for(let p=0;p<allFields.length;p++){//遍历新增的表头
						let af = allFields[p];
						if( d.id == af.hid  ){//从allFields找出属于这一行数据的
							
							for(let t=0;t<finalArr.length;t++){
								if( af.label == finalArr[t].label  ){
									_ajaxData[i]['f'+ finalArr[t].id  ] = af.value || '- -';
								}
							}					
	
						}
						
					}					 
	
				}
	
				//=================================================
	
				return {data: _ajaxData, columns: newColumns}
	
			},
			
		},
		computed:{//计算属性
			
			showTabelType(){
				
				let _columnsList = [];
				
				let _tabelList = [];
				
				let title = '';
				
				let [_All,_C] = [false,false];
				
				let def = (this.$route.name != 'billEdit-1')
						&& (this.$route.name != 'delivergoodsList') 
						&& (this.$route.name != 'pickingList') 
						&& (this.$route.name != 'warehouseList');
				
				if(def){//默认显示
					
					_All = true;
					
					title = '需求数量';
					
				}else if(this.$route.name == 'delivergoodsList'){//发货单显示
					
					_All = true;
					
					title = '发货数量';
					
				}else if(this.$route.name == 'pickingList'){//领料单显示
					
					_All = true;
					
					title = '领料数量';
					
				}else if(this.$route.name == 'warehouseList'){//入库显示
					
					_All = true;
					
					title = '入库数量';
					
				}else if(this.$route.name == 'billEdit-1'){//财务显示
					
					_C = true;
					
					let newData = this.formatData( this.dataList[0].itemsList, this.financeColumns );
					
					_columnsList = newData.columns;
					
					_tabelList = newData.data;
					
				}else{
					
				}
				
				if(!_C){//公共的
					
					this.columnsAll.forEach(item => {
						if(item.differ){
							item.title = title;
						}
					});
					
					let newData = this.formatData( this.dataList[0].itemsList, this.columnsAll );
					
					_columnsList = newData.columns;
					
					_tabelList = newData.data;
					
				}
				
				return { All: _All, C: _C, columnsList: _columnsList, tabelList: _tabelList };
				
			},
			
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