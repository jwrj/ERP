<template>
	<div class="layout">
        <Layout :style="{minHeight: '100vh'}">
        	<!--左边栏-->
            <Sider class="Sider" ref="side1" hide-trigger collapsible :collapsed-width="60" v-model="isCollapsed">
            	<div class="sider-box">
            		<div class="logo">ERP系统</div>
            		<!--显示文字-->
	            	<Menu
	            		ref="sideMenu"
	            		:accordion="true"
	            		:active-name="$route.name"
	            		:open-names="openNames"
	            		theme="dark"
	            		width="200px"
	            		v-show="!isCollapsed"
	            		@on-select="changeMenu"
	            		@on-open-change="menuOpenChange"
	            	>
	            		
	            		<template v-for="item in menuList">
	            			
	            			<MenuItem v-if="item.children.length <= 1" :name="item.children[0].name" :key="'menuitem' + item.name">
					            <Icon :type="item.children[0].icon || item.icon" :key="'menuicon' + item.name"></Icon>
					        	<span :key="'title' + item.name">{{item.title}}</span>
					        </MenuItem>
	            			
			                <Submenu v-if="item.children.length > 1" :name="item.name" :key="item.name">
			                    <template slot="title">
			                        <Icon :type="item.icon"></Icon>
			                      	<span>{{item.title}}</span>
			                    </template>
			                    
			                    <template v-for="child in item.children">
				                    <MenuItem :name="child.name" :key="'menuitem' + child.name">
				                    	<Icon :type="child.icon" :key="'icon' + child.name"></Icon>
				                    	<span :key="'title' + child.name">{{child.title}}</span>
				                    </MenuItem>
				                </template>
			                </Submenu>
			                
	            		</template>
	            		
		            </Menu>
		       		<!--只显示图标-->
		            <div class="min-nav" v-show="isCollapsed">
		            	<div v-for="(item,index) in menuList">
		            		
		            		<Dropdown v-if="item.children.length <= 1" key="index" :transfer="true" placement="right-start" @on-click="changeMenu">
		            			
		            			<div class="icon" @click="changeMenu(item.children[0].name)">
		            				<Icon :type="item.children[0].icon || item.icon"></Icon>
		            			</div>
		            			
						        <DropdownMenu slot="list">
						            	<DropdownItem :name="item.children[0].name" :key="'d' + index">{{item.children[0].title}}</DropdownItem>
						        </DropdownMenu>
						        
						    </Dropdown>
						    
		            		<Dropdown v-if="item.children.length > 1" :key="index" :transfer="true" placement="right-start" @on-click="changeMenu">
		            			
		            			<div class="icon">
		            				<Icon :type="item.icon"></Icon>
		            			</div>
		            			
						        <DropdownMenu slot="list">
						        	<template v-for="(child,i) in item.children">
						            	<DropdownItem :name="child.name" :key="i">{{child.title}}</DropdownItem>
						            </template>
						        </DropdownMenu>
						        
						    </Dropdown>
						    
		            	</div>
		            </div>
            	</div>
            </Sider>
            <!--左边栏-->
            <Layout>
            	<!--头部-->
	            <Header class="Header">
	            	<Card class="hCard" :bordered="false" dis-hover>
	            		<div class="box">
	            			<!--收起菜单按钮-->
	            			<div class="left">
	            				<Icon @click.native="collapsedSider" :class="rotateIcon" type="navicon" size="36"></Icon>
	            			</div>
	            			<!--面包屑-->
	            			<div class="center">
	            				<Breadcrumb>
	            					<template v-for="item in breadcrumbArr">
							        	<BreadcrumbItem :to="item.path">{{item.title}}</BreadcrumbItem>
							        </template>
							    </Breadcrumb>
	            			</div>
	            			<!--面包屑-->
	            			<!--设置/个人用户-->
	            			<div class="right">
	            				<div class="L">
	            					未开发功能区...
	            				</div>
	            				<div class="R">
            						<div class="dropdown-box">
            							<Dropdown placement="bottom-end" trigger="click" @on-click="userFunction">
									        <a href="javascript:void(0)">
									        	<span>{{userName}}</span>
									            <Icon type="arrow-down-b"></Icon>
									        </a>
									        <DropdownMenu slot="list">
									            <DropdownItem name="myCenter" disabled>个人中心</DropdownItem>
									            <DropdownItem name="set" disabled>设置</DropdownItem>
									            <DropdownItem name="exit">退出登录</DropdownItem>
									        </DropdownMenu>
									    </Dropdown>
            						</div>
            						<!--头像-->
            						<div class="avatar">
            							<!--带有消息提示的头像  dot ——> true/false-->
            							<Badge :dot="false">
            								<Avatar src="" icon="person" />
            							</Badge>
            						</div>
            						<!--头像-->
	            				</div>
	            			</div>
	            			<!--设置/个人用户-->
	            		</div>
	            	</Card>
	            	
	            	<div class="tag">
	            		
	            		<div ref="scrollMain" class="L">
	            			<div class="LTag" ref="scrollBox" :style="{left: tagLeft + 'px'}">
			            		<template v-for="(item,index) in tagArr" style="z-index:1;">
			            			<Tag
			            				ref="tagsPageOpened"
			            				type="dot"
			            				:fade="false"
			            				:name="item.name" 
			            				:key="item.name"
			            				:closable="item.name == 'home_index' ? false : true" 
			            				:color="item.name === $route.name ? 'blue' : 'default'" 
			            				@click.native="tagClick(index)" 
			            				@on-close="removeTag">
			            				{{item.title}}
			            			</Tag>
			            		</template>
	            			</div>
	            		</div>
	            		
	            		<div class="R">
	            			<Dropdown @on-click="DropdownMenuClick">
						        <Button type="primary" size="small">
						           	标签管理
						            <Icon type="arrow-down-b"></Icon>
						        </Button>
						        <DropdownMenu slot="list">
						            <DropdownItem name="all">关闭全部</DropdownItem>
						            <DropdownItem name="else">关闭其他</DropdownItem>
						        </DropdownMenu>
						    </Dropdown>
	            		</div>
	            		
	            	</div>
	            	
	            </Header>
	            <!--头部-->
	            
	       		<!--内容-->
	       		<Layout style="height:100%;position: relative;">
		            <Content class="Content">
		            	<router-view></router-view>
		            </Content>
	       		</Layout>
	            <!--内容-->
	            
	        </Layout>
        </Layout>
    </div>
