<template>
  <div class="app-container calendar-list-container">
  	<!--规则的内容-->
  	<!--<div class="rules-content" v-html="list.detail"></div>-->
  	
    <div class="filter-container">
	      <el-button class="filter-item" :class="{'active':dataForm.id==2}" type="primary" plain @click="spellRule(2)" >拼团</el-button>
	      <el-button class="filter-item" :class="{'active':dataForm.id==1}" type="primary" plain @click="bargainRule(1)" >砍价</el-button>
	      <el-button class="filter-item" :class="{'active':dataForm.id==3}" type="primary" plain @click="turntableRule(3)" >大转盘</el-button>
	      <el-button class="filter-item" :class="{'active':dataForm.id==4}" type="primary" plain @click="zeroRule(4)" >限时抢购</el-button>  
    </div>
    
    <div class="filter-container" style="width:70%;height: auto;">
    		<editor :init="editorInit" v-model='listQuery.detail'></editor>
    	<div slot="footer" class="dialog-footer" style="float:right">
         <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </div>
     
  </div>
</template>

<script>
import {readRule,updateRule} from '@/api/activityrule'
import Editor from '@tinymce/tinymce-vue'

export default {
  components: { Editor },
  data() {
    return {
    	list:'',
			listQuery:{
				id:undefined,
				detail:undefined
			},
			dataForm:{
				id:2
			},
			textContent:[],
    	editorInit: {
        language: 'zh_CN',
        plugins: ['advlist anchor autolink autoresize autosave emoticons fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
        toolbar: ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript ', 'hr bullist numlist link image charmap preview anchor pagebreak fullscreen media table emoticons forecolor backcolor'],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          createStorage(formData).then(res => {
            success(res.data.data.url)
          }).catch(() => {
            failure('上传失败，请重新上传')
          })
        }
      }
    }
  },
  created() {
  	this.getRules();
  },
  methods: {
  	//数据交互；
			getRules(){
				readRule(this.dataForm).then(response => {
					this.listQuery = response.data.data;
	      })
			},
		//拼团规格
			spellRule(id){
				this.dataForm.id = id;
				this.getRules();
			},
		//砍价规格
			bargainRule(id){
				this.dataForm.id = id;
				this.getRules();
			},
		//大转盘规格
			turntableRule(id){
				this.dataForm.id = id;
				this.getRules();
			},
		//零元购规格
			zeroRule(id){
				this.dataForm.id = id;
				this.getRules();
			},
		//点击提交按钮
			createData(id){
				var _this = this;
				this.listQuery.id = this.dataForm.id;
				updateRule(this.listQuery).then(response => {
					console.log(response)
					_this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })

	      })
			}
  }
  
}
</script>
<style type="text/css" scoped>
.el-button--primary.active {
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
}
</style>

