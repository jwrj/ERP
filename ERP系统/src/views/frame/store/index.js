import plant from '@/plant/index.js';//调用工厂
import {otherRouter, appRouter} from '@/router/router';//路由表

const mainFrame = {
	
	state: { //数据
		menuList: [], //左侧菜单数组

		openedSubmenuArr: [], // 要展开的菜单数组

		routers: [ //路由表
			otherRouter,
			...appRouter
		],

		currentPath: [ // 默认面包屑数组
			{
				title: '首页',
				path: '',
				name: 'home_index'
			}
		],

		pageOpenedList: [] //tag标签数组

	},
	mutations: { //事件集,mutation是同步的

		updateMenulist(state) { //更新菜单列表（根据路由表生成侧边菜单数组）
			
			let accessCode = sessionStorage.getItem('access'); //用户权限
			
			let isadmin = sessionStorage.getItem('isadmin'); //是否为管理员
			
			let menuList = [];
			
			appRouter.forEach((item, index) => { //遍历菜单路由appRouter数组
				
				if(item.access !== undefined && isadmin != 1) { //这是有权限的父级路由

					if(plant.oneOf(item.access, accessCode)) { //权限匹配的父级(如果父级有权限又不匹配就整个父级都不存)

						if(item.children.length === 1) { //是一级菜单

							//menuList.push(item);//把他存起来
							let len = menuList.push(item); //把没权限的父级存起来并且返回menuList的长度
							let childrenArr = []; //存放匹配权限的子级

							childrenArr = item.children.filter(child => { //遍历每个子路由

								if(child.access !== undefined && isadmin != 1) { //有权限存在的子路由

									if(plant.oneOf(child.access, accessCode)) { //这里要判断匹配的子路由

										return child;

									}

								} else { //没有权限存在的子路由

									return child;

								}

							});

							if(childrenArr === undefined || childrenArr.length === 0) { //判断有没有子级

								menuList.splice(len - 1, 1); //没有就把对应的父级删掉

							} else {

								//这里的代码是什么鬼
								let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));

								handledItem.children = childrenArr;

								menuList.splice(len - 1, 1, handledItem);

							}

						} else { //是二级菜单

							let len = menuList.push(item); //把没权限的父级存起来并且返回menuList的长度
							let childrenArr = []; //存放匹配权限的子级

							childrenArr = item.children.filter(child => { //遍历每个子路由

								if(child.access !== undefined && isadmin != 1) { //有权限存在的子路由

									if(plant.oneOf(child.access, accessCode)) { //这里要判断匹配的子路由

										return child;

									}

								} else { //没有权限存在的子路由

									return child;

								}

							});
							//menuList添加成功len就加1
							//menuList[len - 1].children = childrenArr;
							if(childrenArr === undefined || childrenArr.length === 0) { //判断有没有子级

								menuList.splice(len - 1, 1); //没有就把对应的父级删掉

							} else {

								//这里的代码是什么鬼
								let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));

								handledItem.children = childrenArr;

								menuList.splice(len - 1, 1, handledItem);

							}
						}
					}

				} else { //这是没有权限的父级路由

					if(item.children.length === 1) { //是一级菜单

						//menuList.push(item);//同上
						let len = menuList.push(item); //把没权限的父级存起来并且返回menuList的长度
						let childrenArr = []; //存放匹配权限的子级

						childrenArr = item.children.filter(child => { //遍历每个子路由

							if(child.access !== undefined && isadmin != 1) { //有权限存在的子路由

								if(plant.oneOf(child.access, accessCode)) { //这里要判断匹配的子路由

									return child;

								}

							} else { //没有权限存在的子路由

								return child;

							}

						});

						if(childrenArr === undefined || childrenArr.length === 0) { //判断有没有子级

							menuList.splice(len - 1, 1); //没有就把对应的父级删掉

						} else {

							//这里的代码是什么鬼
							let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));

							handledItem.children = childrenArr;

							menuList.splice(len - 1, 1, handledItem);

						}

					} else { //是二级菜单

						let len = menuList.push(item); //同上
						let childrenArr = []; //同上

						childrenArr = item.children.filter(child => { //同上

							if(child.access !== undefined && isadmin != 1) { //同上

								if(plant.oneOf(child.access, accessCode)) { //同上

									return child;

								}

							} else { //同上

								return child;

							}

						});

						if(childrenArr === undefined || childrenArr.length === 0) { //判断有没有子级

							menuList.splice(len - 1, 1); //没有就把对应的父级删掉

						} else {

							//这里的代码是什么鬼
							let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));

							handledItem.children = childrenArr;

							menuList.splice(len - 1, 1, handledItem);

						}

					}

				}

			});

			state.menuList = menuList;

		},
		
		setCurrentPath(state, pathArr) { //设置面包屑
			state.currentPath = pathArr;
		},
		
		addOpenSubmenu(state, name) { //要展开的父级菜单数组

			let hasThisName = false;
			
			let isEmpty = false;
			
			if(name.length === 0) {
				isEmpty = true;
			}
			
			if(state.openedSubmenuArr.indexOf(name) > -1) {
				hasThisName = true;
			}
			
			if(!hasThisName && !isEmpty) {
				state.openedSubmenuArr.push(name);
			}
			
			state.openedSubmenuArr = JSON.parse(JSON.stringify(state.openedSubmenuArr));

		},

		currentOpenPageList(state, route) { //打开的tag标签

			let io = true;
			let currentRouteObj = plant.getRouterObjByName([otherRouter, ...appRouter], route.name);//当前打开的路由对象
			let obj = {//把需要的值存起来
				name: currentRouteObj.name,
				path: route.path,
				title: currentRouteObj.title
			};

			state.pageOpenedList.filter((item) => {//判断数组里面有没有重复的元素
				if(obj.name === item.name) {
					io = false;
				}
			});

			if(io) {//没有重复元素就把对象存起来
				state.pageOpenedList.push(obj);
			}
			sessionStorage.setItem('pageOpenedList', JSON.stringify(state.pageOpenedList));//设置本地存储(把对象存到本地存储里)

		},
		setOpenedList(state) { //刷新页面不让tag标签数组恢复默认状态
			state.pageOpenedList = JSON.parse(sessionStorage.getItem('pageOpenedList')) || state.pageOpenedList;//读取本地存储数据
		},
		removeTag(state, arr) { //删除tag标签
			state.pageOpenedList.filter((item, index) => {
				if(item.name === arr[0]) {

					state.pageOpenedList.splice(index, 1);
					sessionStorage.setItem('pageOpenedList', JSON.stringify(state.pageOpenedList));

					if(item.name === arr[1].name) {
						if(state.pageOpenedList[index]) {
							arr[2].replace({
								name: state.pageOpenedList[index].name
							});
						} else {
							arr[2].replace({
								name: state.pageOpenedList[index - 1].name
							});
						}
					}

				}
			});
		},
		clearOpenedSubmenu (state) {//恢复默认状态
            state.pageOpenedList = [];
            state.openedSubmenuArr = [];
        }
	},
	getters: { //计算属性
		
	},
	actions: { //专门放置异步交互代码,Action 是异步的

	}
};

export default mainFrame;