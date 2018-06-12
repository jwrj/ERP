<template>
<div ref="smarInstance">
 
 <!--
		<button @click='mergeTD' :disabled="tmp.tdSelects.length<2"> 合并 </button>
		<button @click='splitTD' :disabled="!splitIO"> 拆分 </button>
-->

		<button @click='resetTable' >重置</button>
		<button @click='addTD(1)'>增加列</button>
		<button @click='addTD(2)'>增加行</button>

		<input type="text" name="" v-model='tempFun'  :disabled='tmp.tdSelects.length<1' size="50" placeholder="请输入公式,例如A+B 或者(A0+B1-10)*10/2">
		<button @click='delFun'>清除公式</button>


		<table  class="smartTable"  @input='onInput'>

		  <thead >
		    <tr class="thABC"  > <!-- 字母序号 -->
		    	<th ></th>
				<th v-for='(o,i) in tmp.HEAD'   :class='{thon:tmp.thOnNum==i}'>
					<div   @mousedown='cellDown($event,o,i)' @mouseover='cellOver($event,o,i)'  :style='o.style'>
						{{ abc(i+1)   }}
					</div>

					<div class="thmove" v-dragWH="{obj:o,type:1}" ></div>	

				</th>
		    </tr>

		    <tr class="thTitle"><!-- 标题行 -->
		    	<th>
					<div style="width:40px;" >标题</div>
		    	</th>
				<th v-for='(o,i) in tmp.HEAD'   @click='tdClick($event,o,i)'   @mouseover='cellOver($event,o,i)'    @keydown='nextFocus($event,o,i,tmp.HEAD)' >
					 
						<div v-if='!o.temp.editIng'  :style='o.style' class="wwbw">
						{{o.value}}
						</div>
						<input type="text" class="tdinput" v-if='o.temp.editIng' v-model='o.value' @blur='o.temp.editIng=false'   v-focus="o.temp.editIng"  :style='o.style' > 

					 
					<!-- 拖动的时候设置smartTH+i的宽度				 -->
				</th>
		    </tr>

		  </thead>
		  <tbody > <!-- 数据列表 -->

		    <tr v-for='(tro,tri) in tmp.ARR'>

		      <td vertical-align="middle" class="smartNum"  :style='tmp.SN[tri].style' @click='chooseRow(tri)'   :class='{tron:tmp.trOnNum==tri}' >
					 {{tri}} 
					 <div class="tdmove tdmove_row" v-dragWH="{obj:tmp.SN[tri],type:2}" ></div>
		      </td>
		      <td v-for='(o,i) in tro'  @click='tdClick($event,o,i)'   @mousedown='tdDown($event,o,i,tri)'  @mouseover='tdOver($event,o,i)' :class='o.class'  @mouseup='tdUp($event,o,i)' :colspan="o.w"  :rowspan="o.h" v-if='!o.temp.delete' @keydown='nextFocus($event,o,i,tro,2,tri)' >
					<!-- <div class="smarttddiv" > -->
						<span v-if='!o.temp.editIng' >
							<!-- x{{o.x}},y{{o.y}}  {{o.w}},{{o.h}} -->
							{{funValue(o)}} <br>
							
						</span>
						<input type="text" 
						class="tdinput" 
						v-if='o.temp.editIng' 
						v-model='o.value' 
						@blur='o.temp.editIng=false'   v-focus="o.temp.editIng" 
						:style='"width:"+tmp.HEAD[i].temp.baseWidth+"px;"'
						@input='o.fun="";tmp.__tempFun="";'
						>
					<!-- </div>					 -->
				<!-- <br>	{{o.fun}} -->
                
                <div :class="{iteminfo:true,newclass:iteminfo_class(tro, tri , o,i)}" v-if="iteminfo_io(tro, tri , o,i)">{{iteminfo_txt(tro, tri , o,i)}}</div>


		      </td>


		    </tr>
		  </tbody>
		</table>
<!--{{finalData}}-->
<!--  

<br>
最终提交的数据:
<hr>

<hr>
{{tmp.ARR}}
 -->


</div>
</template>



<script>
import Public from '../../static/public/js/public.js'


