<template>

	<div>
		
		<Card>
			
			<Table border :columns="columns1" :data="data1"></Table>
			
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
	            <Button type="primary" @click="submit">确定配置</Button>
	            <Button @click="close">关闭</Button>
	        </div>
	    </Modal>
	    <!--弹窗选数据-->
	    
	    <Modal v-model="modalShow2" width="80%">
	    	
	    	<p slot="header">配置列表</p>
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
        	
        	partsList: [],
        	
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
                    	console.log();
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
	                           		}
	                           }
	        				},'点击配置'),
	        				
        					h('Button',{
	        					props: {
	                                type: 'success',
	                                size: 'small'
	                           },
	                           style: {
	                           		marginLeft: '4px',
	                           },
	                           on: {
	                           		click(){
	                           			
	                           			let str = params.row.extend_data[0].parts;
	                           			
	                           			if(str){
	                           				_this.partsList = str.split(',');
	                           			}
	                           			
	                           			_this.modalShow2 = true;
	                           		}
	                           }
	        				},'查看配置')
        				
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
        			width:70,
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
        			title: '物品其它信息',
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
        		
        	],
        	
        	data2: [],
        	
        	//================================================
        	
        	configurationID: '',
        	
        	configurationName: '',
        	
        	seleData: [],
        	
        }
    },
    methods: {//方法
    	
    	getTabelData(){//获取成品列表
    		
    		this.$axios.post('items/item_list', {
    			where: '{ "pid_tree_title": ["=",24] }',
    			page: 1,
    			pageSize: 10,
			})
			.then(response => {
				
				this.data1 = response.data.dataList.data

			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	selectAlter(data){//勾选发生改变时
    		
    		this.seleData = data;
    		
    	},
    	submit(){
    		
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
				
				this.modalShow = false;
				
			})
			.catch(function (error) {
				console.log(error);
			});
    		
    	},
    	close(){
    		
    		this.modalShow = false;
    		
    	},
    	showConfiguration(){
    		
    		this.partsList
    		
    	},
    	
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	
    	this.getTabelData();//获取成品列表
    	
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
</style>