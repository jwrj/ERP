<template>
	
	<div>
		
		<Card>
			
			<h1 slot="title">添加物品</h1>
			
			<div style="padding:24px 15px 0;">
				
				<Form ref="addGoods" :model="addGoods" :rules="articleRules" inline>
						
					<FormItem prop="name">
						<AutoComplete
					        v-model="addGoods.name"
					        :clearable="true"
					        @on-search="autoData"
					        placeholder="输入物品名称"
					        style="width:300px;"
				        >
				        	<div>
				        		<h2 style="padding:0 6px 6px;border-bottom:1px solid #dddee1;">已有类似物品</h2>
					        	<ul style="max-height:200px;overflow: auto;padding:0 10px;">
					        		<li 
					        			v-for="item in autoDataList" 
					        			style="font-size:12px;padding:10px 0;display:flex;justify-content: space-between;border-bottom:1px dashed #dddee1;"
					        		>
					        			<p>{{item.name}}</p>
					        			<p style="color:#bbbec4;">库存{{item.extend_data[0].number}}</p>
					        		</li>
					        	</ul>
				        	</div>
				        </AutoComplete>
					</FormItem>
					
					<FormItem prop="classId">
						
						<Select style="width:160px" filterable v-model="addGoods.classId" placeholder="无数据">
					        <Option v-for="item in goodsClassList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
					    
					    <!--<Button type="dashed" icon="plus-round" @click="addSize('addGoods')">添加规格</Button>-->
					    
				    </FormItem>
					
				</Form>
				
				<div v-for="(item,i) in addSizeList">
					
					<Card style="margin-bottom:15px;">
						
						<div slot="title" style="display:flex;justify-content: space-between;align-items: center;">
							<h2 v-if="!item.editable">{{item.name}}</h2>
							<Input v-if="item.editable" :value="item.name" @on-change="inputChange" style="width:150px;"></Input>
							<div>
								<ButtonGroup shape="circle">
							        <Button type="ghost" shape="circle" :icon="item.editable ? 'checkmark-round' : 'edit'" @click="edit(item,i)"></Button>
							        <Button v-if="item.editable" type="ghost" shape="circle" icon="close-round" @click="cancel(item)"></Button>
							    </ButtonGroup>
							    <Button type="ghost" shape="circle" icon="trash-a" @click="delSize(item.id)"></Button>
							</div>
						</div>
						
						<div>
							<form-mod ref="modInstance" @increment="formEvent" :pid="Number(item.id)"></form-mod>
						</div>
						
					</Card>
					
				</div>
				
			</div>
			
			<div style="text-align: center;padding:15px;">
				<Button type="primary" @click="add('addGoods')">提交</Button>
			</div>
			
		</Card>
		
	</div>
	
</template>

<script>
	
import formMod from '@/components/form.vue';
	
