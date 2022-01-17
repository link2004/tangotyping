<template>
<div class="card">
  <div v-if="this.scene=='home'" v-cloak>
    <div class="card-header title">{{questions_title}}</div>
    <div class="card-body option">
      <input v-model="hintMode" type="checkbox">答えを常に表示<br>
      <button class="btn btn-primary btn-lg" @click="startGame">ゲームスタート(Enter)</button>
    </div>
  </div>
  <div v-if="this.scene=='game'" class="game-screen card-body" :style="panelStyleObj" v-cloak>
    <div class="question">{{ current_question }}</div>
    <div class="card-header border-0 typing-area">
      <span>{{input_string}}</span><span :style="hintStrStyleObj" id="hint-str">{{hint_string}}</span>
    </div>
    
    <div class="gauge progress mt-4">
      <div class="progress-bar" :style="q_gaugeStyleObj"></div>
    </div>
    <div>{{current_count}}/{{this.questions.length}}</div>
  </div>
  <div v-if="this.scene=='result'" class="card-body" v-cloak>
    <h1 style="color:orange;">Clear!</h1>
    <button class="btn btn-primary" @click="startGame">リトライ(Enter)</button>
    <button class="btn btn-secondary" @click="returnHome">戻る(Esc)</button>
    <p><input v-model="hintMode" type="checkbox">答えを常に表示</p>
    <div class="card option">
      <div class="card-header">リトライ設定</div>
      <div class="card-body">
        <input v-model="RetryOption_miss" type="checkbox">ミス数が <input v-model="RetryOption_miss_num" type="number" style="width:40px" min="0"> 以上の問題<br>
        <input v-model="RetryOption_anki" type="checkbox">暗記していない問題<br>
      </div>
    </div>
    <div class="card">
      <div class="card-header">結果</div>
      <div class="card-body" id="scoretable">
        <table class="table table-bordered table-sm">
          <thead>
            <tr class="table-light">
              <th scope="col">問題</th>
              <th scope="col">解答</th>
              <th scope="col">時間</th>
              <th scope="col">ミス</th>
              <th scope="col">暗記</th>
            </tr>
            <tr v-for="(q,key) in this.questions" :key=key :class="tableCol(q.miss_count,q.isCorrect)">
              <td>{{q.japanese}}</td>
              <td>{{q.english}}</td>
              <td>{{q.time}}</td>
              <td>{{q.miss_count}}</td>
              <td><div v-if="q.isCorrect">◯</div><div v-else>×</div></td>
            </tr>
          </thead>
          <tbody id="tbody">
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import api from "../api.js"

