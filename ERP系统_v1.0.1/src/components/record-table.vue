<template>

	<Card>
		
		<div slot="title" style="display:flex;align-items: center;justify-content: space-between;">
			
			<h2>记录列表</h2>
			
			<Button type="dashed" size="small" shape="circle" @click="modal = true" icon="plus-round"></Button>
			
		</div>
		
		<div style="padding:10px;">
			
			<Table border :columns="columns" :data="data"></Table>
		
		</div>
		
		<Modal
        v-model="modal"
        title="添加纪录"
	    >
	        <div>
	        	<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="82">
	        		
			        <FormItem label="环节完成量" prop="number2">
			            <Input type="text" v-model="formInline.number2" placeholder="输入数量"></Input>
			        </FormItem>
			        
			        <FormItem label="环节废品量" prop="number3">
			            <Input type="text" v-model="formInline.number3" placeholder="输入数量"></Input>
			        </FormItem>
			        
			    </Form>
	        </div>
	        <div slot="footer">
	            <Button type="ghost" @click="modal = false">取消</Button>
	            <Button type="primary" @click="addRecord">确定</Button>
	        </div>
	    </Modal>
		
	</Card>
	
</template>

<script>
export default {
	components:{//模板
		
	},
	props:{
		
		pidDataPage: Number,
		
		itemId: Number,
		
		pidStepId: Number,
		
	},
    data () {//数据
        return {
        	
        	columns: [
        		{
        			align: 'center',
        			width: 100,
                    title: 'ID',
                    key: 'id'
                },
        		{
                    title: '环节完成量',
                    key: 'number2'
                },
        		{
                    title: '环节废品量',
                    key: 'number3'
                },
        		{
                    title: '日期',
                    key: 'create_time'
                },
        	],
        	
        	data:[],
        	
        	modal: false,
        	
        	formInline: {
        		number2: '',
        		number3: '',
        	},
        	
        	ruleInline: {
                number2: [
                    { required: true, message: '请输入环节完成量', trigger: 'blur' }
                ],
                number3: [
                    { required: true, message: '请输入环节废品量', trigger: 'blur' }
                ]
           },
        	
        }
    },
    methods: {//方法
    	
    	tabelData(){//表格数据
    		
    		let where = {
    			pid_data_page: ["=",this.pidDataPage],
    			item_id: ["=",this.itemId],
    			pid_step_id: ["=",this.pidStepId]
    		};
    		
    		this.$axios.post('system/page_list', {
    			where: JSON.stringify(where),
    			page: 1,
    			pageSize: 20000,
    			order: '{"id":"asc"}',
    			DBname_dataPage: 'ExtendProduceHistory'
			})
			.then(response => {
				this.data = response.data.dataList.data;
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	addRecord(){//添加纪录
			
			this.$refs['formInline'].validate((valid) => {
				
                if (valid) {
                	
                	let data = {
						pid_data_page: this.pidDataPage,
						item_id: this.itemId,
						pid_step_id: this.pidStepId,
						number2: this.formInline.number2,
						number3: this.formInline.number3,
					}
					
					this.$axios.post('orders/produce_history_add', {
		    			data: JSON.stringify(data),
					})
					.then(response => {
						this.tabelData();//表格数据
						this.modal = false;
					})
					.catch(function (error) {
						console.log(error);
					});
					
					if(this.pidStepId == 33){
						
						let info = {//采购订单信息
			                		
							name: this.$route.query.name+'领料出库',
							
							pid_tree_title: 32,
							
							pid_tree_class: 10,
							
						}
						
						let data = [{
				                			
                			item_id: this.itemId,//物品ID
                			
                			type_pid_tree_title: 45,//入库形式
                			
                			action_type: 2,//2出库/1入库
                			
							number: this.formInline.number2,//数量
							
							action_time: '',//日期
							
							desc: '',//描述
							
                		}];
						
						this.$axios.post('items/warehousing_add', {
			    			data: JSON.stringify(data),
			    			info: JSON.stringify(info),
						})
						.then(response => {
							this.$Message.success('出库成功!');
						})
						.catch(function (error) {
							console.log(error);
						});
						
					}
                	
                    this.$Message.success('添加成功!');
                }
                
            });
			
    	},
    	
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	this.tabelData();//表格数据
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
</style>