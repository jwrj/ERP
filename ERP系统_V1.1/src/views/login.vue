<template>
	<div class="box">
		<div class="drag" v-drag>
			
			<Card class="card">
				
				<h1 class="title" slot="title">
					<Icon type="log-in"></Icon>
					登录ERP系统
				</h1>
				
				<div style="padding:16px;">
					
					<Form ref="formInline" :model="formInline" :rules="ruleInline">
						<FormItem prop="user">
							<Input type="text" @on-enter="handleSubmit('formInline')" v-model="formInline.user" placeholder="账号">
								<Icon type="ios-person-outline" slot="prepend"></Icon>
							</Input>
						</FormItem>
						<FormItem prop="password">
							<Input type="password" @on-enter="handleSubmit('formInline')" v-model="formInline.password" placeholder="密码">
								<Icon type="ios-locked-outline" slot="prepend"></Icon>
							</Input>
						</FormItem>
						<div class="but">
							<Button type="primary" long size="large" @click="handleSubmit('formInline')">登陆</Button>
						</div>
					</Form>
					
					<p class="register"><a>没有账号立即注册</a></p>
					
				</div>
				
				
			</Card>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				formInline: {
					user:'admin',
					password:''
				},
				ruleInline: {
					user: [{
						required: true,
						message: '账号不能为空',
						trigger: 'blur'
					}],
					password: [{
							required: true,
							message: '密码不能为空',
							trigger: 'blur'
						},
						{
							type: 'string',
							min: 6,
							message: '密码最少六位',
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if(valid) {
						this.$axios.post('login/doLogin', {
						    userName: this.formInline.user,
						    passWord: this.formInline.password
						})
						.then(function (response) {
						    if(response.code == 1){//登陆成功
								sessionStorage.setItem('user',response.data.userName);//把用户名存起来
								
								sessionStorage.setItem('isadmin',response.data.isadmin);//是否为管理员存起来
								
								if(response.data.authority_arr){
									sessionStorage.setItem('access','['+response.data.authority_arr+']');//把权限存起来
								}
								this.$router.replace({//登陆成功跳转路由
//									name:'home_index'
									name:'orderformList'
								});
								this.$Message.success(response.msg);
						    }
						    else{//登陆失败
						    	this.$Message.error(response.msg);
						    }
						}.bind(this))
						.catch(function (error) {
							console.log(error);
						});
					} else {
						this.$Message.error('登陆失败');
					}
				});
			}
		},
		directives:{
			drag:{//拖动
				inserted(el){
					el.onmousedown = function(ev){
						var l = ev.pageX - el.offsetLeft;
						var t = ev.pageY - el.offsetTop;
						document.onmousemove = function(ev){
							let WW = document.documentElement.clientWidth;
							let WH = document.documentElement.clientHeight;
							var [x,y] = [ev.pageX-l,ev.pageY-t];
							el.style.left = x+'px';
							el.style.top = y+'px';
							if(el.offsetLeft <= 0){
								el.style.left = 0;
							}else if(el.offsetLeft+el.offsetWidth >= WW){
								el.style.left = (WW-el.offsetWidth)+'px';
							}
							if(el.offsetTop <= 0){
								el.style.top = 0;
							}else if(el.offsetTop+el.offsetHeight >= WH){
								el.style.top = (WH-el.offsetHeight)+'px';
							}
							ev.preventDefault();//阻止默认事件
						}
						document.onmouseup = function(){document.onmousemove = null;}
					}
				}
			}
		}
	}
</script>

<style scoped>
	.box{
		background:url(../../static/public/images/bg.jpg) center center / cover no-repeat;
		width:100%;
		height:100%;
	}
	.drag{
		position: absolute;
		width: 320px;
		height: 280px;
		right:300px;
		bottom:300px;
	}
	.card {
		height:100%;
	}
	.title{
	}
	.but{
		text-align:center;
	}
	.register{
		margin-top:16px;
		text-align: center;
		color:blue;
	}
</style>