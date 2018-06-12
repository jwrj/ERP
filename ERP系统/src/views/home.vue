<template>

	<div>
		
		<Card>
			首页
		</Card>
			
	</div>
	
</template>

<script>
export default {
	components:{//模板
		
	},
	props:{
		
	},
    data () {//数据
        return {
        	
        }
    },
    methods: {//方法
    	
    	ajax(){
    		
    		this.$axios.post('接口路径', {
    			
			})
			.then(response => {
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
</style>