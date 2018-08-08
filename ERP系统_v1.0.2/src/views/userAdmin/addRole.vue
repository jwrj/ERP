<template>

	<div>
		
		<Card>
			
			<h1 slot="title">创建角色</h1>
			
			<div style="border-bottom: 1px solid #dddee1;padding:20px 16px 0;">
				<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="70" inline>
			        <FormItem label="角色名称" prop="name">
			            <Input type="text" clearable v-model="formInline.name" placeholder="角色名称"></Input>
			        </FormItem>
			        <Button type="primary" @click="addClick('formInline')">创建角色</Button>
			    </Form>
			</div>
			
		</Card>
		
		<Card style="margin-top:16px;">
			
			<h1 slot="title">角色列表</h1>
			
			<div style="padding:16px;">
				<table-module
					ref="tabInstance"
					:columns-list="columns"
					:dateScreen="false"
					
					DBnameDataPage="SysRole"
					tableDataUrl="system/page_list"
					componentEditType="roleEdit"
					editUrl="system/data_saveAll"
					delType="allPowerfulDel"
					DBname="SysRole"
				>
				</table-module>
			</div>
			
		</Card>
			
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
        	
        	columns:[
        		{
        			align:'center',
        			width:70,
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			title: '角色名',
                    key: 'name',
        		},
        		{
        			title: '权限',
                    key: 'authority_arr',
        		},
        		{
                	title: '操作',
                	align:'center',
                	width:120,
                	handle:['edit2','delete'],
                },
        	],
        	
        	formInline: {
                name: '',
            },
            
            ruleInline: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
            },
        	
        }
    },
    methods: {//方法
    	
    	addClick(name) {//创建
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
            		let data = [{
            			id: "",
            			name: this.formInline.name,
            			delete:"false",
            		}];
            		
            		this.$axios.post('system/data_saveAll', {
						data: JSON.stringify(data),
						DBname: "SysRole",
					})
					.then(response => {
						this.$refs.tabInstance.getDataList(this.$refs.tabInstance.stateInfo);//获取数据列表
						this.$Message.success('创建成功!');
					})
					.catch(function (error) {
						console.log(error);
					});
                    
                } else {
                    this.$Message.error('创建失败!');
                }
                
            })
            
        }
    	
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