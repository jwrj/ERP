/*
 * 路由仓库
 * 放所有路由的地方
 */

import Frame from '@/views/frame/frame.vue';//主组件，用于加载侧边栏和右侧面包屑、标签栏、工具条、子页面路由视图等（框架）

//-----------第一种类型：该页面在整个浏览器区域展现，代表性的有登录页、404页等// 不作为Frame组件的子页面展示的页面单独写，如下------------------
export const loginRouter ={
	path: '/login',  //必填
    name: 'login',  // 必填，页面都以name值来加载
    meta: {
        title: 'ERP系统-登录'  // 非必填，若不填默认显示ERP系统（后面会介绍在哪修改默认显示的值）
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }  // 必填，用来加载该路由规则对应的视图，resolve用来控制异步加载
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/errorPage/error404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    name: 'error-403',
    meta: {
        title: '403-权限不足'
    },
    component: resolve => { require(['@/views/errorPage/error403.vue'], resolve); }
};


//--------第二种类型：该页面在Frame组件的子页面区域展示，但不在左侧菜单栏显示，代表性的有首页、消息中心等-----------
export const otherRouter = {
    path: '/',  // 必填
    redirect: '/home',  // 选填，这里如果不填在浏览器地址栏输入域名后自动跳转到首页
    name: 'otherRouter',  // 必填，在面包屑处理中需要用到，值固定为otherRouter（或者可以在./src/libs/util.js中修改）
    component: Frame,  // 必填，主组件，用于加载侧边栏和右侧面包屑、标签栏、工具条、子页面路由视图等
    children: [  // 在Frame右侧视图显示的页面都要作为otherRouter的children来添加
        {  // home页面
            path: 'home',  // 必填，在地址栏将以 '域名/home'的的形式呈现
            title: '首页', // 必填，这个title会在标签栏显示
            name: 'home_index',  // 必填，该页面是通过name值来加载的，切记每个路由对象的名字都要和其他的不一样
            component: resolve => { require(['@/views/home.vue'], resolve); }   // 必填
        },
        {
            path:'productionFlow',
            name:'productionFlow_index',
            title:'生产流程',
            component: resolve => { require(['@/views/productionAdmin/productionFlow.vue'], resolve); }
        },
    ]
};


