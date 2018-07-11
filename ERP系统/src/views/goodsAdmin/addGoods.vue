<template>
	
	<div>
		
		<Card>
			
			<div slot="title" style="display:flex;align-items: center;justify-content: space-between;">
				<h1>操作/选择</h1>
				<Button size="small" type="primary" @click="configurationShow = true">点击打开物品配置表</Button>
			</div>
			
			<div style="padding:16px;">
				
				<span style="margin-right:10px;font-size: 12px;">选择添加类型</span>
				
				<RadioGroup v-model="addType">
			        <Radio :label="0">
			            <span>单个添加</span>
			        </Radio>
			        <Radio :label="1">
			            <span>批量添加</span>
			        </Radio>
			    </RadioGroup>
			
			</div>
			
		</Card>
		
		<Card v-if="addType == 0" style="margin-top:2px;">
			
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
				
				<div style="text-align: center;" v-if="!formsShow">
					<Button type="primary" @click="add('formItem')">新增物品</Button>
				</div>
				
			</div>
			
		</Card>
		
		<new-form
			style="margin-top:2px;"
			v-if="formsShow && addType == 0"
			:pid-tree-class="26"
			:pageId="52"
			titleName="规格"
			buttonName="新增物品"
			:parentInfo="{ name: formItem.name, pid_tree_title: formItem.classId, pid_tree_class: 13, }"
			submitUrl="items/item_add"
			@submitChange="submitCallBack"
		>
		</new-form>
		
		<batch-add-goods @submitSucceed="submitChange" v-if="addType == 1" style="margin-top:2px;"></batch-add-goods>
		
		<goods-list ref="goodsInstance" style="margin-top:16px;"></goods-list>
		
		
		<Modal
    		v-model="configurationShow"
    		width="80%"
    	>
	    	<p slot="header">配置</p>
	    	
	    	<div>
	    		
	    		<configuration v-if="configurationShow"></configuration>
	    		
	    	</div>
	    	
	    	<div slot="footer">
	        	
	        	<Button @click="configurationShow = false">关闭</Button>
	        	
	        	<Button type="primary" @click="updateCallBack">更新物品列表</Button>
	        	
	        </div>
	    	
	    </Modal>
		
	</div>
	
</template>

<script>

import newForm from '@/components/new-form.vue';

import goodsList from '@/views/goodsAdmin/goodsList.vue';

import batchAddGoods from '@/views/goodsAdmin/batchAddGoods.vue';

import configuration from '@/views/goodsAdmin/configuration.vue';

export default {
	components:{//模板
		newForm,
		goodsList,
		batchAddGoods,
		configuration,
	},
    data () {//数据
        return {
        	
        	configurationShow: false,
        	
        	addType: 0,
        	
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
        //==========================================
        
        submitChange(){//批量添加成功回调
			this.$refs.goodsInstance.$refs.tabInstance.getDataList(this.$refs.goodsInstance.$refs.tabInstance.stateInfo);//获取数据列表
        },
        submitCallBack(){//提交回调
			this.$refs.goodsInstance.$refs.tabInstance.getDataList(this.$refs.goodsInstance.$refs.tabInstance.stateInfo);//获取数据列表
        },
        updateCallBack(){//弹窗更新回调
        	
        	this.configurationShow = false;
        	
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