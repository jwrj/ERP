//vue框架
import Vue from 'vue'

//路由
import {router} from './router/index.js';

//状态管理
import store from './store/index.js'

//UI组件
import iView from 'iview';
//import '../static/iview/index.less';//这是自定义主题（两者只能存在一个）
import 'iview/dist/styles/iview.css';//这是默认主题

import Print from '../static/public/js/print.js'//打印插件
Vue.use(Print) // 注册打印插件

Vue.use(iView);

//ajax组件
import ajax from './ajax/ajax.js'
Vue.prototype.$axios = ajax;//挂载到Vue

//主组件
import App from './App'

new Vue({//创建vue实例
  el: '#app',
  router,//路由
  store,//状态管理
 	render: h => h(App),//导入主组件App到根目录index.html
});

Vue.directive('globalDirective', {//全局自定义指令(可做按钮级的权限)
  inserted: function (el,obj) {
  	
  	/*
  	 * 用法
  	 * <button v-globalDirective="[7,9,5,3]"></button>
  	*/
  	
  	let userPermissionsArr = JSON.parse(sessionStorage.getItem('access'));//获取用户权限
  	
  	let boole = userPermissionsArr.some((val,i,arr) => {//判断是否有对应的权限
  		
  		//obj传按钮的权限过来
			return obj.value.indexOf(arr[i]) >= 0;
			
		});
  	
  	if(!boole){//没有匹配的权限就执行
  		el.parentNode.removeChild(el);//模拟v-if
  	}
  	
  },
})

