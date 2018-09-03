<template>
	<div class="layout">
        <Layout :style="{minHeight: '100vh'}">
        	<!--左边栏-->
            <Sider class="Sider" :style="themeType == 'light' ? {background: '#fff'} : {background: '#495060'}" ref="side1" hide-trigger collapsible :collapsed-width="60" v-model="isCollapsed">
            	
            	<div class="sider-box" :style="isCollapsed ? { overflowY:'hidden', borderRight:'1px solid #DDDEE1' } : ''">
            		
            		<!--logo-->
            		<div class="logo" :style="!isCollapsed && themeType == 'light' ? { borderRight:'1px solid #DDDEE1' } : ''">
            			
            			<div>
            				<span>ERP系统</span>
            				<!--<sup style="font-size: 14px;">v1.0.2</sup>-->
            			</div>
            			
            		</div>
            		
            		<!--显示文字-->
	            	<Menu
	            		class="menu"
	            		ref="sideMenu"
	            		:accordion="true"
	            		:active-name="$route.name"
	            		:open-names="openNames"
	            		:theme="themeType"
	            		width="auto"
	            		v-show="!isCollapsed"
	            		@on-select="changeMenu"
	            		@on-open-change="menuOpenChange"
	            	>
	            		
	            		<template v-for="item in menuList">
	            			
	            			<MenuItem v-if="item.children.length <= 1" :name="item.children[0].name" :key="'menuitem' + item.name">
					            <Icon :type="item.children[0].icon || item.icon" :key="'menuicon' + item.name"></Icon>
					        	<span class="menu-text" :key="'title' + item.name">{{item.title}}</span>
					        </MenuItem>
	            			
			                <Submenu v-if="item.children.length > 1" :name="item.name" :key="item.name">
			                    <template slot="title">
			                        <Icon :type="item.icon"></Icon>
			                      	<span class="menu-text">{{item.title}}</span>
			                    </template>
			                    
			                    <template v-for="child in item.children">
				                    <MenuItem :name="child.name" :key="'menuitem' + child.name">
				                    	<Icon :type="child.icon" :key="'icon' + child.name"></Icon>
				                    	<span class="menu-text" :key="'title' + child.name">{{child.title}}</span>
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
		            				<Icon :color="themeType == 'light' ? '#495060' : ''" :type="item.children[0].icon || item.icon"></Icon>
		            			</div>
		            			
						        <DropdownMenu slot="list">
						            	<DropdownItem :name="item.children[0].name" :key="'d' + index">{{item.children[0].title}}</DropdownItem>
						        </DropdownMenu>
						        
						    </Dropdown>
						    
		            		<Dropdown v-if="item.children.length > 1" :key="index" :transfer="true" placement="right-start" @on-click="changeMenu">
		            			
		            			<div class="icon">
		            				<Icon :color="themeType == 'light' ? '#495060' : ''" :type="item.icon"></Icon>
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
			            
            <Layout>
            	<!--头部-->
	            <Header class="Header">
	            	<div class="hCard">
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
									
									<!--<div style="color: #bbbec4;">功能1</div>
									
									<div style="color: #bbbec4;">功能2</div>
									
									<div style="color: #bbbec4;">功能3</div>-->
									
									<div>
										<Dropdown trigger="click" @on-click="themeClick">
									        <a>
									        	<Icon type="tshirt" size="18" v-if="themeType == 'dark'"></Icon>
									        	<Icon type="tshirt-outline" size="18" v-if="themeType == 'light'"></Icon>
									            <Icon type="arrow-down-b"></Icon>
									        </a>
									        <DropdownMenu slot="list">
									        	
									        	<template v-for="item in themeList">
										            <DropdownItem :name="item.type">
										            	<Icon :type="item.icon" size="14" :color="item.color"></Icon>
										            	<span :style="{color: item.color}">{{item.name}}</span>
										            </DropdownItem>
									        	</template>
									            
									        </DropdownMenu>
									    </Dropdown>
									</div>
									
	            				</div>
	            				<div class="R">
            						<div class="dropdown-box">
            							<Dropdown placement="bottom-end" trigger="click" @on-click="userFunction">
									        <a>
									        	<span>{{userName}}</span>
									            <Icon type="arrow-down-b"></Icon>
									        </a>
									        <DropdownMenu slot="list">
									        	
									            <DropdownItem name="myCenter" disabled>
									            	<Icon type="person" size="14"></Icon>
									            	<span>个人中心</span>
									            </DropdownItem>
									            
									            <DropdownItem name="set" disabled>
									            	<Icon type="gear-a" size="14"></Icon>
									            	<span>设置</span>
									            </DropdownItem>
									            
									            <DropdownItem name="exit">
									            	<Icon type="log-out" size="14"></Icon>
									            	<span>退出登录</span>
									            </DropdownItem>
									            
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
	            	</div>
	            	
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
	            			<Dropdown @on-click="DropdownMenuClick" :transfer="true">
						        <Button type="primary" size="small">
						           	标签管理
						            <Icon type="arrow-down-b"></Icon>
						        </Button>
						        <DropdownMenu slot="list">
						        	
						            <DropdownItem name="all">
						            	<Icon type="close-circled"></Icon>
						            	<span>关闭全部</span>
						            </DropdownItem>
						            
						            <DropdownItem name="else">
						            	<Icon type="minus-circled"></Icon>
						            	<span>关闭其他</span>
						            </DropdownItem>
						            
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
               	
               	themeList: [//主题列表
               		{
               			type: 'b_dark',
               			color: '#2d8cf0',
               			icon: 'tshirt',
               			name: '宁静蓝'
               		},
               		{
               			type: 'g_dark',
               			color: '#19be6b',
               			icon: 'tshirt',
               			name: '清新绿'
               		},
               		{
               			type: 'y_dark',
               			color: '#ff9900',
               			icon: 'tshirt',
               			name: '尊贵黄'
               		},
               		{
               			type: 'r_dark',
               			color: '#ed3f14',
               			icon: 'tshirt',
               			name: '热情红'
               		},
               		{
               			type: 'b_light',
               			color: '#2d8cf0',
               			icon: 'tshirt-outline',
               			name: '宁静蓝'
               		},
               		{
               			type: 'g_light',
               			color: '#19be6b',
               			icon: 'tshirt-outline',
               			name: '清新绿'
               		},
               		{
               			type: 'y_light',
               			color: '#ff9900',
               			icon: 'tshirt-outline',
               			name: '尊贵黄'
               		},
               		{
               			type: 'r_light',
               			color: '#ed3f14',
               			icon: 'tshirt-outline',
               			name: '热情红'
               		},
               	],
               	
               	themeType: 'dark',//默认主题类型
               	
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
            	
            	//路由跳转
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
            		