//--------------第三种类型：该页面在Frame组件的子页面区域展示，且在左侧菜单栏显示，对应有两种情况---------------------
export const appRouter = [

//  {  // a.第一种情况：只有一级菜单
//      path: '/page',  // 必填
//      redirect: '/page/page1',  // 选填，如果不填，这个'plant.toDefaultPage()'方法也会执行到默认到第一个子页面
//      icon: 'key',  // 必填，此icon将显示在左侧菜单栏
//      name: 'page',  // 必填
//      access: [1,3],//选填 ，权限
//      title: '页面一',  // 必填，此title值将显示在左侧菜单栏
//      component: Frame,  // 必填，且固定，用于加载Frame组件
//      children: [  // 要显示在右侧区域的页面必须作为children来添加
//          {
//              path: 'page1',  // 必填
//              title: '页面一',  // 必填，将显示在标签栏对应标签
//              icon: 'key',  // 必填，此icon将显示在左侧菜单栏
//              access: [3],//选填 ，权限
//              name: 'page1',  // 必填，且不能和其父路由的name不一致（与其他任何路由的name值都不能一致）
//              component: resolve => { require(['@/views/page1.vue'], resolve); }   // 必填
//          }
//      ]
//  },
//  {  // b.第二种情况：有二级菜单
//      path: '/page2',  // 必填
//      redirect: '/page2/page2-1',  // 选填，如果不填在地址栏输入'域名/access'时将默认打开此一级菜单对应的第一个二级菜单页面
//      icon: 'social-buffer',  // 必填，同上
//      name: 'page2',  // 必填，同上
//      title: '页面2',  // 必填，同上
//      component: Frame,  // 必填，同上
//      children: [  // 必填，同上
//          {
//              path: 'page2-1',  // 必填，同上
//              icon: 'compose',  // 必填，同上
//              name: 'page2-1',  // 必填，同上
//              title: '页面2-1',  // 必填，将显示在左侧菜单栏二级菜单
//              component: resolve => { require(['@/views/page2.vue'], resolve); }  // 必填
//          },
//          {
//              path: 'page2-2',  // 必填，同上
//              icon: 'pound',  // 必填，同上
//              name: 'page2-2',  // 必填，同上
//              title: '页面2-2',  // 必填，同上
//              component: resolve => { require(['@/views/page3.vue'], resolve); }
//          }
//      ]
//  },

//===============================================================================================

    {
    	path:'/orderformAdmin',
        icon:'android-list',
        name:'orderformAdmin',
        title:'订单管理',
        component: Frame,
        children: [
	        {
	            path:'addOrderform',
	            name:'addOrderform',
	            title:'新增订单',
	            component: resolve => { require(['@/views/orderformAdmin/addOrderform.vue'], resolve); }
	        },
            {
                path:'orderformList',
                name:'orderformList',
                title:'订单列表',
                component: resolve => { require(['@/views/orderformAdmin/orderformList.vue'], resolve); }
            },
        ]
    },
    {
    	path:'/purchase',
        icon:'ios-cart',
        name:'purchase',
        title:'采购管理',
        component: Frame,
        children: [
	        {
	            path:'sponsorPurchase',
	            name:'sponsorPurchase',
	            title:'发起采购',
	            component: resolve => { require(['@/views/purchase/sponsorPurchase.vue'], resolve); }
	        },
	        {
	            path:'purchaseList',
	            name:'purchaseList',
	            title:'采购列表',
	            component: resolve => { require(['@/views/purchase/purchaseList.vue'], resolve); }
	        },
        ]
    },
    {
    	path:'/productionAdmin',
        icon:'social-buffer',
        name:'productionAdmin',
        title:'生产管理',
        component: Frame,
        children: [
//          {
//              path:'Pconfiguration',
//              name:'Pconfiguration',
//              title:'生产配置',
//              component: resolve => { require(['@/views/productionAdmin/Pconfiguration.vue'], resolve); }
//          },
//          {
//              path:'productionList',
//              name:'productionList',
//              title:'生产列表',
//              component: resolve => { require(['@/views/productionAdmin/productionList.vue'], resolve); }
//          },
            {
                path:'picking',
                name:'picking',
                title:'领料',
                component: resolve => { require(['@/views/productionAdmin/picking.vue'], resolve); }
            },
            {
                path:'pickingList',
                name:'pickingList',
                title:'领料单列表',
                component: resolve => { require(['@/views/productionAdmin/pickingList.vue'], resolve); }
            },
        ]
    },
    {
    	path:'/delivergoods',
        icon:'clipboard',
        name:'delivergoods',
        title:'发货管理',
        component: Frame,
        children: [
            {
                path:'orderDelivergoods',
                icon:'clipboard',
                name:'orderDelivergoods',
                title:'订单发货',
                component: resolve => { require(['@/views/delivergoods/orderDelivergoods.vue'], resolve); }
            },
            {
                path:'delivergoodsList',
                icon:'clipboard',
                name:'delivergoodsList',
                title:'发货单列表',
                component: resolve => { require(['@/views/delivergoods/delivergoodsList.vue'], resolve); }
            },
        ]
    },
    {
    	path:'/warehouseAdmin',
        icon:'arrow-swap',
        name:'warehouseAdmin',
        title:'出入库管理',
        component: Frame,
        children: [
            {
                path:'enterWarehouse',
                name:'enterWarehouse',
                title:'入库管理',
                component: resolve => { require(['@/views/warehouseAdmin/enterWarehouse.vue'], resolve); }
            },
            {
                path:'comeWarehouse',
                name:'comeWarehouse',
                title:'出库管理',
                component: resolve => { require(['@/views/warehouseAdmin/comeWarehouse.vue'], resolve); }
            },
            {
                path:'warehouseList',
                name:'warehouseList',
                title:'出入库列表',
                component: resolve => { require(['@/views/warehouseAdmin/warehouseList.vue'], resolve); }
            },
        ]
    },
    {
    	path:'/finance',
        icon:'ios-paper-outline',
        name:'finance',
        title:'财务',
        component: Frame,
        children: [
            {
                path:'billEdit-1',
                icon:'ios-paper-outline',
                name:'billEdit-1',
                title:'账单编辑',
                component: resolve => { require(['@/views/finance/billEdit-1.vue'], resolve); }
            },
        ]
    },
    {
    	path:'/goodsAdmin',
        icon:'cube',
        name:'goodsAdmin',
        title:'物品管理',
        component: Frame,
        children: [
            {
                path:'addGoods',
                name:'addGoods',
                title:'单个添加物品',
                component: resolve => { require(['@/views/goodsAdmin/addGoods.vue'], resolve); }
            },
            {
                path:'batchAddGoods',
                name:'batchAddGoods',
                title:'批量添加物品',
                component: resolve => { require(['@/views/goodsAdmin/batchAddGoods.vue'], resolve); }
            },
            {
                path:'configuration',
                name:'configuration',
                title:'配置物品',
                component: resolve => { require(['@/views/goodsAdmin/configuration.vue'], resolve); }
            },
            {
                path:'goodsList',
                name:'goodsList',
                title:'物品列表',
                component: resolve => { require(['@/views/goodsAdmin/goodsList.vue'], resolve); }
            },
        ]
    },
    {
    	path:'/clientAdmin',
        icon:'ios-people',
        name:'clientAdmin',
        title:'客户管理',
        component: Frame,
        children: [
            {
                path:'addClient',
                name:'addClient',
                title:'新增客户',
                component: resolve => { require(['@/views/clientAdmin/addClient.vue'], resolve); }
            },
            {
                path:'clientList',
                name:'clientList',
                title:'客户列表',
                component: resolve => { require(['@/views/clientAdmin/clientList.vue'], resolve); }
            },
        ]
    },
    {
    	path:'/addressAdmin',
        icon:'person-stalker',
        name:'addressAdmin',
        title:'送货地址管理',
        component: Frame,
        children: [
            {
                path:'address',
                name:'address',
                title:'新增地址',
                component: resolve => { require(['@/views/addressAdmin/address.vue'], resolve); }
            },
            {
                path:'addressList',
                name:'addressList',
                title:'地址列表',
                component: resolve => { require(['@/views/addressAdmin/addressList.vue'], resolve); }
            },
        ]
    },
    {
    	path:'/userAdmin',
        icon:'person-stalker',
        name:'userAdmin',
        title:'角色/用户',
        component: Frame,
        children: [
            {
                path:'addRole',
                name:'addRole',
                title:'角色管理',
                component: resolve => { require(['@/views/userAdmin/addRole.vue'], resolve); }
            },
            {
                path:'addUser',
                name:'addUser',
                title:'用户管理',
                component: resolve => { require(['@/views/userAdmin/addUser.vue'], resolve); }
            },
        ]
    },
    {
    	path:'/systemSet',
        icon:'android-settings',
        name:'systemSet',
        title:'系统设置',
        component: Frame,
        children: [
            {
                path:'pageAdmin',
                name:'pageAdmin',
                title:'页面管理',
                component: resolve => { require(['@/views/systemSet/pageAdmin.vue'], resolve); }
            },
            {
                path:'tempAdmin',
                name:'tempAdmin',
                title:'模板管理',
                component: resolve => { require(['@/views/systemSet/tempAdmin.vue'], resolve); }
            },
        ]
    },
];

// ---------------所有上面定义的路由都要写在下面的routers里-------------------
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
    page403,
    page404//这个路由一定要在最后面（在他后面的路由都不会执行）
];




/*您还可以为页面配置权限，在左侧菜单初始化的时候，
会通过当前登录用户的权限值来过滤路由配置，
从而决定在左侧菜单栏显示哪些选项。权限配置很简单，
只需在路由对象里设置'access'属性即可：*/
//{
//  path: '/access-test',
//  icon: 'lock-combination',
//  title: '权限测试页',
//  name: 'accesstest',
//  access: 0,  // 如果设置access值，那么当登录用户的权限值不为0时则该菜单及其二级菜单都不会出现在左侧菜单栏；
//              // 如果不设置access值，那么该菜单默认显示；
//              // access如果只有一个权限值过滤，那么直接写一个数字即可（如这的0）,如果有多个，则写成数组类型（如[0,1]）。
//  component: Main,
//  children: [
//      { path: 'index', title: '权限测试页', name: 'accesstest_index' }
//  ]
//}
