<template>

	<div>
		
		<new-form
			:pid-tree-class="5"
			:pageId="2"
			titleName="新增客户"
			buttonName="新增客户"
			@submitChange="submitChange"
		>
			<div style="padding:16px 0 0;border-bottom: 1px solid #e8eaec;">
				
    			<Form ref="formItem" :model="formItem" :rules="ruleItem" label-position="right" :label-width="100" inline>
    				
			        <FormItem label="客户名称" prop="name">
			            <Input v-model="formItem.name" placeholder="输入客户名称" style="width: 300px;"></Input>
			        </FormItem>
			        
				</Form>
				
			</div>
			
		</new-form>
		
		<Card style="margin-top:16px;">
			
			<h1 slot="title">客户列表</h1>
			
			<div style="padding: 15px;">
				
				<!--如果出现两个表格组件路由会有同步现象-->
				<table-module
					ref="tabInstance"
					:columns-list="columns"
					:pageId="2"
					
					tableDataUrl="oa/customer_list"
					deleUrl="oa/customer_delete"
					showUrl="oa/customer_show"
					componentViewType="formView"
					componentEditType="formEdit"
				>
				</table-module>
				
			</div>
			
		</Card>
		
	</div>

</template>

<script>
	
import newForm from '@/components/new-form.vue';

import tableModule from '@/components/table-module.vue';
	
export default {
	components:{//模板
		newForm,
		tableModule,
	},
    data () {//数据
        return {
        	
        	formItem:{//名称表单值
				name: '',
			},
			
			ruleItem:{//表单判断
				name:[
                    { required: true, message: '请输入客户名称', trigger: 'blur' }
                ],
			},
			
			columns:[
        		{
        			align:'center',
        			width:70,
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			title: '名称',
                    key: 'name',
                    editable: true,
        		},
        		{
        			
        			title: '日期',
                    key: 'create_time',
        		},
        		{
                	title: '操作',
                	align:'center',
                	width:150,
                	handle:['edit2','details','delete'],
                },
        	],
			
        }
    },
    methods: {//方法
    	submitChange(){
			this.$refs.tabInstance.getDataList(this.$refs.tabInstance.stateInfo);//获取数据列表
    	},
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
</style>