export default {
	components:{//模板
		formMod,
	},
    data () {//数据
        return {
        	
        	goodsClassList: [],//物品分类数据列表
        	
        	addSizeList: [],//物品规格表单
        	
        	addGoods: {//表单值
        		name: '',
        		classId: '',
        	},
        	
        	articleRules:{//表单验证
				name:[
                    { required: true, message: '请输入物品名称', trigger: 'blur' }
                ],
				classId:[
                    { type: 'number', required: true, message: '请选择物品分类', trigger: 'change' }
                ],
			},
			
			autoDataList: [],//自动完成数据列表
			
			formDatas:[],//表单数据
			
			old:'',//旧的值
			
			inputVal:'',//input值
			
        }
    },
    methods: {//方法
    	
    	articleClass(){//物品分类数据列表
    		
    		this.$axios.post('system/treeTitle_list', {
    			
				pid_tree_class: 13,
				order: "id asc",
        		
			})
			.then(response => {
				
				response.data.forEach(item => {
					
					this.goodsClassList.push({
						label: item.name,
						value: item.id,
					});
					
				});
				
				if(response.data.length > 0){
					this.addGoods.classId = response.data[0].id;
				}
				
			})
			.catch(function (error) {
				console.log(error);
			});
				
    	},
    	
    	addSize(name){//添加物品规格
    		
    		this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                	this.$axios.post('system/formTable_add', {
		    			pid: 0,
		    			name: "规格",
		    			model: 1,
		    			add_type: 2,
					})
					.then(response => {
						
						this.addSizeList.push({
							name: response.data.name,
							id: response.data.id,
						});
						
						console.log(this.addSizeList);
						
					})
					.catch(function (error) {
						console.log(error);
					});
					
                }
                
            })
			
    	},
    	edit(obj,index){//编辑规格名称
    		
			if(!obj.editable){//编辑
				
				this.inputVal = obj.name;
				
				if(this.old !== ''){
					this.addSizeList[this.old].editable = false;
				}
				
				this.old = index;
				
				obj.editable = true;
				
			}else{//保存
				
				if(obj.name !== this.inputVal){
					
					obj.name = this.inputVal;
					
					this.$axios.post('system/formTable_edit', {
		        		id: obj.id,
		        		name: this.inputVal,
		        		edit_type: 2,
					})
					.then(response => {
						
					})
					.catch(function (error) {
						console.log(error);
					});
					
				}
				
				obj.editable = false;
				
			}
			
			this.addSizeList = JSON.parse(JSON.stringify(this.addSizeList));
			
    	},
    	cancel(obj){//取消
    		
    		obj.editable = false;
    		
    	},
    	delSize(id){//删除规格
    		
    		this.$axios.post('system/formTable_delete', {
        		id:id,
        		delete_type: 2,
			})
			.then(response => {
				
				this.addSizeList.forEach((item,index,arr) => {
					if(item.id == id){
						arr.splice(index,1);
					}
				});
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	inputChange(ev){//文本框数据改变时
    		this.inputVal = ev.target.value;
    	},
    	
    	
    	//====================================================
    	
        autoData(val){//自动完成
        	
        	if(val == ''){
        		this.autoDataList = [];
        	}else{
        		
	        	let where = {
	        		"name": ["like","%"+val+"%"],
	        		"pid_tree_class": ["=","13"]
	        	};
	        	
	        	this.$axios.post('items/item_list', {
	        		
	        		where: JSON.stringify(where),
				    pageSize: 10000,
				    order: '{"id":"asc"}'
				    
				})
				.then(response => {
					
					let arr = [];
					
					response.data.dataList.data.forEach(item => {
						arr.push(item);
					});
					
					this.autoDataList = arr;
					
				})
				.catch(function (error) {
					console.log(error);
				});
				
        	}
        	
			
        },
        //=====================================================
        formEvent(){//数据改变时
        	let arr = [];
        	this.$refs.modInstance.forEach(item => {
        		arr.push(...item.formDynamic.data)
        	});
        	this.formDatas = arr;
        },
        add(name) {//添加物品
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
		        	if(this.$refs.modInstance && this.$refs.modInstance.length > 0){//有规格
		        		
		        		let num1 = 0;
		        		
						let num2 = 0;
		        		
		        		this.$refs.modInstance.forEach((item) => {
							item.$refs.formDynamic.validate((valid) => {
								num1++;
								if(valid){
									num2++;
								}
					        })
			        	});
		        	
			        	if(num1 === num2){
			        		
			        		let fields = JSON.stringify(this.formDatas);//转字符串
		        			
			        		let dataFormTableIds = [];
			        		
			        		this.addSizeList.forEach(item => {
			        			dataFormTableIds.push(item.id);
			        		});
			        		
			        		let Ids = dataFormTableIds.join(',');
			        		
			        		let info = {
			        			name: this.addGoods.name,
			        			pid_tree_title: this.addGoods.classId,
			        			dataFormTable_ids: Ids,
			        			pid_tree_class: 13,
			        		}
			        		
			        		//=====================================================
			        		this.$axios.post('items/item_add', {
		        				fields: fields,
				        		info: JSON.stringify(info),
				        		number: 0,
							})
							.then((response) => {
								if(response.code === 1){
									this.addGoods.name = '';
									this.addSizeList = [];//清空临时数据
									this.formDatas = [];//清空临时数据
									
									this.$refs.tabInstance.getDataList(this.$refs.tabInstance.stateInfo);//获取数据列表
									
									this.$Message.success('添加成功!');
								}
							})
							.catch(error => {
								console.log(error);
							});
			        		
			        	}
		        		
		        	}else{//没有规格
		        		
		        		let info = {
		        			name:this.addGoods.name,
		        			pid_tree_title:this.addGoods.classId,
		        			dataFormTable_ids:"",
		        			pid_tree_class: 13,
		        		}
		        		
		        		this.$axios.post('items/item_add', {
			        		info:JSON.stringify(info),
			        		number: 0,
						})
						.then((response) => {
							if(response.code === 1){
								this.addGoods.name = '';
								this.$refs.tabInstance.getDataList(this.$refs.tabInstance.stateInfo);//获取数据列表
								this.$Message.success('添加成功!');
							}
						})
						.catch(error => {
							console.log(error);
						});
						
		        	}
		        	
                }
                
            });
            
        },
        
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	this.articleClass();//物品分类数据列表
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style>
</style>