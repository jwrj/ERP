<template>
	
	<Card ref="instance" style="padding:15px 0;" :bordered="false" dis-hover>
		
		<Form ref="formDynamic" :model="formDynamic" class="form">
			
			<div :style="{width:obj.width,'padding-left':'15px'}" v-for="(obj,index) in formDynamic.data" v-if="obj.status">
				
				<Row>
					
					<Col :span="obj.lw">
						
						<p v-if="readOnly" style="padding:10px 0 10px;text-align: right;">{{obj.label}}：</p>
						
						<FormItem v-if="!readOnly" :prop="'data.' + index + '.label'" :rules="labelValidate">
							<div class="col">
								<Input v-model="obj.label" clearable placeholder="请输入名称"></Input>
							</div>
						</FormItem>
						
					</Col>
					
					<Col :span="obj.rw">
						
						<p v-if="readOnly" style="padding:10px;color: #495060;">{{obj.value}}</p>
						
						<FormItem v-if="!readOnly" :prop="'data.' + index + '.value'">
							<div class="col col-2">
								<Input :disabled="operability ? operability : false" v-model="obj.value" placeholder="请输入内容" clearable v-if="obj.type == 'text'"></Input>
								<DatePicker :disabled="operability ? operability : false" @on-change="dateVal(index,$event)" :value="obj.value" type="date" placeholder="请选择日期" style="width:100%;" v-if="obj.type == 'date'"></DatePicker>
								<Input :disabled="operability ? operability : false" v-model="obj.value" type="textarea" :autosize="{minRows: 1,maxRows: 5}" placeholder="请输入内容" v-if="obj.type == 'textfield'"></Input>
								<Button type="ghost" @click="remove(index)" class="del">删除</Button>
							</div>
						</FormItem>
						
					</Col>
					
				</Row>
				
			</div>
			
		</Form>
		
		<div style="text-align: center;" v-if="!readOnly">
			
			<Poptip :transfer="true" title="选择类型" placement="top">
				
		        <div slot="content">
		        	
		        	<Form :label-width="50" class="form2">
		        		
						<FormItem label="尺寸 :" class="lab-title">
							
							<RadioGroup v-model="formItem.radio1">
								<Radio label="1">短</Radio>
								<Radio label="2">长</Radio>
							</RadioGroup>
							
						</FormItem>
						
						<FormItem label="类型 :" class="lab-title">
							
							<RadioGroup v-model="formItem.radio2">
								<Radio label="text">单行文本</Radio>
								<Radio label="textfield">多行文本</Radio>
								<Radio label="date">日期</Radio>
							</RadioGroup>
							
						</FormItem>
						
					</Form>
					
					<div style="margin-top:10px;">
						
						<Button type="primary" long @click="add">添加</Button>
						
		        	</div>
		        	
		        </div>
		        
		        <Button type="dashed" icon="plus-round">增加字段</Button>
		        
		    </Poptip>
		    
		</div>
	    
	    <div v-if="submitBnt ? submitBnt : false" style="text-align: center;margin-top:20px;">
	    	
	    	<Button type="primary" @click="handleSubmit('formDynamic')">提交</Button>
	    	
	    	<Button type="ghost" @click="handleReset('formDynamic')" style="margin-left: 8px">重置</Button>
	    	
	    </div>
	    
	</Card>
	
</template>

<script>
	export default {
		props:{
			
			pid:{//属于哪个表单id
				type:Number,
//				required: true
			},
			
			formData:Array,//表单数据
			
			submitBnt:Boolean,//内部提交按钮
			
			readOnly:{//只读
				type:Boolean,
				default:false,
			},
			
			operability:Boolean,//可操作
			
		},
		data() {
			return {
				
				formItem: {
					radio1: '1',
					radio2: 'text'
				},
				
				Short:['50%',8,16],
				
				Long:['100%',4,20],
				
				formDynamic:{
					data:this.formData || [],
				},
				
				labelValidate: [
                    { required: true, message: '必须输入名称', trigger: 'blur' }
                ]
				
			}
		},
		methods: {
			add() {
				let num = this.formItem.radio1 == '1' ? this.Short : this.Long;
				this.formDynamic.data.push({
					id:'',
					pid_ft:this.pid || '',
					width:num[0],
					lw:num[1],
					rw:num[2],
					label:'',
					value:'',
					type:this.formItem.radio2,
					status:1
				});
			},
			cancel () {
                this.$Message.info('点击了取消');
           	},
			dateVal(index,val){
				this.formDynamic.data[index].value = val;
			},
			remove(index){
				this.formDynamic.data[index].status = 0;//状态为0表示以删除
			},
			handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('提交成功!');
                        console.log(this.formDynamic.data);
                    } else {
                        this.$Message.error('提交失败');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
		},
		watch:{//监测数据变化
			formDynamic:{//侦听对象内部数据
				handler(v1,v2){
					this.$emit('increment');//侦听父级事件
				},
				deep:true// 深度 watcher
			},
			'formData'(v){
				this.formDynamic.data = v;
				
			}
		},
		mounted(){
			
		}
	}
</script>

<style scoped>
	.form{
		padding-right:15px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.col{
		display:flex;
	}
	.col-2{
		padding-left:5px;
	}
	.del{
		margin-left:5px;
	}
	.submit{
		text-align: center;
		margin-top:20px;
	}
	
</style>

<style>
	.lab-title .ivu-form-item-label{
		font-size:14px !important;
		font-weight: bold;
	}
</style>