//      			this.$router.replace({
//	                    name: 'myCenter_index'
//	                });
	                
        		}
        		else if(name === 'set'){//设置
        			
//      			this.$router.replace({
//	                    name: 'set_index'
//	                });
	                
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
		        		
		        		this.tagSlide();//tag溢出滑动
        				
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
	        		
	        		this.tagSlide();//tag溢出滑动
        			
        		}
        		
        	},
        	themeClick(name){//主题切换
        		
        		let color = name.slice(0,1);
        		
        		let themeType = name.slice(2);
        		
        		let themeData = {
        			user: sessionStorage.getItem('user'),
        			type: themeType,
        			color: color,
        		};
        		
        		localStorage.setItem('themeData',JSON.stringify(themeData));
        		
        		this.setTheme();
        		
        	},
        	setTheme(){//设置主题
        		
        		let themeData = JSON.parse(localStorage.getItem('themeData'));
        			
    			let themeLink = document.querySelector('link[name="theme"]');
    			
    			if(themeData){
    				
    				this.themeType = themeData.type;
    				
    			}else{
    				
    				this.themeType = 'dark';
    				
    			}
    			
    			if(themeData && themeData.color != 'b'){
    				
    				themeLink.setAttribute('href', 'static/my-theme/'+ themeData.color +'.css');
    				
    			}else{
    				
    				themeLink.setAttribute('href', '');
    				
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
			
			this.setTheme();
			
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
                
	            if(to.name == 'billEdit-1'){
	            	
	            	this.$refs.sideMenu.$children.forEach(item => {
						if(item.opened){
							item.opened = false;
						}
					})
	            	
	            }else{
	            	
	            	this.$nextTick(() => {//解决页面刷新左菜单不默认展开问题
		                this.$refs.sideMenu.updateOpened();//手动更新展开的子目录
		                this.$refs.sideMenu.updateActiveName();//手动更新当前选择项
			        });
	            	
	            }
		        
		        //打开页的tag标签
		        this.$store.commit('currentOpenPageList',this.$route);
            	this.tagArr = this.$store.state.mainFrame.pageOpenedList;
            	
				this.tagSlide();//tag溢出滑动
				
            }
        }
    }
</script>

<style scoped lang="less">
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
		display:flex;
		align-items: center;
		justify-content: center;
		height:64px;
		/*border-right:1px solid #DDDEE1;*/
		div {
			width:90%;
			height:46px;
			line-height:46px;
			font-size:24px;
			text-align: center;
			color:#fff;
			background:#2d8cf0;
			border-radius: 6px;
			overflow: hidden;
		}
	}
	.Sider .sider-box .menu .menu-text{
		display:inline-block;
		white-space: nowrap;
		position: absolute;
	}
	.min-nav>div{
		text-align: center;
	}
	.min-nav .icon{
		display:inline-block;
		width:65px;
		padding:14px 0;
		color: #fff;
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
		padding:26px 16px 200px;
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
		background: #fff;
	}
	.hCard .box .left i{
		margin:auto;
		cursor: pointer;
		color:#1c2438;
	}
	.hCard .box .center{
		left:70px;
		line-height:64px;
		background: #fff;
	}
	.hCard .box .right{
		right:16px;
		display:flex;
		background: #fff;
	}
	.hCard .box .right .L{
		display: flex;
		align-items: center;
		margin-right:10px;
	}
	.hCard .box .right .L div{
		margin: 0 10px;
	}
	.hCard .box .right .R{
		display:flex;
		align-items: center;
		margin-left:auto;
		flex-shrink:0;
	}
	.hCard .box .right .R .avatar{
		margin-left:10px;
		flex-shrink: 0;
	}
</style>