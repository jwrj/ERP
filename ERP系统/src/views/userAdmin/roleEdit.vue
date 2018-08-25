<template>

	<div>
		
		<Card>
			
			<div style="padding:20px 16px 0;border-bottom:1px solid #e9eaec">
				
				<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="84" inline>
			        <FormItem label="修改角色名" prop="name">
			            <Input type="text" clearable v-model="formInline.name" placeholder="输入角色名称"></Input>
			        </FormItem>
			    </Form>
			    
			</div>
			
			<div style="padding:16px;">
				<Card>
					<h2 slot="title">权限树分类</h2>
					<div style="padding:16px;">
						<Tree :data="treeData" show-checkbox @on-check-change="treeChange"></Tree>
					</div>
				</Card>
			</div>
			
			<div style="margin-bottom:16px;text-align: center;">
				<Button type="primary" @click="save">保存</Button>
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
        return {
        	
        	treeData: [],
        	
        	selectAuthority: [],
        	
        	authority: this.row.authority_arr,
        	
        	formInline: {
                name: this.row.name,
            },
            
            ruleInline: {
                name: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ],
            },
        	
        }
    },
    methods: {//方法
    	
    	authorityList(){//获取权限列表
    		
    		this.$axios.post('system/authority_list', {
    			
			})
			.then(response => {
				
				let currentAuthority = [];
				
				if(this.row.authority_arr){
					currentAuthority = this.row.authority_arr.split(',');
				}
				
				response.data.forEach(item => {
					
					let children = [];
					
					if(item.children && item.children.length > 0){
						
						item.children.forEach((item2,index2) => {
							
							children.push({
								title: item2.name,
								id: item2.id,
							});
							
							currentAuthority.forEach(item3 => {
								if(item2.id == item3){
									children[index2].checked = true;
								}
								
							});
							
						});
						
					}
					
					this.treeData.push({
						title: item.name,
						pid: item.pid,
						id: item.id,
						children: children,
					});
					
				});
				
				console.log(this.treeData);
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	
    	treeChange(arr){//勾选改变时
    		
    		if(arr.length <= 0){
    			this.authority = null;
    		}
    		this.selectAuthority = arr;
    	},
    	
    	save(){//保存
    		
    		this.$refs['formInline'].validate((valid) => {
                if (valid) {
                	
                	if(this.selectAuthority.length > 0){
                		
                		let arr = [];
                		
                		this.selectAuthority.forEach(item => {
                			
                			if(item.pid != 0){
                				arr.push(item.id);
                			}
                			
                		})
                		
                		this.authority = arr.join(',');
                	}
                	
                    let data = [
                    	{
                    		id: this.row.id,
	                    	name: this.formInline.name,
	                    	authority_arr: this.authority,
	                    	delete:"false"
                    	}
                    ]
                    
                    this.$axios.post('system/data_saveAll', {
		    			data: JSON.stringify(data),
		    			DBname: "SysRole",
					})
					.then(response => {
						this.$Message.success('保存成功!');
					})
					.catch(function (error) {
						console.log(error);
					});
                    
                } else {
                    this.$Message.error('保存失败');
                }
            })
    		
    	},
    	
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	this.authorityList();//获取权限列表
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
</style>