/*
 * 状态管理（仓库）
 */

import Vue from 'vue';

import Vuex from 'vuex';

import mainFrame from '@/views/frame/store/index.js';//框架状态

import components from '@/components/store/index.js';//组件状态

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {//数据
		
	},
	mutations: { //事件集,mutation是同步的

	},
	getters:{//计算属性
		
	},
	actions:{//专门放置异步交互代码,Action 是异步的
		
	},
	modules:{//模板
		mainFrame,
		components,
	}
});

export default store;



