</template>

<script>
	import plant from '@/plant/index.js';//调用工厂
	
	export default {
		data () {
            return {
            	
            	tagLeft:0,
            	
                isCollapsed: false,
                
                userName:sessionStorage.getItem('user'),//用户名
                
                menuList:this.$store.state.mainFrame.menuList,//菜单列表
                
               	breadcrumbArr:this.$store.state.mainFrame.currentPath,//面包屑
               	
               	openNames:this.$store.state.mainFrame.openedSubmenuArr,//需要展开的父级菜单
               	
               	tagArr:this.$store.state.mainFrame.pageOpenedList,//tag标签列表
               	
            }
        },
		computed:{
			rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
           }
		},
		methods: {
			init () {//初始化
				
				//菜单列表
              	this.$store.commit('updateMenulist');
            	this.menuList = this.$store.state.mainFrame.menuList;
            	
            	//面包屑
            	let pathArr = plant.setCurrentPath(this, this.$route.name);
            	this.breadcrumbArr = this.$store.state.mainFrame.currentPath;
            	
            	//要展开的父级菜单
            	if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
            	this.openNames = this.$store.state.mainFrame.openedSubmenuArr;
            	
            	//打开页的tag标签
            	this.$store.commit('currentOpenPageList',this.$route);
            	this.tagArr = this.$store.state.mainFrame.pageOpenedList;
            	
        	},
            collapsedSider () {//缩小菜单
            	/*
	            	ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。
	            	如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例：
            	*/
                this.$refs.side1.toggleCollapse();
            },
            changeMenu(menuName){//获取到点击当前的左侧菜单name值
            	
            	this.$router.push({
                    name: menuName
                });
                
            },
            menuOpenChange(){
            	
            	this.$store.state.mainFrame.openedSubmenuArr = this.$refs.sideMenu.openedNames;
            	
            	this.openNames = this.$store.state.mainFrame.openedSubmenuArr;
            	
            },
            tagClick(i){//点击tag标签跳转路由
            	
            	this.$router.push({
	                name: this.$refs.tagsPageOpened[i].name
	            });
	            
            },
            removeTag(ev,tagName){//删除标签
            	
            	this.$store.commit('removeTag', [tagName,this.$route,this.$router]);
            	
            	this.tagSlide();//tag溢出滑动
            	
            },
            tagSlide(){//tag溢出滑动
        		
        		setTimeout(() => {
        			
	            	this.$refs.tagsPageOpened.forEach((item,index,arr) => {
	            		
	            		if(item.name == this.$route.name){
	            			
	            			let currentTag = arr[index]
	            			
	            			let tagLeft = currentTag.$el.offsetLeft + currentTag.$el.offsetWidth;
        		
			        		if(tagLeft > this.$refs.scrollMain.offsetWidth){
			        			
			        			this.tagLeft = -( (tagLeft - this.$refs.scrollMain.offsetWidth) + 15 );
			        			
			        		}else{
			        			
			        			this.tagLeft = 0;
			        			
			        		}
	            			
	            		}
	            		
	            	});
	            	
	        	},10);
        		
        	},
            userFunction(name){
            	if(name === 'myCenter'){//个人中心
        			console.log('点击了个人中心');
        		}
        		else if(name === 'set'){//设置
        			console.log('点击了设置');
        		}
        		else if(name === 'exit'){//退出登录
        			
        			this.$axios.post('login/logout', {
    					
					})
					.then(response => {
						
						if(response.code == 1){
							
							sessionStorage.clear();// 从sessionStorage删除所有保存的数据
					
							this.$store.commit('clearOpenedSubmenu');//恢复默认状态
							
							this.$router.replace({
								name:'login'
							});
							
							this.$Message.success(response.msg);
							
						}
						
					})
					.catch(error => {
						console.log(error);
					});
					
        		}
        		else{
        			
        		}
        		
        	},
        	DropdownMenuClick(name){//标签管理
        		
        		if(name == 'all'){//关闭全部
        			
        			this.$store.state.mainFrame.pageOpenedList = [];
        			
        			if(this.$route.name == 'home_index'){
        				
		    			this.$store.commit('currentOpenPageList',this.$route);
		        		this.tagArr = this.$store.state.mainFrame.pageOpenedList;
        				
        			}else{
        				
        				this.$router.replace({
							name:'home_index'
						});
        				
        			}
        			
        		}else if(name == 'else'){//关闭其他
        			
        			if(this.$route.name == 'home_index'){
        				
        				this.$store.state.mainFrame.pageOpenedList = [];
        				
        			}else{
        				
        				let arr = [
        					{
								title: '首页',
								path: '',
								name: 'home_index'
							}
        				];
        				
        				this.$store.state.mainFrame.pageOpenedList.forEach(item => {
        					
        					if(item.name == this.$route.name){
        						arr.push(item)
        					}
        					
        				});
        				
        				this.$store.state.mainFrame.pageOpenedList = arr;
        				
        			}
        			
	    			this.$store.commit('currentOpenPageList',this.$route);
	        		this.tagArr = this.$store.state.mainFrame.pageOpenedList;
        			
        		}
        		
        	},
        	
	    },
	    mounted () {//模板被渲染完毕之后执行
	    	
	    	this.init();//更新初始化
	    	
	    	this.$nextTick(() => {//解决页面刷新左菜单不默认展开问题
                this.$refs.sideMenu.updateOpened();//手动更新展开的子目录
                this.$refs.sideMenu.updateActiveName();//手动更新当前选择项
	        });
	        
			this.tagSlide();//tag溢出滑动
	        
	    },
	    created () {//实例被创建完毕之后执行
	    	
            this.$store.commit('setOpenedList');//解决页面刷新后tag标签数组恢复默认问题
            
       },
	    watch: {//监测数据变化
            '$route' (to) {
            	
            	//面包屑
            	let pathArr = plant.setCurrentPath(this, to.name);
              	this.breadcrumbArr = this.$store.state.mainFrame.currentPath;
            	
            	//要展开的父级菜单
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.openNames = this.$store.state.mainFrame.openedSubmenuArr;
                
                this.$nextTick(() => {//解决页面刷新左菜单不默认展开问题
	                this.$refs.sideMenu.updateOpened();//手动更新展开的子目录
	                this.$refs.sideMenu.updateActiveName();//手动更新当前选择项
		        });
		        
		        //打开页的tag标签
		        this.$store.commit('currentOpenPageList',this.$route);
            	this.tagArr = this.$store.state.mainFrame.pageOpenedList;
            	
				this.tagSlide();//tag溢出滑动
            	
            }
        }
    }
