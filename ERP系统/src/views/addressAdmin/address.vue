<template>

	<div>
		
		<Card style="margin-bottom:15px;">
			<div style="padding:24px 16px 0;">
				
    			<Form ref="formItem" :model="formItem" :rules="ruleItem" label-position="right" :label-width="46" inline>
    				
			        <FormItem label="名称" prop="name">
			            <Input v-model="formItem.name" style="width: 160px;" placeholder="请输入名称"></Input>
			        </FormItem>
			        
				</Form>
				
			</div>
		</Card>
		
		<new-form
			:pid-tree-class="6"
			:pageId="27"
			titleName="送货地址表单"
			buttonName="添加送货地址"
		>
		</new-form>
		
	</div>

</template>

<script>
	
import newForm from '@/components/new-form.vue';
	
export default {
	components:{//模板
		newForm,
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
			
        }
    },
    methods: {//方法
    	
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