export default {
    /*
                    repeatData = [[
                        -{
                        "id": 313,
                        "name": "物214品9",
                        "number": 9,
                        "__isNewItem": false
                    },]
                    
*/

    props:{
		repeatData: {
           	type: Array,
        }
	},
	data(){return { 
//          repeatData: [
                    
//{
//"id": 161,
//"pid_tree_title": 15,
//"pid_tree_class": 13,
//"name": "物品1",
//"dataFormTable_ids": "",
//"use_dataPage_ids": null,
//"pid_status": 0,
//"pid_user": null,
//"create_time": "2018-05-17 17:28:18",
//"delete_time": null,
//"update_time": "2018-05-30 17:22:42",
//"__isNewItem": false,
//"extend": {
//"id": 30,
//"pid_data_page": 170,
//"number": 10,
//"price": "0.00",
//"create_time": null,
//"update_time": null
//}
//},
//{
//"id": 167,
//"pid_tree_title": 13,
//"pid_tree_class": 13,
//"name": "物品7",
//"dataFormTable_ids": "",
//"use_dataPage_ids": null,
//"pid_status": 0,
//"pid_user": null,
//"create_time": "2018-05-17 17:27:59",
//"delete_time": null,
//"update_time": "2018-05-17 17:27:59",
//"__isNewItem": false,
//"number": 1980,
//"extend": {
//"id": 27,
//"pid_data_page": 167,
//"number": 1980,
//"price": "0.00",
//"create_time": null,
//"update_time": null
//}
//}
//              ]
//          ,
			initData:{//初始化表格数据,页面载入会把这段数据加载到表格里面去
				"data": [ 
					{ "id":-1, "pid_ft": -1, "x": 0, "y": 0, "w": 1, "h": 1, "value": "物品名称", "fun": "", "style": {}, "delete": false, "type": 0 },
					// { "id":2, "pid_ft": 222, "x": 0, "y": 0, "w": 1, "h": 1, "value": "111", "fun": "", "style": {}, "delete": false, "type": 0 },
					//{ "id":1, "pid_ft": 111, "x": 0, "y": 0, "w": 4, "h": 2, "value": "1", "fun": "", "style": {}, "delete": false, "type": 1 },
					//{ "id":3, "pid_ft": 333, "x": 2, "y": 1, "w": 1, "h": 1, "value": "1", "fun": "", "style": {}, "delete": false, "type": 1 } 
				], 
				"info": {"id":-1, "pid": -1, "xNum":10, "yNum":10 } 
    		},
			
			tmp:{
				xNum:10,//默认x数量-列,如果没有传来数据的话
				yNum:10,//默认y数量-行
				tdDown:false,//表格是否按下鼠标
				tdDownObj:{},//按下鼠标的对象,也就是光标所在的格子
				tdSelects:[],//需要合并的格子
				cellDownObj:null,//在表头按下，是否打开拖动开关
				thOnNum:-1,//选中表头的索引
				trOnNum:-1,//选中行的索引
				__tempFun:'',//公式存储临时
				
				ARR://临时产生的所有表格数组，由createTable函数生成
				[  //一个数组代表一行					
				],
				HEAD:[//表头数据，由createTable函数生成
				],
				SN:[//行的序列号数据
				]
				
			},



	}},//data
 
    methods:{
        iteminfo_v(trobj, tri , tdo , tdi ){
            let ts = this;
            let re = {
                io:false, //是否显示提示
                isNewItem:false, //是否新物品
                itmeNumber:0  //物品库存
            };

            let reItem = this.repeatData;
            
            if(!reItem)return false
            
            let ARR = ts.tmp.ARR;
            
            if(tdi==0){

                    let itemObj = trobj[0];//物品名称
                    if( itemObj.value!='' ){ //这一列有值才判断 

                        let io = false;
                        for(let r=0;r<reItem.length;r++){//遍历返回的物品列表
                            if(   reItem[r].name == itemObj.value ){//如果返回的值有同样的物品
                                re.io =  true; //标识为匹配的上
                                re.itmeNumber = reItem[r].number; //赋予数量

                                if( reItem[r].__isNewItem==   'false'||  reItem[r].__isNewItem==false){ //如果不是新物品
                                    re.isNewItem = false;

                                }
                                if( reItem[r].__isNewItem==   'true'||  reItem[r].__isNewItem==true ){ //如果是新物品
                                    re.isNewItem = true;
                                }
                              

                            }
                        }
                    }    

            }

            return re;
        },
        iteminfo_io( trobj, tri , tdo , tdi ){
            let pd = this.iteminfo_v(trobj, tri , tdo , tdi );
            if(tdo.value!='' &&  tdi==0 ){
                return pd.io;

            }
        },
        iteminfo_txt( trobj, tri , tdo , tdi ){
            let pd = this.iteminfo_v(trobj, tri , tdo , tdi );
            if(pd.isNewItem){
                return 'ok';
            }else{
                return '库存'+pd.itmeNumber;

            }
        },
        iteminfo_class( trobj, tri , tdo , tdi ){
            let pd = this.iteminfo_v(trobj, tri , tdo , tdi );
            if(pd.isNewItem){
                return true;
            }else{
                return false;

            }
        },
        
    	delFun(){
			let ts = this;
	    	let arr = ts.tmp.tdSelects;//所选的格子
	    	for(let i=0;i<arr.length;i++){
    		// console.log(ts.tmp.tempFun)
	    		let o = arr[i];
	    		o.fun = '';
			}
			ts.tempFun = '';

    	},
		c26to10(_code){//26进制转10进制
			let ts = this;
			var num=-1;
			// console.log(_code);
			let code = _code.toUpperCase();
			var reg = /^[A-Z]+$/g;
			if(!reg.test(code)){
				return num;
			}
			num=0;
			for (var i = code.length - 1, j = 1; i >= 0; i--, j *= 26){
				num +=  (code[i].charCodeAt() -64 )* j;
			}
			return num;
		}	,
    	funValue(_o){
			let ts = this;

			let fun = _o.fun;//需要返回的数值

			if(!Public.kuohao(fun)){return "NaN";}

    		if(fun!=''){//开始根据公式来计算值


				let re = fun.toLowerCase();//转小写
				
				let reg1 = /[a-z]+[0-9]+|[0-9]+[a-z]+/g;

				if(!reg1.test(re)){//如果只是单纯的字母
					let r1 = /[a-z]+/g;
					let io = false;
					re = re.replace( r1 , (w)=>{
						
						
						let objY = ts.tmp.ARR [ _o.y ];//第几行
						let objX = objY?objY[ts.c26to10(w)-1]:null;//第几列

						// console.log( objX )
						
						if(objX && objX!==_o  ){//严禁等于自己
							let v=0;
							if(objX.fun!=''){
								v = ts.funValue(objX);
							}else if(objX.value!=''){
								v = objX.value;
							}
							return v;
						}else{
							io = true;//只要有一次等于自己, 其他计算好的值全部放弃,输出NAN
						}

					} );
						//console.log('---纯数字'+ re )
					
					//只要有一次等于自己, 其他计算好的值全部放弃,输出NAN
					return io==true?'NaN':Public.strfun(re);				 
				}else{//如果是字母+数字组合
					let io = false;
					re = re.replace( reg1 , (w)=>{

						// console.log('找到的每个项目是:' + w);//格式是 字母数字,例如aa22
						
						let r1 = /[a-z]+/g;
						let r2 = /[0-9]+/g;
						let t = w.replace(r2,'');//筛选掉数字,只剩下字母
						let n = w.replace(r1,'');//只剩下数字
						
						let objY = ts.tmp.ARR [ n ];//第几行
						let objX = objY?objY[ts.c26to10(t)-1]:null;//第几列


						// console.log( ts.c26to10(t)-1 )
						if(objX && objX!==_o  ){//严禁等于自己
							let v=0;
							if(objX.fun!=''){
								v = ts.funValue(objX);
							}else if(objX.value!=''){
								v = objX.value;
							}
							return v;
						}else{
							io = true;//只要有一次等于自己, 其他计算好的值全部放弃,输出NAN
						}

					} );
						//console.log('---组合'+ re )
					
					//只要有一次等于自己, 其他计算好的值全部放弃,输出NAN
					return io==true?'NaN':Public.strfun(re);
					
				}


    		}else{
    			return _o.value;    			
    		}


    	},
		
    	nextFocus(_e,_o,_i,_ARR,_type,_tri){//键盘事件 , _type=1是表头 , _type=2是主体
			let ts = this;

    		if(_e.keyCode==9){//按tab

	    		_o.temp.editIng = false;
	    		let nextObj = _ARR[_i+1];
	    		if(nextObj){
					ts.tmp.thOnNum = _i+1;//更新列头高亮
    				ts.tmp.tdDownObj = nextObj;//记录下第一次点击的表格	
	    			nextObj.temp.editIng = true;
		    		ts.tmp.tdSelects = [];
		    		ts.tmp.tdSelects[0] = nextObj;
		    		ts.setTdBorder();//设定边框颜色	
	    		}
	    		_e.preventDefault();
    			return false; 
    		}

    		if(_e.keyCode==46){//按delete
	    		let arr = ts.tmp.tdSelects;
	    		for(let i=0;i<arr.length;i++){
	   				arr[i].value=''; 			
	    		}
	    		_e.preventDefault();
    			return false;
    		}

    		/*
    		if( ( _e.keyCode==38||_e.keyCode==40 ) && _type==2 ){//上下按键
    			let num =   _e.keyCode==38?-1:1 
	    		let nextARR = ts.tmp.ARR[_tri+ num ];
	    		if(nextARR){
	    			_o.temp.editIng = false;
	    			let nextObj = nextARR[_i];
	    			nextObj.temp.editIng = true;	    		
		    		ts.tmp.tdSelects = [];
		    		ts.tmp.tdSelects[0] = nextObj;
		    		ts.setTdBorder();//设定边框颜色
	  	    		_e.preventDefault();
	    			return false; 
	    		} 			
    		}
    		*/



    	},
    	
    	onInput(_e){//表格有值输入时执行
			let ts = this;
    		// console.log(_e);
			let arr = ts.tmp.tdSelects;
			if(arr.length>1){
       			for(let i=0;i<arr.length;i++){
    				arr[i].value = ts.tmp.tdDownObj.value;	
    			}
			}




    	},
    	cellDown(_e,_o,_i){//选中一整列
			let ts = this;
  			
    		ts.tmp.cellDownObj = _o;//标注为被点击的对象
    		// console.log(ts.tmp.cellDownObj)
    		ts.tmp.thOnNum = _i;//标记为点击了第几个,为高亮做准备

    		document.onmouseup = function(){
    			ts.tmp.cellDownObj = null;
    		}

    		//选中一整列
    		/*
    		ts.tmp.tdSelects = [];
			let ARR = ts.tmp.ARR;
 			for(let i=0;i<ARR.length;i++){//遍历行
 				ts.tmp.tdSelects.push( ARR[i][_i] );
 				if(i==0){ARR[0][_i].temp.editIng = true;}//标记本列第一个为编辑状态
 				ts.tmp.tdDownObj = ARR[0][_i]; //标记本列第一个是鼠标点击的开始(为了方便批量输入,只认第一个的值)
 				ts.tmp.trOnNum = 0;//标记行头高亮
 			}
    		ts.setTdBorder();//设定边框颜色
    		*/
   //  		//手工触发tdOver
			let ARR = ts.tmp.ARR;
    		if(ARR.length>0){
    			ts.tmp.tdDown = true;//标注为表格点击中
	   			ts.tmp.tdDownObj = ARR[0][_i];
	   			ts.tmp.tdDownObj.temp.editIng = true;
	   			ts.tdOver( null , ARR[ARR.length-1][_i] , -1 );
	    		ts.tmp.tdDown = false;//标注为没有点击
    			
    		}



    	},
    	cellOver(_e,_o,_i){ //拖动表头框选经过
			let ts = this;
   //  		if(!ts.tmp.cellDownObj){return false;}
			// let ARR = ts.tmp.ARR;
   //  		if(ARR.length>0){
	  //   		let t = _o;
	  //  //  		//手工触发tdOver
   //  			ts.tmp.tdDown = true;//标注为表格点击中
	  //  			ts.tdOver( null , ARR[ARR.length-1][_i] , -1 );
	  //   		ts.tmp.tdDown = false;//标注为没有点击
    			
   //  		}


    	},
    	cellOver_bak(_e,_o,_i){ //拖动排序经过
			let ts = this;
    		return false;//因为排序后合并和拆分位置错乱,先不打开这个功能
   
    		//取消选中文本
			if("getSelection" in window){
				window.getSelection().removeAllRanges();
			}else{
				document.selection.empty();
			}
    		

    		if(ts.tmp.cellDownObj){//如果按下鼠标才算

    			let arr = ts.tmp.HEAD;
    			let f = ts.tmp.cellDownObj;
    			let t = _o;
    			let [ fi , ti ] = [ arr.indexOf(f) , arr.indexOf(t) ];//得出对象在数组中的索引
    			
    			if( fi<ti ){//从左往右拖动	    	
    				//处理表头移动		
	    			arr.splice( ti+1 , 0 , f );// //在目标数组右边插入选中的数组	    			
	    			arr.splice( fi , 1  );// //删掉原来的数组
	    			//处理数组移动
					let ARR = ts.tmp.ARR;
		 			for(let i=0;i<ARR.length;i++){//遍历行
		 				let h = ARR[i];//第n行
		 				let f = h[fi];//要移动的对象
		 				let t = h[ti];//要插入的对象
		    			h.splice( ti+1 , 0 , f );// //在目标数组右边插入选中的数组	    			
		    			h.splice( fi , 1  );// //删掉原来的数组
		 			}

    			}else{
    				//处理表头移动		    				
    				let tmp = f;//临时存储原始对象对象
	    			arr.splice( fi , 1  );//先删除原始对象
	    			arr.splice( ti , 0 , tmp );//再在左边插入

	    			//处理数组移动
					let ARR = ts.tmp.ARR;
		 			for(let i=0;i<ARR.length;i++){//遍历行
		 				let h = ARR[i];//第n行
		 				let f = h[fi];//要移动的对象
		 				let t = h[ti];//要插入的对象
		 				let tmp = f;
		    			h.splice( fi , 1  );// 
		    			h.splice( ti , 0 , tmp );//   			
		 			}

    			}

    			//因为数组被改变过,所以要重新排列每个对象的x坐标
				let ARR = ts.tmp.ARR;
	 			for(let i=0;i<ARR.length;i++){//遍历行,重新更新x坐标
	 				let arr = ARR[i];
	 				for(let t=0;t<arr.length;t++){
	 					arr[t].x=t;		
	 				}	 				
	 			}




    		}
    	},


    	chooseRow(_i){//选择整行
			let ts = this;
    		ts.tmp.tdSelects = [];//先清空选中
    		ts.tmp.trOnNum = _i;//标记点击第几行高亮



    		/*选中一整行
			let ARR = ts.tmp.ARR[_i];
 			for(let i=0;i<ARR.length;i++){//遍历行里面的列
 				ts.tmp.tdSelects.push( ARR[i] );
 				if(i==0){ARR[0].temp.editIng = true;}//标记本列第一个为编辑状态
 				ts.tmp.tdDownObj = ARR[0]; //标记本列第一个是鼠标点击的开始(为了方便批量输入,只认第一个的值)
 			}
    		ts.setTdBorder();//设定边框颜色
    		*/
    		
   //  		//手工触发tdOver
			let ARR = ts.tmp.ARR[_i];
    		ts.tmp.tdDown = true;//标注为表格点击中
   			ts.tmp.tdDownObj = ARR[0];
	   		ts.tmp.tdDownObj.temp.editIng = true;
   			ts.tdOver( null , ARR[ARR.length-1] , -1 );
    		ts.tmp.tdDown = false;//标注为没有点击


    	},

    	abc(_num){//把序列转成abc
			let ts = this;
    		var result = [];
    		let num = _num;
            while(num){
                var t = num % 26;
                if(!t){
                    t = 26;
                    -- num;
                }    
                result.push(String.fromCodePoint(t + 64));
                num = ~~(num / 26);
            }
            let str = result.reverse().join('');
            return _num==1?'主键('+str+')':str;
    	},
    	tdClick(_e,_o,_i ){
			let ts = this;
    		_o.temp.editIng=true;//标记为编辑中
			ts.tmp.__tempFun = _o.fun;//点击单个按钮的时候读取函数


    	},
    	cellFactory(){//列工厂
			let ts = this;
    		let cell = {						 
	  			x:-1,y:-1,w:-1,h:-1, //坐标,占宽占高
	  			style:{
	  				// width:'0px',height:'0px'
	  			},
	  			value: ''   ,
	  			fun:'',//格子自带的公式
	  			class:{tdon:false},
	  			temp:{
	  				delete:false,//是否被删除,如果表格合并后,这些表格被吞并了,值就是true(不显示)
	  				mergeTD:[],//如果执行了合并,被合并的格子存储在这里,方便拆分还原
	  				baseWidth:90,//最开始的宽度
	  				baseHeight:30,//最开始的高度
	  				editIng:false,//是否编辑状态
	  			}				 	    			
    		};
    		return cell;
    	},
    	addTD(_ty){//ty=1增加列,2=行 

				let ts = this;
	      		if(_ty==1){//增加列

	    			//给表头添加一个列
			     	{
			     		let cell = ts.cellFactory();
			     		cell.x = ts.tmp.HEAD.length;
			     		cell.y = 0;
			     		cell.w = 1;
			     		cell.h = 1;
			     		if(ts.tmp.HEAD.length==0){
			     			cell.style.width = (cell.temp.baseWidth*2)+'px';

			     		}else{
			     			cell.style.width = cell.temp.baseWidth+'px';
			     		}
			    		ts.tmp.HEAD.push(cell);
			    	}
			    	//给每一行添加一个列
	    			let ARR = ts.tmp.ARR;
	     			for(let i=0;i<ARR.length;i++){//遍历行
	     				let newObj = ts.cellFactory();
	     				let o = ARR[i];//这是行里面的列
	     				newObj.x = o.length;
	     				newObj.y = i;
	     				newObj.w = 1;
	     				newObj.h = 1;
	     				o.push(newObj ) 
	     			}

				}  		

	     		if(_ty==2){//增加行
	    			//给列增加一个序列号的格子
			     	{
			     		let cell = ts.cellFactory();
			     		cell.x = 0;
			     		cell.y = 0;
			     		cell.w = 1;
			     		cell.h = 1;
			     		cell.style.height = cell.temp.baseHeight+'px';
			    		ts.tmp.SN.push(cell);
			    	}

			    	//给每一行添加格子,数量是表头数组长度
	    			let ARR = ts.tmp.ARR;			    	
	    			let newArr=[];//生成一行的数据
	     			for(let i=0;i<ts.tmp.HEAD.length;i++){
	     				let newObj = ts.cellFactory();	     				
	     				newObj.x = i;
	     				newObj.y = ts.tmp.SN.length-1;
	     				newObj.w = 1;
	     				newObj.h = 1;
	     				newArr.push(newObj ) 
	     			}
	     			if(newArr.length>0){
	     				ARR.push(newArr);//追加到总数组	     				
	     			}


			    }


    	},
    	
    	tdDown(_e,_tdObj,_i,_tri){//鼠标按下

			let ts = this;
            
    		ts.tmp.tdDown = true;//标注为表格点击中
    		ts.tmp.tdDownObj = _tdObj;//记录下第一次点击的表格

    		ts.tmp.thOnNum = _i;//更新列头高亮
    		if(_tri !=undefined){
    			ts.tmp.trOnNum = _tri;//更新行头高亮
    		}

    		document.onmouseup = function(){
    			ts.tmp.tdDown = false;//标注为没有点击
 				document.onselectstart= function(){return true;}//阻止框选
				document.onselect= function(){return true;}//阻止框选
   			
    		}

    		ts.tmp.tdSelects = [];//清空所选数组
    		ts.tmp.tdSelects.push(_tdObj);//把框选中的对象放到数组,以供合并
    		ts.setTdBorder();//设定边框颜色


    	},
    	splitTD(){//拆分表格
			let ts = this;

    		let arr = ts.tmp.tdSelects; //已经框选中的数组
    		for(let i = 0; i<arr.length; i++){
    			let o = arr[i];
    				o.w=1;
    				o.h=1;
    				o.temp.delete = false;
    			for(let t = 0; t<o.temp.mergeTD.length;t++){	
    				o.temp.mergeTD[t].temp.delete = false;
    				o.temp.mergeTD[t].w=1;
    				o.temp.mergeTD[t].h=1;
    				o.temp.mergeTD[t].temp.mergeTD = [];
    			}
    			o.temp.mergeTD = [];
    		}



    	},
    	tdOver(_e  ,_tdObj,_i){
			let ts = this;

	    	//处理禁止框选
    		if(ts.tmp.tdDown != true){ return false; }else{

				if("getSelection" in window){
					window.getSelection().removeAllRanges();
				}else{
					document.selection.empty();
				}
				document.onselectstart= function(){return false;}//阻止框选
				document.onselect= function(){return false;}//阻止框选

    		}


    		
    		let A = ts.tmp.tdDownObj;//开始obj 
    		let B = _tdObj;//现在经过的对象是_tdObj

    		//在A和B之间,//计算坐标围栏
    		let x1 = A.x<B.x?A.x:B.x;  //最左边x
    		let x2 = A.x+A.w-1 > B.x+B.w-1 ? A.x+A.w-1 : B.x+B.w-1 ; //最右边x 
    		let y1 = A.y<B.y?A.y:B.y;
    		let y2 = A.y+A.h-1 > B.y+B.h-1 ? A.y+A.h-1 : B.y+B.h-1;
    		//console.log('框选范围:'+x1,x2,y1,y2);
    		// return ;

    		//接下来思路：碰撞检测--------------------------------------------------
    		//
    		function roundObj(){//找出坐标围栏周围的对象
    			let arr = [];
    		}
    		//
			let num = 0;//防止死循环的计数器
    		function findTD(){

			 	//计算出框选的围栏后, 开始遍历第一次
	     		let ARR = ts.tmp.ARR;//遍历所有行和列  找到

	     		ts.tmp.tdSelects = [];
				for(let i=0; i<ARR.length; i++){//行
					for(let t = 0;   t<ARR[i].length;  t++  ){//列
						let o = ARR[i][t];//当前被遍历到的对象

							let tj1 = o.x+o.w-1 >= x1 &&  o.x <= x2;
							let tj2 = o.y+o.h-1 >= y1 &&  o.y <= y2;
						
							if(tj1&&tj2){
									ts.tmp.tdSelects.push(o);						
							}
					}
				}
	

				//得出第一组, 第二次计算选中数组里面的坐标围栏
				let sArr = ts.tmp.tdSelects;
				let [llx ,rrx , tty, bby]= [0,0,0,0];
				for(let i = 0 ; i<sArr.length; i++){
					if(i==0){llx=sArr[i].x ;}//第一次要赋值
					if( sArr[i].x < llx ){ llx = sArr[i].x; } //最小左边
					if( sArr[i].x+sArr[i].w-1 > rrx ){ rrx = sArr[i].x+sArr[i].w-1; } //最大右边

					if(i==0){tty=sArr[i].y ;}//第一次要赋值
					if( sArr[i].y < tty ){ tty = sArr[i].y; } //最小上边
					if( sArr[i].y+sArr[i].h-1 > bby ){ bby = sArr[i].y+sArr[i].h-1; } //最大下边
				}
				//console.log('范围内最大x'+llx,rrx);

				if(llx!=x1||x2!=rrx||y1 != tty|| y2 != bby){//发现不同才循环计算
					x1 = llx ; x2 = rrx; y1 = tty; y2 = bby;//更新最大最小之后					//再无限循环,一直找不到有交叉的位置为止
					if(++num < ts.tmp.HEAD.length*ts.tmp.SN.length){//防止死循环
						//console.log('-------------计算次数:'+ ++num)
						findTD();
					}
				}

    		}
    		findTD();


	    	ts.setTdBorder();//设定边框颜色    	

		    	if(_e){//如果是鼠标操作的才执行扩展行

		    	//增加列行
		    	if(B.x+3 > ts.tmp.HEAD.length && B.x>A.x){//增加列
		    		ts.addTD(1)	;
					// window.scrollTo( _e.pageX+ B.x*(6),document.body.scrollTop );//立即滚动到右边
		    	}
		    	if(B.y+6 > ts.tmp.SN.length && B.y>A.y){//增加行
		    		ts.addTD(2)	;
					// window.scrollTo( document.body.scrollLeft, _e.pageY+ B.y*6  );//立即滚动到最底部

		    	}
	    	}
	    	

			ts.tmp.__tempFun = '';//如果是多选需要把按钮的公式清空掉

    	},	
    	
    	tdUp(_e,_tdObj,_i){//鼠标松开    		 
			let ts = this;
		 	let arr = ts.tmp.tdSelects;
		 	//console.log(arr)
			if(arr.length>0){
				ts.tmp.tdDownObj.temp.editIng = true;
			}
    	},

 
    	hover(_e){//鼠标经过
			let ts = this;


    	},
    	setTdBorder(_tdObj){//设定边框颜色
			let ts = this;

    		// console.log(_tdObj.tid);
     		let ARR = ts.tmp.ARR;
			for(let i=0; i<ARR.length; i++){//行
				for(let t = 0;   t<ARR[i].length;  t++  ){//列
					// console.log(i+',,'+t)
					ARR[i][t].class.tdon = false;
				}
			}
			let sArr = ts.tmp.tdSelects;
    		for(let i=0; i< sArr.length; i++){
				sArr[i].class.tdon = true;

    		}


   		
    	},
    	mergeTD(){//执行合并
			let ts = this;
    		let tds = ts.tmp.tdSelects;//被选中的格子对象组合
    		//找出最左上角的坐标
    		let s = 0;
    		let b = 0;
    		for(let i = 0; i< tds.length; i++){
    			if(  tds[i].x+tds[i].y <= tds[s].x+ tds[s].y ) {
    				s = i; //s就是最左上角的索引
    			}else if( tds[i].x+tds[i].y >= tds[s].x+ tds[s].y ){
    				b = i;//b就是最左下角的索引
    			}
    		}
    		//console.log('左上角'+ tds[s].x  );
    		//console.log('左下角'+ tds[b].x  );

    		let tempOBJ = null;//
    		let tempDelObjs = [];//即将被隐藏的数组
    		for(let i = 0; i< tds.length; i++){
    			if( tds[i].x==tds[s].x   && tds[i].y==tds[s].y  ){//找出最左上角的对象
    				tds[i].w = tds[b].x - tds[i].x+1;
    				tds[i].h = tds[b].y - tds[i].y+1;
    				tempOBJ = tds[i];
    			}else{
    				tds[i].temp.delete = true;//标记为删除,不显示
    				tempDelObjs.push(tds[i]);
    			}
   			}

   			if( tempOBJ ){
   				tempOBJ.temp.mergeTD = tempDelObjs;//把收集好的被删除数组放到对象里面去
   				ts.tmp.tdSelects = [tempOBJ];//默认
   			}
   			ts.tmp.tdDownObj = {};


    	},
    	tid(_obj){//返回tid
			let ts = this;
	        return _obj.x.toString() +','+_obj.y.toString() +',' + _obj.w.toString() +',' + _obj.h.toString();//tid (id的组成是x+y+w+h)    		 
    	},
    	resetTable(){
            if( confirm('确定要重置表格吗? 这样会清空数据 ')){
                let ts = this;
				ts.tmp.tdSelects = [];				
				ts.tmp.ARR = [];
				ts.tmp.HEAD=[];
				ts.tmp.SN=[];
				ts.createTable();
            }
			
    	},
    	createTable(){//创建表格,_datas=服务器返回的表格数据
			let ts = this;
    		let data = this.initData;

			// 创建列
			let xNum = ts.tmp.xNum;
			let yNum = ts.tmp.yNum;
			if(data.info){
				xNum = data.info.xNum
				yNum = data.info.yNum
			}
    		for(let i=0;i<xNum;i++){
    			ts.addTD(1);
    		}
    		// 创建行
    		for(let i=0;i<yNum;i++){
    			ts.addTD(2);
    		}


            
    		let daraArr = [];
    		if(data.data){
    			daraArr = data.data;
    		}
    		//头部数据遍历
     		let ARR = ts.tmp.ARR;//遍历所有行和列  找到
     		let HEA = ts.tmp.HEAD;

    		daraArr.forEach(v=>{//v是读取的值
    			for(let i=0;i<HEA.length;i++){//头部
    				let obj = HEA[i];
    				if(v.type==0 && v.x==obj.x ){ //type==0 是头部
						obj.value = v.value;
						obj.id=v.id;
						obj.pid_ft=v.pid_ft;
    				}
    			}

    			for(let i=0;i<ARR.length;i++){ //主题,  i=第几行
    				let objRow = ARR[i];//一行
    				for(let p=0;p<objRow.length;p++){ //p = 第几列
    					let obj = objRow[p];//列对象
	    				if(v.type==1 && (v.x==obj.x&&v.y==obj.y) ){ //type==1 是主体数据
	    					obj.value = v.value;
	    					obj.w = v.w;
							obj.h = v.h;
							obj.id=v.id;
							obj.pid_ft=v.pid_ft;

								//处理跨表格-------------
								for(let ii=0;ii<obj.h;ii++){//遍历w和h覆盖的范围
									for(let pp=0;pp<obj.w;pp++){
										if(ii==0&&pp==0){
											continue;
										}else{
											if(ARR[i+ii]&&ARR[i+ii][p+pp]){										
												ARR[i+ii][p+pp].temp.delete=true;		
											}
										}
									}															
									
								}
								//-------------------

	    				}
    				}
    			}

    		});


    	}
    		 
	},
	computed:{
		tempFun:{//返回所选格子的函数
			get(){
				let ts = this;
				return ts.tmp.__tempFun;
			},
			set(_v){
				let ts = this;
				let array = ts.tmp.tdSelects
				ts.tmp.__tempFun = _v;
				
				if(array.length>1){//批量设置函数
					for (let i = 0; i < array.length; i++) {
						console.log(i)
						const o = array[i];
						o.fun = _v;
						o.value = '';
					}
				}else{//单个设置函数
					ts.tmp.tdDownObj.fun = _v;
					ts.tmp.tdDownObj.value ='';
				}
			}
		},
		splitIO(){
			let ts = this;
    		let arr = ts.tmp.tdSelects; //已经框选中的数组
    		for(let i = 0; i<arr.length; i++){
    			let o = arr[i];
    			if(o.temp.mergeTD.length>0){return true;}
    		}
        },
        finalData(){//专门为批量新增物品设计的返回数据
            let ts =this;

   			let REARR= { //总格式
				data:[],
				info:{}
			};         
            //最终要拼回的数据格式:
            // [{  "itemName":"物21品9","number":9, "fields":[....]   }];
            
            //表格信息部分-----------
            
                let d = ts.initData;
                let tableId=-1,pid=-1;
                
                if(d.info){
                    tableId = d.info.id;
                    pid = d.info.pid;
                }
                REARR.info = {
                    id:tableId,
                    pid:pid,//如果pid是0，表示是顶级表格，如果不是0表示是子表格
                    xNum:ts.tmp.HEAD.length,
                    yNum:ts.tmp.ARR.length
                }
            
            //------------
            function getheaderValue(_i){
                //头部部分
                let value = '';
                let HARR = ts.tmp.HEAD;
                for(let i=0; i<HARR.length; i++){//列
                    let obj = HARR[i];//被遍历到的对象
                    if(i==_i){
                        value = obj.value;
                    }                   
                }
                return value;
            }

     		let ARR = ts.tmp.ARR;//所有数据
            for(let i=0; i<ARR.length; i++){//行
                let first = ARR[i][0];
                if(first&&first.value){
                    let OBJ = {
                        itemName: first.value ,
                        fields:[]
                    };

                    for(let t = 1;   t<ARR[i].length;  t++  ){//列 ,要从1开始,因为0已经作为名称了
                        // console.log(i+',,'+t)
                        let obj = ARR[i][t];//被遍历到的对象
                        let tmpObj = {
                            id: obj.id?obj.id:"",
                            pid_ft:obj.pid_ft?obj.pid_ft:tableId  ,//这些字段都属于哪个表格的
                            x: obj.x,
                            y: obj.y,
                            w: obj.w,
                            h: obj.h,
                            value: obj.value,
                            fun: obj.fun,
                            style: obj.style,
                            delete: obj.temp.delete, //是否被合并,或者被删除,必须的参数
                            type:1,//1=主体数据 0 =头部

                            //为了模拟表单提交,需要增加以下字段
                            status:1,
                            label:    getheaderValue(t)     //对应表头值

                        }

                            if(tmpObj.value!=''){//如果有值就插入有值的对象
                                OBJ.fields.push(tmpObj);
                            }else if(tmpObj.fun!=''){//否则如果还有fun,就让值=fun运行结果,再插入数据
                                tmpObj.value = ts.funValue(tmpObj);
                                OBJ.fields.push(tmpObj);
                            }

                    }

                    REARR.data.push(OBJ);

                }

            }
        


            return REARR;
        },


		finalData2(){ //最终要提交给后台的数据
			let ts = this;

			let REARR= { //总格式
				data:[],
				info:{}
			};

			//表格信息部分
			let d = ts.initData;
			let tableId=-1,pid=-1;
			if(d.info){
				tableId = d.info.id;
				pid = d.info.pid;
			}
			REARR.info = {
				id:tableId,
				pid:pid,//如果pid是0，表示是顶级表格，如果不是0表示是子表格
				xNum:ts.tmp.HEAD.length,
				yNum:ts.tmp.ARR.length
			}

			
			//主体部分
     		let ARR = ts.tmp.ARR;
			for(let i=0; i<ARR.length; i++){//行
				for(let t = 0;   t<ARR[i].length;  t++  ){//列
					// console.log(i+',,'+t)
					let obj = ARR[i][t];//被遍历到的对象
					let tmpObj = {
						id: obj.id?obj.id:"",
						pid_ft:obj.pid_ft?obj.pid_ft:tableId  ,//这些字段都属于哪个表格的
						x: obj.x,
						y: obj.y,
						w: obj.w,
						h: obj.h,
						value: obj.value,
						fun: obj.fun,
						style: obj.style,
						delete: obj.temp.delete, //是否被合并,或者被删除,必须的参数
						type:1,//1=主体数据 0 =头部
					}

						if(tmpObj.value!=''){//如果有值就插入有值的对象
							REARR.data.push(tmpObj);
						}else if(tmpObj.fun!=''){//否则如果还有fun,就让值=fun运行结果,再插入数据
							tmpObj.value = ts.funValue(tmpObj);
							REARR.data.push(tmpObj);
						}
				}
			}
			//头部部分
     		let HARR = ts.tmp.HEAD;
			for(let i=0; i<HARR.length; i++){//行
				let obj = HARR[i];//被遍历到的对象
				let tmpObj = {
					id:obj.id?obj.id:"",
					pid_ft:obj.pid_ft?obj.pid_ft:tableId,//这些字段都属于哪个表格的
					x: obj.x,
					y: obj.y,
					w: obj.w,
					value: obj.value,
					fun: obj.fun,
					style: obj.style,
					type:0,//0=头部数据
				}

				if(tmpObj.value!=''){
					REARR.data.push(tmpObj);
				}
			}

			


			return REARR;
		}
	},
	directives:{//自定义事件
		"dragWH": { //对应绑定的是 v-dragx="{a:'333',b:'444'}"
                inserted: function (_el,_v) { //钩子函数: 当绑定元素插入到 DOM 中时执行。
                    // 进行一系列操作...
                    
                    let obj = _v.value.obj;// 要操作的对象
                    let newWidth = 0;
                    let newHeight = 0;
                    _el.onmousedown=function(_ev){
                        	// console.log(11)
                    
                        let [xx,yy] = [_ev.pageX,_ev.pageY];//位置差                        
                        let [objw,objh] = [obj.temp.baseWidth,obj.temp.baseHeight];//原始宽度
                        
                        document.onmousemove=function(_ev2){
                            _ev2.preventDefault();//阻止默认事件-框选
                        	// console.log(22)

                            newWidth = objw+(_ev2.pageX-xx);
                            newHeight = objh+(_ev2.pageY-yy);
                            if(_v.value.type==1){
                            	obj.style.width = newWidth+'px';
                            }
                            if(_v.value.type==2){
                            	obj.style.height = newHeight+'px';
                            }
                        };
                        document.onmouseup=function(){
                        	// console.log(333333333333333333)
                            if(_v.value.type==1){
                        		obj.temp.baseWidth = newWidth;//原始宽度                            	
                            }
                            if(_v.value.type==2){
                        		obj.temp.baseHeight = newHeight;//原始高度                            	
                            }
                            document.onmousemove = null;
                            document.onmouseup = null;
                        };
                    };
                }
        },
        focus: {//让input获得焦点,用法	v-focus="true"
	        inserted: function (el, {value}) {
	            if (value) {
	                el.focus();
	            }
	        }
   		}
	},
    created(){
    },
    mounted(){

    	this.createTable();//创建表格
    	

    }


}
</script>
<style scoped="">
	.smartTable{
		border:1px solid #ccc;  cursor:crosshair;
	}
	.smartTable .thABC th{ /*字母序号*/
	 	height: 24px; vertical-align: middle; 
		border:1px solid #585858;  border-right: none; 
		background: #585858;  color: #fff;
		cursor:pointer;
		position: relative;
	}
	.smartTable .thTitle th{ /*表头*/
		height: 40px; vertical-align: middle; 
		border:1px solid #ccc;  border-right: none;  border-bottom: none;
		background: #f3f3f3;position: relative;
	}

	.smartTable .thmove{
		width: 10px; height: 100%; position: absolute; right: 0px; background: none;  top: 0; 
	}
	.smartTable .thmove:hover{
		cursor: col-resize;
	}

 	
	.smarttddiv{
		 width: 100%;
	}
	
	.smartNum{
		position: relative; cursor:pointer;
	}
	.tdmove{position: absolute; bottom: 0px; width: 100%; height: 10px; cursor: row-resize;}


	.smartTable tbody td{
		text-align: center;  height: 30px;	vertical-align: middle;
		border-style: solid; border-width: 1px; border-color: #ccc;
		border-bottom: none; border-right: none;
		word-wrap:break-word ;
        position: relative;

	}
 	.tdinput{
 		width: 100%;height: 100%; border:none; outline:none; background: none;	 text-align: center;
 	}

	.smartTable tbody td:last-child{
		border-right:1px solid #ccc; 
	}
	.smartTable tbody tr:last-child td{
		border-bottom:1px solid #ccc; 
	}
	.tdon{
		/*border:1px solid #f00 !important;*/
		background-color: #e8f4ff;
	}
	.tdoff{
		/*border:1px solid #ccc;*/
		background-color: #fff;

	}
	.thon{background-color: #3fab39!important;}
	.tron{background-color: #e8e8e8!important;}
	.tdfun{background-color: #dbfddf;}
	.wwbw{word-wrap:break-word ;}


    .iteminfo{
        width: 60px; height: 26px; background: #c23; position: absolute; left: 0px ; top: 0px; transform: translateX(-100%); color: #fff;
        font-size: 12px; line-height: 26px;
    }
    .iteminfo.newclass{
        background: #2c8128;
    }



</style>