</script>

<style scoped>
	.Sider{
		position: relative;
	}
	.Sider .sider-box{
		position:absolute;
		width:100%;
		height:100vh;
		left: 0;
		top:0;
		overflow-y:auto;
		overflow-x:hidden;
	}
	.Sider .sider-box .logo{
		height:64px;
		line-height:64px;
		text-align:center;
		color:#fff;
		background:#2d8cf0;
		font-size:24px;
		overflow: hidden;
	}
	.min-nav>div{
		text-align: center;
	}
	.min-nav .icon{
		display:inline-block;
		width:65px;
		padding:14px 0;
		color: rgba(255,255,255,.7);
		cursor: pointer;
	}
	.min-nav .icon i{
		margin-left:-5px;
		font-size:24px;
	}
	.Header{
		background:#fff;
		padding:0;
		height:auto;
		line-height:initial;
	}
	.Header .hCard{
		width:100%;
	}
	.Header .tag{
		display:flex;
		box-shadow: 0 0 10px 0 #dddee1 inset;
	}
	.Header .tag .L{
		position: relative;
		width:100%;
		height:48px;
		overflow: hidden;
	}
	.Header .tag .L .LTag{
		position: absolute;
		transition:all .2s;
		padding:6px 8px;
		white-space:nowrap;
	}
	.Header .tag .R{
		flex-shrink: 0;
		padding:0 10px;
		box-shadow: -6px 0 10px -2px #dddee1;
		display:flex;
		align-items: center;
		z-index:2;
	}
	.menu-icon{
        transition: all .3s;
    }
	.rotate-icon{
        transform: rotate(-90deg);
    }
	.Content{
		width:100%;
		background:#f8f8f9;
		padding:15px;
		position: absolute;
		top:0;
		bottom:0;
		overflow: auto;
	}
	.hCard .box{
		position: relative;
		width:100%;
		height:64px;
	}
	.hCard .box>div{
		position: absolute;
		height:100%;
	}
	.hCard .box .left{
		width:60px;
		left:0;
		display:flex;
		z-index:999;
	}
	.hCard .box .left i{
		margin:auto;
		cursor: pointer;
		color:#1c2438;
	}
	.hCard .box .center{
		left:60px;
		right:400px;
		padding-left:30px;
		line-height:64px;
		overflow: hidden;
	}
	.hCard .box .right{
		width:400px;
		right:0;
		display:flex;
	}
	.hCard .box .right .L{
		line-height:64px;
		flex-shrink:0;
		color:#bbbec4;
	}
	.hCard .box .right .R{
		display:flex;
		align-items: center;
		margin-left:auto;
		padding:0 15px;
		flex-shrink:0;
	}
	.hCard .box .right .R .avatar{
		margin-left:10px;
		flex-shrink: 0;
	}
</style>