class question_C {
  constructor(japanese, english) {
    this.japanese = japanese;
    this.english = english;
    this.time = 0;
    this.miss_count = 0;
    this.isCorrect = true;
  }
  savePlayData(time, miss_count, isCorrect) {
    this.time = time;
    this.miss_count = miss_count;
    this.isCorrect = isCorrect;
  }
  init() {
    this.time = 0;
    this.miss_count = 0;
    this.isCorrect = true;
  }
}
class timer_C {
  constructor() {
    this.start = 0;
    this.end = 0;
  }
  get getTime() {
    // 秒単位で時間を返す
    return (this.end - this.start) / 1000;
  }
  saveDate(mode) {
    // 引数が1でタイマースタート、0でストップ
    if (mode) {
      this.start = Date.now();
    } else {
      this.end = Date.now();
    }
  }
}
export default {
  data() {
    return{
      audio: {
        miss: new Audio("../audio/miss.mp3"),
        type: new Audio("../audio/type.mp3"),
      },
      scene: "home", //{"home","game","result"}
      current_question: "",
      current_answer: "",
      current_count: 0,
      questions: [],
      all_questions_data: [
        new question_C("りんご","apple"),
        new question_C("ぶどう","grape"),
        new question_C("ばなな","banana"),
      ],
      questions_title: "test",
      input_string: "",
      hint_string: "",//透明度によって表示切替
      word_index_counts: 0,
      time: new timer_C(), // タイマー
      miss_count: 0, // ミス数記録
      hintMode: false,
      csvMode: false,
      isHint: false,
      panel_col: "",
      RetryOption_miss: true,
      RetryOption_anki: true,
      RetryOption_miss_num: 1,
      }
    },
  methods:{
    startGame: function () {
      console.log("startGame");
      this.current_count = 0;

      //復習条件を満たしている問題を選択
      this.selectRetryQuestions();

      //もし問題がなくなったら問題を初期化
      if (this.questions.length == 0) this.initQuestions();

      this.shuffleQuestions();
      this.startQuestion();
      this.scene = "game";
    },
    startQuestion: function () {
      // タイマースタート
      this.time.saveDate(1);
      // 問題を更新する
      console.log(this.questions);
      this.current_question = this.questions[this.current_count].japanese;
      this.current_answer = this.questions[this.current_count].english;
      this.input_string = "";
      this.hint_string = this.current_answer;
      this.word_index_counts = 0;
      this.miss_count = 0;
      this.isHint = this.hintMode;
    },
    nextQuestion: function () {
      // タイマーストップ
      this.time.saveDate(0);
      // 時間とミス数の保存
      this.questions[this.current_count].savePlayData(
        this.time.getTime,
        this.miss_count,
        !this.isHint
      );
      // 次の問題に進む
      this.current_count += 1;
      // 最後の問題なら
      if (this.current_count == this.questions.length) {
        setTimeout(()=>{this.scene="result"},500);
      } else {
        this.startQuestion();
      }
      
    },
    returnHome: function(){
      this.initQuestions();
      this.scene = "home";
    },
    initQuestions: function(){
      //問題をはじめからにする

      //すべての問題を初期化
      this.questions.forEach(question => {
        question.init();
        console.log("init questions")
      });

      this.questions = this.all_questions_data;
    },
    panelBlick: function(){
      this.panel_col = "#ffdab9";//画面を赤く
      setTimeout(()=>{this.panel_col = "#ffffff"},100);//100ms後元に戻す
    },
    shuffleQuestions: function () {
      // 問題をシャッフル
      let Q = this.questions;
      for (let i = Q.length - 1; i > 0; i--) {
        let r = Math.floor(Math.random() * (i + 1));
        let tmp = Q[i];
        Q[i] = Q[r];
        Q[r] = tmp;
      }
      this.questions = Q;
    },
    selectRetryQuestions: function(){
      //復習条件を満たしている問題の選別
      var selectedQuestions = [];
      for (var question in this.questions){
        var state1 = this.RetryOption_miss && this.questions[question]['miss_count'] >= this.RetryOption_miss_num;
        var state2 = this.RetryOption_anki && !this.questions[question]['isCorrect'];
        if (state1 || state2) {
          selectedQuestions.push(this.questions[question]);
        }
      }
      this.questions = selectedQuestions;
    },
    playSound: function (sound) {
      //音声再生
      sound.currentTime = 0; //連続して音を鳴らせるようにする
      sound.play(); //再生
    },
    onKeyDown: function (event) {
      if (event.key == "Escape")this.returnHome();
      if (this.scene == "game") {
        if (this.current_question == this.questions.length)return;
        //スペースキーが押されたら答え表示
        if (event.key == " "){
          this.isHint = true;
        }else if (event.key.length == 1){
          if (this.current_answer[this.word_index_counts] == event.key) {
            //入力したキーがあっているならば
            this.playSound(this.audio.type); //タイプ音
            var key = event.key;
            do{
              this.input_string += key;
              this.hint_string = this.hint_string.slice(1);//先頭文字を削除
              this.word_index_counts++;
              key = " ";
            }while (this.current_answer[this.word_index_counts] == " ")

            //もし単語を入力し終わったら
            if (this.word_index_counts == this.current_answer.length) {
              this.nextQuestion(); //次の問題へ
            }

          } else {
            //間違えたなら
            this.miss_count++;
            this.playSound(this.audio.miss); //ミス音
            this.panelBlick();
          }
        }
        
      }
      else if (event.key == "Enter") {
        this.startGame();
      }
    },
    LoadQuestions: function(file){
      this.all_questions_data = [];
      for (let i=0; i < file.length; i++){
        let jp = file[i][0];
        let en = file[i][1];
        this.all_questions_data.push(new question_C(jp,en));
      }
    },
    tableCol: function(miss_count,isCorrect){
      var state1 = this.RetryOption_miss && miss_count >= this.RetryOption_miss_num;
      var state2 = this.RetryOption_anki && !isCorrect;
      if (state1 || state2) return "table-danger";
      else return "table-success";
    }
  },
  //htmlページを開いた直後
  mounted: function () {
    //キーが押されたときのイベントを使えるようにする
    document.addEventListener("keydown", this.onKeyDown);
    var file = api.getQuestions(this.$route.params.id);
    this.questions_title = file.body.title;
    this.LoadQuestions(file.body.info.questions);
  },
  computed: {
    q_gaugeStyleObj: function () {
      //ゲージの長さを制御
      let width;
      width = (this.current_count / this.questions.length) * 100 + "%";
      return {
        width: width,
        "background-color": "#007BFF",
      };
    },
    hintStrStyleObj: function() {
      //ヒントの文字列を表示切替
      var opacity,transition;
      if (this.isHint){
        //表示
        opacity = 1;
        transition = "0.2s"
      } else {
        //非表示
        opacity = 0;
        transition = "0s"
      }
      return {"opacity": opacity, "transition": transition}
    },
    panelStyleObj: function() {
      return {"background":this.panel_col}
    }
  },
}
</script>
<style>
.game-screen {
  font-size: 25px;
}
.typing-area {
  font-variant-ligatures: no-common-ligatures;
}
.card {
    margin:20px;
}
.title{
    font-size: 30px;
}
#hint-str {
  color:gray;
}
#scoretable{
    max-height:300px;
    overflow-y: scroll;
}
</style>