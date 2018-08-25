<template>

	<div>
		
		<new-form
			:pid-tree-class="6"
			:pageId="27"
			titleName="送货地址表单"
			buttonName="新增地址"
			@submitChange="submitChange"
		>
		
			<div style="padding:16px 0 0;border-bottom: 1px solid #e8eaec;">
				
    			<Form ref="formItem" :model="formItem" :rules="ruleItem" label-position="right" :label-width="100" inline>
    				
			        <FormItem label="地址名称" prop="name">
			            <Input v-model="formItem.name" style="width: 200px;" placeholder="请输入名称"></Input>
			        </FormItem>
			        
				</Form>
				
			</div>
		
		</new-form>
		
		<Card style="margin-top:16px;">
			
			<h1 slot="title">地址列表</h1>
			
			<div style="padding: 15px;">
				
				<!--如果出现两个表格组件路由会有同步现象-->
				<table-module
					ref="tabInstance"
					:columns-list="columns"
					:pageId="27"
					
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
                    { required: true, message: '请输入名称', trigger: 'blur' }
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