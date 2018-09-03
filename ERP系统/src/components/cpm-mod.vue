<template>
	
	<div ref="instance">
		
		<Button v-if="butName.io" type="primary" @click="modal = true">{{butName.name}}</Button>
		
		<!--默认弹出-->
		<Modal
		v-if="direction === 'defau'"
    	:width="width" 
    	v-model="modal" 
    	class-name="vertical-center-modal"
    	>
	    	<p slot="header">{{titleName}}</p>
	    	
	    	<div>
	    		
	    		<form-mod 
	    			v-if="moduleType === 'formMod'" 
	    			:submitBnt="true">
	    		</form-mod>
	    		
	    		<temp-admin 
	    			v-if="moduleType === 'tempAdmin' && modal">
	    		</temp-admin>
	    		
	    		<form-edit
	    			v-if="moduleType === 'formEdit' && modal"
	    			:form-edit-id = "indentId"
	    			:showUrl="viewUrl"
	    			:editUrl="editUrl">
	    		</form-edit>
	    		
	    		<form-view
	    			ref="print"
	    			v-if="moduleType === 'formView' && modal"
	    			:form-view-id = "indentId"
	    			:showUrl="viewUrl">
	    		</form-view>
	    		
	    		<pParticulars
	    			ref="print"
	    			v-if="moduleType === 'pParticulars' && modal" 
	    			:id="indentId" 
	    			:showUrl="viewUrl">
	    		</pParticulars>
	    		
	    		<purchaseEdit
	    			v-if="moduleType === 'purchaseEdit' && modal" 
	    			:id="indentId" 
	    			:editUrl="editUrl">
	    		</purchaseEdit>
	    		
	    		<roleEdit
	    			v-if="moduleType === 'roleEdit' && modal" 
	    			:row="row" 
	    			:editUrl="editUrl">
	    		</roleEdit>
	    		
	    		<userEdit 
	    			v-if="moduleType === 'userEdit' && modal" 
	    			:row="row"
	    			:editUrl="editUrl">
	    		</userEdit>
	    		
	    	</div>
	    	
	        <div slot="footer">
	        	
	        	<Button v-if="printBtn && (moduleType === 'formView' || moduleType === 'pParticulars')" type="info" icon="ios-printer" class="no-print" @click="$print($refs.print.$el)">打印</Button>
	        	
	        	<Button @click="modal = false">关闭</Button>
	        	
	        	<Button v-if="confirmBut.io" type="primary" @click="upData">{{confirmBut.name}}</Button>
	        	
	        </div>
	        
	    </Modal>
		<!--默认弹出-->
		
		<!--右侧弹出-->
	    <Modal
	    v-if="direction === 'right'"
    	:transition-names="['move-right','fade']" 
    	:width="width" 
    	v-model="modal" 
    	:mask-closable="false" 
    	:transfer="false"
    	:closable="false"
    	class-name="right-popup-modal"
    	>
    	
	    	<p slot="header">{{titleName}}</p>
	    	
	    	<div>
	    		
	    	</div>
	    	
	        <div slot="footer">
	        	
	        	<Button @click="modal = false">关闭</Button>
	        	
	        	<Button v-if="confirmBut.io" type="primary" @click="upData">{{confirmBut.name}}</Button>
	        	
	        </div>
	        
	    </Modal>
	    <!--右侧弹出-->
	    
	</div>
	
</template>

<script>
	
import formMod from '@/components/form.vue';

import tempAdmin from '@/views/systemSet/tempAdmin.vue';

import formEdit from '@/components/form-edit.vue';

import formView from '@/components/form-view.vue';

import pParticulars from '@/views/purchase/pParticulars.vue';

import purchaseEdit from '@/views/purchase/purchaseEdit.vue';

import roleEdit from '@/views/userAdmin/roleEdit.vue';

import userEdit from '@/views/userAdmin/userEdit.vue';

export default {
	components:{//模板
		
		formMod,//表单字段组建
		
		tempAdmin,//模板管理组建
		
		formEdit,//表单编辑组件
		
		formView,//表单视图组件
		
		pParticulars,//采购详情
		
		purchaseEdit,//采购编辑
		
		roleEdit,//角色编辑
		
		userEdit,//用户编辑
		
	},
	props:{
		
		moduleType: {//弹出的组件类型
			type:String,
		},
		
		width: {//弹窗宽度
			type:String,
			default: '500',
		},
		
		butName: {//按钮名称
			type: Object,
			default: () => {
				return {
					io: true,
					name: '弹窗按钮'
				}
			}
		},
		
		titleName: {//弹窗标题
			type:String,
			default: '标题名称',
		},
		
		direction:{//弹出方向
			type: String,
			default: 'defau'
		},
		
		confirmBut: {//确定按钮
			type: Object,
			default: () => {
				return {
					io: true,
					name: '确定'
				}
			}
		},
		
		printBtn: {//打印按钮
			type: Boolean,
	 		default: false,
		},
		
	},
    data () {
        return {
        	
            modal: false,
            
            indentId: '',//id
            
            viewUrl: '',//详情url
            
            editUrl: '',//编辑url
            
            row: {},
            
        }
    },
    methods: {
    	upData(){//点击更新数据
    		this.modal = false;
    		this.$emit('upPageData');//侦听父级事件
    	},
    },
    mounted(){//模板被渲染完毕之后执行
    	
    },
}
</script>

<style>
	.right-popup-modal{
		overflow:initial;
		display:flex;
    }
    .right-popup-modal .ivu-modal{
    	top:0;
    	margin:0 0 0 auto;
    }
    .right-popup-modal .ivu-modal-content{
    	width:100%;
    	height:100%;
    	margin-left:auto;
    }
    .right-popup-modal .ivu-modal-header{
    	width:100%;
    	position:absolute;
    }
    .right-popup-modal .ivu-modal-body{
    	width:100%;
    	position:absolute;
    	top:51px;
    	bottom:57px;
    	overflow: auto;
    }
    .right-popup-modal .ivu-modal-footer{
    	width:100%;
    	position:absolute;
    	bottom:0;
    }
    @media (max-width: 768px){
		.right-popup-modal .ivu-modal {
		    width: 100% !important;
		}
	}
	
	/*弹窗居中*/
	/*.vertical-center-modal{
	    display: flex;
	    align-items: center;
	    justify-content: center;
	
	}*/
	.vertical-center-modal .ivu-modal{
	    top: 50px;
	}
</style>