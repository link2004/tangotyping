<template>
<div class="h-100 flex-col text-center" :style="panelStyleObj">
  <div v-if="this.scene=='start'" class="my-auto" v-cloak>
    <div class="mx-auto" style="width:60%;">
      <div class="btn btn-primary btn-block mb-2" @click="startGame" style="font-size:2rem;">スタート(Enter)</div>
      <div class="custom-control custom-switch">
        <input type="checkbox" class="custom-control-input" id="customSwitch1" v-model="hintMode">
        <label class="custom-control-label" for="customSwitch1">答え表示モード</label>
      </div>
    </div>
  </div>
  <div v-if="this.scene=='game'" class="game-screen flex-col h-100"  v-cloak>
      <div class="my-auto">
        <div class="question my-3" style="font-size:2rem;">{{ current_question }}</div>
        <div class="card-header typing-area" style="font-size:2rem;">
          <span>{{input_string}}</span><span :style="hintStrStyleObj" id="hint-str">{{hint_string}}</span>
        </div>
        <div class="gauge progress mt-4">
          <div class="progress-bar" :style="q_gaugeStyleObj"></div>
        </div>
        <div>{{current_count}}/{{this.questions.length}}</div>
      </div>
      <div class="text-secondary border p-1" style="font-size:1rem">
        <span class="mr-5">スペースキー : 答え表示</span><span>Esc : やり直し</span>
      </div>
  </div>
  <div v-if="this.scene=='result'" class="card-body" v-cloak>
    <div class="row text-left h-100">
      <div class="col h-100 overflow-auto">
        <table class="table">
            <tbody>
              <tr>
                <th scope="col" class="p-1">問題</th>
                <th scope="col" class="p-1 text-center">ミス</th>
                <th scope="col" class="p-1 text-center">暗記</th>
              </tr>
              <tr v-for="(q,key) in this.questions" :key=key>
                <td class="col-9 p-1">
                  <div style="font-size:.9rem">{{q.japanese}}</div>
                  <div class="text-success" :class="optionCol(q.miss_count,q.isCorrect)">{{q.english}}</div>
                </td>
                <td class="text-center" :class="optionCol(q.miss_count,true)">{{q.miss_count}}</td>
                <td class="text-center" :class="optionCol(0,q.isCorrect)">
                  <div class="bi bi-circle" v-if="q.isCorrect"></div>
                  <div class="bi bi-x-lg" v-else></div>
                </td>
              </tr>
              <tr><td colspan="3"></td></tr>
              
            </tbody>
        </table>
      </div>
      <div class="col-4">
        <div class="card h-100">
          <div class="card-body flex-col">
            <div class="card-title border-bottom">リトライ設定</div>
            <div class="form-check">
              <input class="form-check-input" style="margin-top:0.5rem;" v-model="RetryOption_miss" type="checkbox" id="checkbox-missnum">
              <label for="checkbox-missnum">
                ミス数が
                <input v-model="RetryOption_miss_num" type="number" style="width:40px" min="1">
                以上
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" v-model="RetryOption_anki" type="checkbox" id="checkbox-anki">
              <label for="checkbox-anki">
                暗記していない
              </label>
            </div>
            <div class="text-center mt-auto">
              <p class="text-secondary mb-0" style="font-size:16px">赤色の問題のみ</p>
              <button class="btn btn-danger btn-block btn-lg" @click="Retry">復習 (Enter)</button>
              <button class="btn btn-primary btn-block btn-lg" @click="RetryAll">はじめから</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import api from "../api.js"
import audio_miss from "@/assets/audio/miss.mp3"
import audio_type from "@/assets/audio/type.mp3"
import "bootstrap-icons/font/bootstrap-icons.css"

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
  setStart(){
    this.start = Date.now();
  }
  update(){
    this.end = Date.now();
  }
  get getTime(){
    this.update();
    return (this.end - this.start) / 1000;
  }
}
export default {
  data() {
    return{
      audio: {
        miss: new Audio(audio_miss),
        type: new Audio(audio_type),
      },
      scene: "start", //{"start","game","result"}
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
      csvMode: false,
      isHint: false,
      hintMode: false,
      panel_col: "",
      RetryOption_miss: true,
      RetryOption_anki: true,
      RetryOption_miss_num: 1,
      }
    },
  methods:{
    startGame: function () {
      this.current_count = 0;

      //もし問題がなくなったら問題を初期化
      if (this.questions.length == 0) this.initQuestions();

      this.shuffleQuestions();
      this.startQuestion();
      this.scene = "game";
    },
    startQuestion: function () {
      // タイマースタート
      this.time.setStart();
      // 問題を更新する
      this.current_question = this.questions[this.current_count].japanese;
      this.current_answer = this.questions[this.current_count].english;
      this.input_string = "";
      this.hint_string = this.current_answer;
      this.word_index_counts = 0;
      this.miss_count = 0;
      this.isHint = this.hintMode;
    },
    nextQuestion: function () {
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
    initQuestions: function(){
      //問題をはじめからにする

      //すべての問題を初期化
      this.questions.forEach(question => {
        question.init();
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
    Retry: function(){
      //条件を満たした問題のみリトライ
      this.selectRetryQuestions();
      this.scene="start";
    },
    RetryAll: function(){
      //全ての問題をリトライ
      this.scene="start";
    },
    playSound: function (sound) {
      //音声再生
      sound.currentTime = 0; //連続して音を鳴らせるようにする
      sound.play(); //再生
    },
    onKeyDown: function (event) {
      if(event.key == "Escape")this.scene="start";
      if(this.scene=="start"){
        if(event.key == "Enter")this.startGame();
      }else if (this.scene == "game") {
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
      }else if(this.scene=="result"){
        if(event.key == "Enter")this.Retry();
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
    optionCol: function(miss_count,isCorrect){
      var state1 = this.RetryOption_miss && miss_count >= this.RetryOption_miss_num;
      var state2 = this.RetryOption_anki && !isCorrect;
      if (state1 || state2) return "text-danger";
    }
  },
  //htmlページを開いた直後
  mounted: function () {
    //タイマーを定期的に更新
    let self = this;
    setInterval(function(){self.time.update()},1000)
    //キーが押されたときのイベントを使えるようにする
    document.addEventListener("keydown", this.onKeyDown);
    console.log("addeventlistener keydown");
    var file = api.getQuestions(this.$route.params.id);
    this.questions_title = file.body.title;
    this.LoadQuestions(file.body.info.questions)
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
.flex-col{
  display:flex; 
  flex-direction: column;
}
.game-screen {
  font-size: 25px;
}
.typing-area {
  font-variant-ligatures: no-common-ligatures;
  border:solid rgb(197, 197, 197);
  border-radius: 1rem;
  
}
.title{
    font-size: 30px;
}
#hint-str {
  color:gray;
}
</style>