<template>

	<div>
		
		<Card>
			
			<h1 slot="title">修改用户信息</h1>
			
			<div style="border-bottom: 1px solid #dddee1;padding:20px 16px 0;">
				<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="70">
					
			        <FormItem label="用户名" prop="userName">
			            <Input type="text" clearable v-model="formInline.userName" placeholder="用户名"></Input>
			        </FormItem>
			        
			        <FormItem label="新密码" prop="passwd">
			            <Input type="password" clearable v-model="formInline.passwd" placeholder="新密码"></Input>
			        </FormItem>
			        
			        <FormItem label="确认密码" prop="passwdCheck">
			            <Input type="password" clearable v-model="formInline.passwdCheck" placeholder="确认密码"></Input>
			        </FormItem>
			        
			    </Form>
			    <div style="text-align: center;margin-bottom:16px;">
			    	<Button type="primary" @click="usermod('formInline')">保存</Button>
			    </div>
			</div>
			
		</Card>
		
		<Card style="margin-top:16px;">
			
			<h1 slot="title">给用户指定角色</h1>
			
			<div style="padding:20px 16px 0;">
				<Form ref="formInline2" :model="formInline2" :rules="ruleInline" :label-width="70">
			        <FormItem label="选择角色" prop="roleId">
						<Select v-model="formInline2.roleId" placeholder="选择角色" filterable clearable style="width:200px">
					        <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
					    <Button type="primary" @click="confirm('formInline2')">确定</Button>
			        </FormItem>
			    </Form>
			</div>
			
		</Card>
			
	</div>
	
</template>

<script>
export default {
	components:{//模板
		
	},
	props:{
		
		row: {
			type: Object,
			required: true,//必传
		}
		
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
        	
        	roleList: [],//角色数据列表
        	
        	formInline: {
                userName: this.row.userName,
                passwd: '',
                passwdCheck: '',
                
            },
            
            formInline2: {
                roleId: '',
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
                roleId: [
                    { type: 'number', required: true, message: '请选择角色', trigger: 'change' }
                ],
            },
            
        }
    },
    methods: {//方法
    	
    	usermod(name) {//修改用户信息
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
            		this.$axios.post('system/edit_user', {
            			id: this.row.id,
						userName: this.formInline.userName,
						passWord: this.formInline.passwd,
					})
					.then(response => {
						this.$Message.success('修改成功!');
					})
					.catch(function (error) {
						console.log(error);
					});
                    
                } else {
                    this.$Message.error('修改失败!');
                }
                
            })
            
        },
        getRoleList(){//获取角列表
    		
    		this.$axios.post('system/page_list', {
    			page: 1,
    			pageSize: 20000,
    			order: '{"id":"asc"}',
    			DBname_dataPage: 'SysRole',
			})
			.then(response => {
				
				response.data.dataList.data.forEach(item => {
					
					this.roleList.push({
						label: item.name,
						value: item.id,
					});
					
				});
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	confirm(name){//指定角色
    		 this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                	let data = [
	                	{
	                		id: this.row.id,
	                		pid_sys_role: this.formInline2.roleId,
	                		delete:"false",
	                	}
                	];
                	
                	this.$axios.post('system/data_saveAll', {
                		data: JSON.stringify(data),
            			DBname: 'SysUser',
					})
					.then(response => {
						this.$Message.success('指定成功!');
					})
					.catch(function (error) {
						console.log(error);
					});
                	
                }else{
                	this.$Message.error('请选择角色!');
                }
            });
    	},
    	
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	this.getRoleList();//获取角列表
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
</style>