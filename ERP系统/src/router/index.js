/*
 * 路由配置
 * 权限的验证等
 */

import Vue from 'vue'
import Router from 'vue-router'
import plant from '@/plant/index.js';//调用工厂
import { routers, otherRouter, appRouter } from '@/router/router.js'; //调用路由表

Vue.use(Router)

// 路由配置
export const router = new Router({
//	mode:'history',//去掉路由地址栏默认的'#'号（刷新页面会报错，后台要修改一下路径问题）
	routes: routers
});

router.beforeEach((to, from, next) => {
	
//	router.app.$Loading.start();//全局创建一个显示页面加载
	
	if(sessionStorage.getItem('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态（这里是用来完成锁屏功能）
		
		//console.log('未锁定');
		next({
			replace: true,
			name: 'locking'
		});
		
	}
	
	else if(sessionStorage.getItem('locking') === '0' && to.name === 'locking') {
		
		//console.log('已锁定');
		next(false);//中断所有路由
		
	}
	
	else {
		
		if(!sessionStorage.getItem('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
			
			//console.log('未登录，而且当前页面不是登录页');
			next({
				name: 'login'//这里表示要跳转到name值为'login'的路由(通过name来显示页面)
			});
			
		}else if(sessionStorage.getItem('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
			
			//console.log('已经登录，而且当前页面是登录页');
			next({
//				name: 'home_index'
				name: 'orderformList'
			});
			
		}else {
			
			const curRouterObj = plant.getRouterObjByName([otherRouter, ...appRouter], to.name);//获取到当前路由对象
			
			//在这里加多一个超级管理员的权限
			let isadmin = sessionStorage.getItem('isadmin'); //是否为管理员
			
			if(curRouterObj && curRouterObj.access !== undefined && isadmin != 1) { // 需要判断权限的路由走这里
				
				//console.log('有要判断权限的路由');
				
				const whetherPass = plant.oneOf(curRouterObj.access,sessionStorage.getItem('access'));//'plant.oneOf()'多个权限的判断方法
				
				if(curRouterObj.access === parseInt(sessionStorage.getItem('access'))) {//（单个权限判断）路由权限和用户权限的判断
					
					//console.log('权限通过');
					plant.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
					
				}else if(whetherPass){//多个权限的判断
					
					plant.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面

				}else {
					
					//console.log('权限不通过');
					next({//跳到对应的页面
						replace: true,
						name: 'error-403'
					});
					
				}
			} else { // 没有配置权限的路由走这里
				
				//console.log('没有要判断权限的路由');
				plant.toDefaultPage([...routers], to.name, router, next);// 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
				plant.title(to.meta.title);
				//router.app.$Message.info('This is a info tip');//iview的this在路由使用全局提示
				
			}
		}
	}
	
});