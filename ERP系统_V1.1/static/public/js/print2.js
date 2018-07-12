
const Print =function(dom) {
	
	if ((typeof dom) === "string") {
		
    this.subOutputRankPrint = document.querySelector(dom);
    
  } else {
  	
    this.subOutputRankPrint = dom;
    
  }
	
	let newContent = this.subOutputRankPrint.innerHTML;
	
	let oldContent = document.body.innerHTML;
	
	document.body.innerHTML = newContent;
	
	window.print();
	
	window.location.reload();
	
	document.body.innerHTML = oldContent;
	
	return false;
	
}

const MyPlugin = {}

MyPlugin.install = function (Vue, options) {
  // 4. 添加实例方法
  Vue.prototype.$print = Print
}
export default MyPlugin
