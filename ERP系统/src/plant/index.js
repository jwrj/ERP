/*
 * 工厂
 * 放功能的地方
 */

let plant = {
	
};

//--------------------------设置浏览器title标题-----------------------------------
plant.title = function (title) {
    title = title || 'ERP系统';
    window.document.title = title;
};

//-----------获取当前进入的路由的父级或子级的对象功能------------------------------
plant.getRouterObjByName = function (routers, name) {
	//console.log(routers);//路由表（otherRouter，appRouter）
	//console.log(name);//当前路由的name值
    if (!name || !routers || !routers.length) {
        return null;
    }
    
    let routerObj = null;
    for (let item of routers) {
      	//console.log(item);//数组里的每个对象
    	//console.log(routers);//整个数组对象
    	
        if (item.name === name) {//判断每个父级路由的name和当前路由的name值是否相等
            return item;
        }
        
        routerObj = plant.getRouterObjByName(item.children, name);
        if (routerObj) {//判断每个子级路由的name和当前子级路由的name值是否相等
            return routerObj;
        }
    }
    return null;
};

//----------------多个权限的判断功能----------------------
plant.oneOf = function (routingPermissions, userPermissions) {
	
	let userPermissionsArr = JSON.parse(userPermissions);//转换为对象
	
	function isArrayFn(value){//判断是不是数组的方法
		if (typeof Array.isArray === "function") {
			return Array.isArray(value);
		}else{
			return Object.prototype.toString.call(value) === "[object Array]";
		}
	}
	
	if(isArrayFn(userPermissionsArr)){//是数组就执行
		
		let boole = userPermissionsArr.some((val,i,obj) => {//判断是否有对应的权限
			return routingPermissions.indexOf(obj[i]) >= 0
		});
		return boole;
		
	}
	return false;
	
};

// ------------如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面-----------------
plant.toDefaultPage = function (routers, name, route, next) {
	//console.log(routers);//路由
	//console.log(name);//当前路由的name值
	//console.log(route);//整个路由对象
	//console.log(next);//路由的钩子
    let len = routers.length;
    let i = 0;
    let notHandle = true;//开关
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {//判断是否有子级路由
            route.replace({//编程式导航
                name: routers[i].children[0].name
            });
            notHandle = false;
            break;
        }
        i++;
    }
    if (notHandle) {//只有一级路由
        next();
    }
};

//-----------------------------设置面包屑导航---------------------------------
plant.setCurrentPath = function (v,name) {
	
    let isOtherRouter = false;
    
    v.$store.state.mainFrame.routers.forEach(item => {//判断当前是否是首页
    	
        if (item.children.length === 1) {//一级路由
        	
            if (item.children[0].name === name) {//子路由和当前路由的name值全等
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {//二级路由
            item.children.forEach(child => {
                if (child.name === name) {
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    
    let currentPathArr = [];
    if (name === 'home_index') {
    	
        currentPathArr = [
            {
                title: plant.getRouterObjByName(v.$store.state.mainFrame.routers,'home_index').title,
                path: '',
                name: 'home_index'
            }
        ];
        
    }
    else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: plant.getRouterObjByName(v.$store.state.mainFrame.routers,'home_index').title,
                path: '/home',
                name: 'home_index'
            },
            {
                title: plant.getRouterObjByName(v.$store.state.mainFrame.routers,name).title,
                path: '',
                name: name
            }
        ];
    }
    else {
        let currentPathObj = v.$store.state.mainFrame.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    v.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

export default plant;