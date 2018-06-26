<template>
	
	<div>
		
		<Card>
			
			<h1 slot="title">添加物品</h1>
			
			<div style="padding:16px;">
				
				<Form ref="formItem" :model="formItem" :rules="ruleItem" :label-width="70">
						
					<FormItem prop="name" label="物品名称">
						<AutoComplete
					        v-model="formItem.name"
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
					
					<FormItem prop="classId" label="物品分类">
						
						<Select style="width:160px" filterable v-model="formItem.classId" placeholder="无数据">
					        <Option v-for="item in goodsClassList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
					    
				    </FormItem>
					
					<FormItem label="物品规格">
						
						<Checkbox v-model="formsShow"></Checkbox>
						
				    </FormItem>
				    
				</Form>
				
			</div>
			
			<div style="text-align: center;padding-bottom:16px;" v-if="!formsShow">
				<Button type="primary" @click="add('formItem')">新增物品</Button>
			</div>
			
		</Card>
		
		<new-form
			style="margin-top:4px;"
			v-if="formsShow"
			:pid-tree-class="26"
			:pageId="52"
			titleName="规格"
			buttonName="新增物品"
			:parentInfo="{ name: formItem.name, pid_tree_title: formItem.classId, pid_tree_class: 13, }"
			submitUrl="items/item_add"
			@submitChange="submitCallBack"
		>
		</new-form>
		
		<goods-list ref="goodsInstance" style="margin-top:16px;"></goods-list>
		
	</div>
	
</template>

<script>

import newForm from '@/components/new-form.vue';

import goodsList from '@/views/goodsAdmin/goodsList.vue';

export default {
	components:{//模板
		newForm,
		goodsList,
	},
    data () {//数据
        return {
        	
        	goodsClassList: [],//物品分类数据列表
        	
        	formItem: {//表单值
        		name: '',
        		classId: '',
        	},
        	
        	ruleItem: {//表单验证
				name: [
                    { required: true, message: '请输入物品名称', trigger: 'blur' }
                ],
				classId: [
                    { type: 'number', required: true, message: '请选择物品分类', trigger: 'change' }
                ],
			},
			
			autoDataList: [],//自动完成数据列表
			
			formsShow: false,//规格显示
			
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
					this.formItem.classId = response.data[0].id;
				}
				
			})
			.catch(function (error) {
				console.log(error);
			});
				
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
        
        add(name) {//添加物品
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
	        		let info = {
	        			name:this.formItem.name,
	        			pid_tree_title:this.formItem.classId,
	        			pid_tree_class: 13,
	        		}
	        		
	        		this.$axios.post('items/item_add', {
		        		info:JSON.stringify(info),
					})
					.then((response) => {
						if(response.code === 1){
							this.formItem.name = '';
							this.$refs.goodsInstance.$refs.tabInstance.getDataList(this.$refs.goodsInstance.$refs.tabInstance.stateInfo);//获取数据列表
							this.$Message.success('添加成功!');
						}
					})
					.catch(error => {
						console.log(error);
					});
						
                }
                
            });
            
        },
        
        submitCallBack(){//提交回调
			this.$refs.goodsInstance.$refs.tabInstance.getDataList(this.$refs.goodsInstance.$refs.tabInstance.stateInfo);//获取数据列表
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