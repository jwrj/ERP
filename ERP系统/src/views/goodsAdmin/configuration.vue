<template>

	<div>
		
		<Card>
			
			<h1 slot="title">成品列表</h1>
			
			<div style="padding:16px;">
				
				<Table border :columns="columns1" :data="data1"></Table>
			
				<div style="padding:16px 0;display:flex;">
					<Page style="margin-left: auto;" show-total :page-size="pageSize" :current="current" :total="total" @on-change="pageChange"></Page>
				</div>
				
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
	            <Button type="primary" @click="submit">提交</Button>
	            <Button @click="close">关闭</Button>
	        </div>
	    </Modal>
	    <!--弹窗选数据-->
	    
	    <Modal v-model="modalShow2" width="80%">
	    	
	    	<p slot="header">配件列表</p>
	        <div>
	        	<Table border :columns="columns2" :data="data2"></Table>
	        </div>
	        <div slot="footer">
	            <Button @click="modalShow2 = false">关闭</Button>
	        </div>
	    	
	    </Modal>
			
	</div>
	
</template>

<script>
	
import tableModule from '@/components/table-module.vue';
	
export default {
	components:{//模板
		tableModule,
	},
	props:{
		
	},
    data () {//数据
        return {
        	
        	modalShow: false,
        	
        	modalShow2: false,
        	
        	partsList: [],//配置ID集合
        	
        	columns1: [
        		{
        			align:'center',
        			width:100,
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			title: '物品名称',
                    key: 'name',
        		},
        		{
        			title: '配置ID',
                    render: (h, params) => {
                    	return h('div',params.row.extend_data[0].parts);
                    }
        		},
        		{
        			align:'center',
        			width:180,
        			title: '操作',
        			render: (h, params) => {
        				
        				let _this = this;
        				
        				return h('div',[
        				
        					h('Button',{
	        					props: {
	                                type: 'primary',
	                                size: 'small'
	                           },
	                           on: {
	                           		click(){
	                           			_this.configurationID = params.row.id;
	                           			_this.configurationName = params.row.name;
	                           			_this.modalShow = true;
										
//										_this.$refs.tabInstance.submitSucceed();//提交成功后勾选功能数据还原
										_this.showSelect(params.row.extend_data[0].parts);//显示以勾选的数据
										
	                           		}
	                           }
	        				},'设置配件'),
	        				
        					h('Button',{
	        					props: {
	                                type: 'success',
	                                size: 'small',
	                                disabled: params.row.extend_data[0].parts ? false : true,
	                           },
	                           style: {
	                           		marginLeft: '4px',
	                           },
	                           on: {
	                           		click(){
	                           			
	                           			_this.modalShow2 = true;
	                           			
	                           			_this.showConfiguration(params.row.extend_data[0].parts);
	                           			
	                           		}
	                           }
	        				},'查看配件')
        				
        				]);
        				
                   }
        		},
        	],
        	
        	data1: [],
        	
        	//=============================================
        	
        	columns: [
        		{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
        		{
        			align:'center',
        			width:100,
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
        			title: '库存数',
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
        	
        	//=========================================================
        	
        	columns2: [
        		{
        			align:'center',
        			width:100,
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			title: '物品名称',
                    key: 'name',
        		},
        	],
        	
        	data2: [],
        	
        	//================================================
        	
        	configurationID: '',
        	
        	configurationName: '',
        	
        	seleData: [],
        	
        	total: 0,
        	
        	pageSize: 0,
        	
        	current: 1,
        	
        }
    },
    methods: {//方法
    	
    	getTabelData(current_page){//获取成品列表
    		
    		this.$axios.post('items/item_list', {
    			where: '{ "pid_tree_title": ["=",24] }',
    			page: current_page,
    			pageSize: 10,
    			order:'{"id":"desc"}',
			})
			.then(response => {
				
				this.total = response.data.dataList.total;
				
				this.pageSize = Number(response.data.dataList.per_page);
				
				this.data1 = response.data.dataList.data;

			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	selectAlter(data){//勾选发生改变时
    		
    		this.seleData = data;
    		
    		console.log(this.seleData);
    		
    	},
    	submit(){//提交配置
    		
    		let info = {
    			id: this.configurationID,
    			name: this.configurationName,
    		};
    		
    		let arr = [];
    		
    		this.seleData.forEach(item => {
    			
    			if(item._checked){
    				
    				arr.push(item.id);
    				
    			}
    			
    		})
    		
    		this.$axios.post('items/item_edit', {
    			info: JSON.stringify(info),
    			number: 0,
    			parts: arr.join(','),
			})
			.then(response => {
				
				this.getTabelData(this.current);//获取成品列表
				
				this.modalShow = false;
				
			})
			.catch(function (error) {
				console.log(error);
			});
    		
    	},
    	close(){//关闭配置
    		
    		this.modalShow = false;
    		
    	},
    	showConfiguration(str){//点击查看配置
    		
    		let where = ["or"];
    		
    		this.data2 = [];
    		
    		if(str){
    			
   				let partsList = str.split(',');
   				
	    		partsList.forEach(item => {
	    			
	    			where.unshift(["=",item]);
	    			
	    		})
	    		
	    		this.$axios.post('items/item_list', {
	    			where: '{ "id": '+ JSON.stringify(where) +' }',
	    			page: 1,
	    			pageSize: 99999,
				})
				.then(response => {
					
					this.data2 = response.data.dataList.data;
					
				})
				.catch(function (error) {
					console.log(error);
				});
				
   			}
    		
    	},
    	showSelect(str){//显示以勾选的数据
    		
    		let where = ["or"];
    		
    		this.$refs.tabInstance.checkedData = [];
    		
    		this.$refs.tabInstance.selectedNum = 0;//已选条数
    		
    		if(str){
    			
   				let partsList = str.split(',');
   				
	    		partsList.forEach(item => {
	    			
	    			where.unshift(["=",item]);
	    			
	    		})
	    		
	    		this.$axios.post('items/item_list', {
	    			where: '{ "id": '+ JSON.stringify(where) +' }',
	    			page: 1,
	    			pageSize: 99999,
				})
				.then(response => {
					
					response.data.dataList.data.forEach(item => {
						item._checked = true;
					})
					
					this.$refs.tabInstance.checkedData = response.data.dataList.data;
					
					this.$refs.tabInstance.stateInfo.page = 1;
					
					this.$refs.tabInstance.setRoutePara();
					
					this.$refs.tabInstance.getDataList(this.$refs.tabInstance.stateInfo);
					
				})
				.catch(function (error) {
					console.log(error);
				});
				
   			}else{
   				
   				this.$refs.tabInstance.stateInfo.page = 1;
				
				this.$refs.tabInstance.setRoutePara();
   				
   				this.$refs.tabInstance.getDataList(this.$refs.tabInstance.stateInfo);
   				
   			}
    		
    		
    	},
    	pageChange(currentPage){//页码发生改变时
    		
    		this.current = currentPage;
    		
    		this.getTabelData(currentPage);//获取成品列表
    		
    	},
    	
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	
    	this.getTabelData(this.current);//获取成品列表
    	
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
</style>