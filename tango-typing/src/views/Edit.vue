<template>
  <div class="container" id="app">
      <p>移動：矢印キー,Tab,Enter 行追加：最下行でEnter
      </p>
      <div class="top-btn">
        <div class="btn-left">
          <router-link class="btn btn-secondary" to="/">戻る</router-link>
        </div>
        <div class="btn-right">
          <button class="btn btn-danger" v-b-modal.delete-mdl v-if="mode=='update'">削除</button>
        </div>
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="basic-addon1">タイトル</span>
        </div>
        <input type="text" class="form-control" v-model="question_title">
      </div>
      <div>
        <table class="table table-bordered" id="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">問題(日本語)</th>
              <th scope="col">答え(英語)</th>
            </tr>
          </thead>
          <draggable v-model="questions" tag="tbody" :options="{handle:'.handle',animation:300}" ghost-class="ghost">
            <tr v-for="(question,key) in this.questions" :key=key valign="middle">
              <th scope="row">{{key+1}}</th>
              <td><input type="text" ref="input" @focus="setFocus(key*2)" v-model="questions[key][0]" :style="Find_blank(key,0)"></td>
              <td><input type="text" ref="input" @focus="setFocus(key*2+1)" v-model="questions[key][1]" :style="Find_blank(key,1)"></td>
              <td class="bi bi-trash-fill btn-light" style="line-height:2.5rem;" @click="ClickedDelLine(key)"></td>
              <td class="handle bi bi-list" style="line-height:2.5rem;"></td>
            </tr>
          </draggable>
          
          
        </table>
       <button class="btn btn-outline-secondary btn-block mb-3" @click="AddLine">行を追加</button>
      </div>
      
      <b-alert class="mb-3" variant="danger" :show="blankAlert">空白を含む行があります</b-alert>
      <div class="bottom-btn">
      <button class="btn btn-primary btn-block" @click="ClickedSaveBtn" v-if="mode=='new'">保存</button>
      <button class="btn btn-primary btn-block" @click="ClickedUpdateBtn" v-if="mode=='update'">更新</button>
      </div>
      
      <b-modal id="del-line" @ok="DelLine(delLineIndex)" hide-header ok-title="削除">
        <p class="my-2">行を削除しますか？</p>
      </b-modal>

      <b-modal id="update-mdl" @ok="Update" ok-title="更新" :title="question_title+'を更新'">
        <p class="my-2">問題を更新しますか？</p>
      </b-modal>

      <b-modal id="save-mdl" @ok="Save" ok-title="保存" :title="question_title+'を保存'">
        <p class="my-2">問題を保存しますか？</p>
      </b-modal>

      <b-modal id="delete-mdl" @ok="Delete" ok-title="削除" ok-variant="danger" :title="question_title+'を削除'">
        <p class="my-2">本当に削除しますか？</p>
      </b-modal>

  </div>
</template>

<script>
import api from '../api.js'
import draggable from 'vuedraggable'
import "bootstrap-icons/font/bootstrap-icons.css";

