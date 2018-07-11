<template>

	<div>
		
		<Card>
			
			<h1 slot="title">创建用户</h1>
			
			<div style="border-bottom: 1px solid #dddee1;padding:20px 16px 0;">
				<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="70">
					
			        <FormItem label="用户名" prop="userName">
			            <Input type="text" clearable v-model="formInline.userName" placeholder="用户名"></Input>
			        </FormItem>
			        
			        <FormItem label="密码" prop="passwd">
			            <Input type="password" v-model="formInline.passwd" placeholder="密码"></Input>
			        </FormItem>
			        
			        <FormItem label="确认密码" prop="passwdCheck">
			            <Input type="password" v-model="formInline.passwdCheck" placeholder="确认密码"></Input>
			        </FormItem>
			        
			    </Form>
			    <div style="text-align: center;margin-bottom:16px;">
			    	<Button type="primary" @click="addClick('formInline')">创建用户</Button>
			    </div>
			</div>
			
		</Card>
		
		<Card style="margin-top:16px;">
			
			<h1 slot="title">用户列表</h1>
			
			<div style="padding:16px;">
				<table-module
					ref="tabInstance"
					:columns-list="columns"
					:dateScreen="false"
					
					DBnameDataPage="SysUser"
					tableDataUrl="system/page_list"
					componentEditType="userEdit"
					editUrl="system/data_saveAll"
					delType="allPowerfulDel"
					DBname="SysUser"
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
    	const validatePass = (rule, value, callback) => {
                if (value === '') {
		        callback(new Error('请输入密码'));
		    } else {
		        if (this.formInline.passwdCheck !== '') {
		            // 对第二个密码框单独验证
		            this.$refs.formInline.validateField('passwdCheck');
		        }
		        callback();
		    }
		};
		const validatePassCheck = (rule, value, callback) => {
		    if (value === '') {
		        callback(new Error('请确认密码'));
		    } else if (value !== this.formInline.passwd) {
		        callback(new Error('密码不一致!'));
		    } else {
		        callback();
		    }
		};
        return {
        	
        	columns:[
        		{
        			align:'center',
        			width:100,
        			title: 'ID',
                    key: 'id',
        		},
        		{
        			title: '用户名',
                    key: 'userName',
        		},
        		{
        			title: '角色ID',
        			width:100,
        			align:'center',
                    render: (h, params) => {
                    	if(params.row.pid_sys_role == 0){
                    		return h('span',{
                    			style: {
                    				color: '#bbbec4',
                    			}
                    		},'无角色');
                    	}else if(params.row.isadmin == 1){
                    		return h('span',{
                    			style: {
                    				color: '#ed3f14',
                    			}
                    		},'最高权限');
                    	}else{
                    		return h('span',{
                    			style: {
                    				color: '#2d8cf0',
                    			}
                    		},params.row.pid_sys_role);
                    	}
                    }
        		},
        		{
                	title: '操作',
                	align:'center',
                	width:120,
                	handle: ['edit2','delete'],
                },
        	],
        	
        	formInline: {
                userName: '',
                passwd: '',
                passwdCheck: '',
            },
            
            ruleInline: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                passwd: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                passwdCheck: [
                    { required: true, validator: validatePassCheck, trigger: 'blur' }
                ],
            },
        	
        }
    },
    methods: {//方法
    	
    	addClick(name) {//创建
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
            		this.$axios.post('system/create_user', {
						userName: this.formInline.userName,
						passWord: this.formInline.passwd,
					})
					.then(response => {
						this.$refs.tabInstance.getDataList(this.$refs.tabInstance.stateInfo);//获取数据列表
						
						this.formInline = {//清空表单值
			                userName: '',
			                passwd: '',
			                passwdCheck: '',
			           	};
			           	
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