export default {
  components: {
    'draggable': draggable,
  },
  data() {
    return {
      question_title:"新規データ",
      questions: [],
      draggingIndex: null,
      focusIndex: 0,
      message: "",
      mode: "",
      token: null,
      tableID: null,
      delLineIndex: null,
      blankAlert: false,
    }
  },
  methods:{
    setData: function(){
      var data = api.getQuestions(this.tableID);
      if(data.statusCode == 200){
        this.question_title = data.body.title;
        this.questions = data.body.info.questions;
        console.log(this.questions);
        return true
      }else{
        return false
      }
    },
    ClickedSaveBtn: function(){
      this.deleteNull();
      if(this.check_blank()){
        this.blankAlert = true;
        return;
      }
      this.$bvModal.show("save-mdl");
    },
    ClickedUpdateBtn: function(){
      this.deleteNull();
      if(this.check_blank()){
        this.blankAlert = true;
        return;
      }
      this.$bvModal.show("update-mdl");
    },
    ClickedDelLine: function(i){
      console.log(i,this.questions[i]);
      if(this.questions[i][0]==""&&this.questions[i][1]==""){
        this.DelLine(i);
      }else{
        this.delLineIndex = i;
        this.$bvModal.show("del-line");
      }
    },
    deleteNull: function (){
      //未入力の行を削除
      var i;
      for(i=0;i<this.questions.length;i++){
        var v1 = this.questions[i][0];
        var v2 = this.questions[i][1];
        if(v1==""&&v2==""){
          console.log("未入力の行:",i)
          this.questions.splice(i,1);
          i-=1;
        }
      }
      //全ての行が消えてしまったら
      if(this.questions.length==0)this.AddLine();
    },
    check_blank: function(){
      //未入力のマスを検出
      var i;
      for(i=0;i<this.questions.length;i++){
        var v1 = this.questions[i][0];
        var v2 = this.questions[i][1];
        if(v1==""||v2==""){
          return true
        }
      }
      return false
    },
    Save: function(){
      var response = api.putQuestions(this.token, this.question_title, this.questions);
      if(response.statusCode == 200){
        this.$cookies.set('TableID',response.Item.id);
        this.$router.replace('/');
      }
      
    },
    Update: function(){
      var response = api.updateQuestions(this.token, this.question_title, this.questions, this.tableID);
      if(response.statusCode == 200){
        this.$cookies.set('TableID',response.Item.id);
        this.$router.replace('/');
      }
    },
    Delete: function(){
      var response = api.deleteQuestions(this.token,this.tableID);
      if(response.statusCode == 200){
        this.$router.replace('/');
      }
    },
    moveFocus: function(move){
      this.$nextTick(()=>{
        if(this.focusIndex+move<this.questions.length*2
        && this.focusIndex+move>=0){
          this.focusIndex+=move;
        }
      });
    },
    setFocus: function(index){
      this.focusIndex = index;
    },
    AddLine: function(){
      this.questions.push(["",""]);
    },
    DelLine: function(index){
      this.questions.splice(index,1);
    },
    onKeyDown: function(event){
      switch (event.key){
        case "ArrowRight":
          this.moveFocus(1);
          break;
        case "ArrowLeft":
          this.moveFocus(-1);
          break;
        case "Enter":
        case "ArrowDown":
          if(this.focusIndex>=(this.questions.length-1)*2)this.AddLine();
          this.moveFocus(2);
          break;
        case "ArrowUp":
          this.moveFocus(-2);
          break;
      }
    },
    Find_blank: function(key,i){
      if(this.questions[key][i]==""){
        return {"background-color":"rgb(230, 230, 230)"};
      }else{
        return {"background-color":"white"};
      }
    }
  },
  mounted: function(){
    document.addEventListener("keydown", this.onKeyDown);

    //cookieから変数を読み込む
    this.token  = this.$cookies.get('LoginToken');
    this.tableID = this.$cookies.get('TableID');

    //ログインしてなかったらログイン画面へ飛ばす
    if(this.token == "null") this.$router.replace('/login');
    
    //tableIDの有無により新規作成か編集か判別
    if(this.setData()){
      this.mode = "update";
    }else{
      this.mode = "new"
      this.AddLine();
    }

    
  },
  watch: {
    focusIndex: function(){
      this.$refs.input[this.focusIndex].select();
    },
    questions: function(){
      if(this.check_blank()==false)this.blankAlert=false;
    }
  }
}
</script>

<style>
.container {
  margin-top: 2rem;
  margin-bottom: 7rem;
}
.table input:focus{
  border-color:skyblue !important;
  background-color:white !important;
  outline: 0 none;
}
.table input,.table i{
  width: 100%;
  height: 100%;
  border: solid;
  border-color: white;
  background-color:transparent
}
.table td{
  padding: 0 !important;
  height: 0rem;
}
.table tr{
  line-height: 1rem;
}
.top-btn{
  display:flex;
  padding-bottom: 1rem;
}
.btn-left{
  margin-right: auto;
}
.top-btn .btn {
  padding-right: 2rem;
  padding-left: 2rem;
}
.bottom-btn{
  display:flex;
}
.bottom-btn button{
  height: 3rem;
}
.ghost{
  opacity: 60%;
}
</style>