import api from "./api.js";


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

var vue  = new Vue({
  el: "#app",
  data: {
    audio: {
      miss: new Audio("./sounds/miss.mp3"),
      type: new Audio("./sounds/type.mp3"),
    },
    scene: "home", //{"home","game","result"}
    current_question: "",
    current_answer: "",
    current_count: 0,
    questions: [],
    all_questions_data: [],
    questions_title: "test",
    input_string: "",
    hint_string: "",//透明度によって表示切替
    word_index_counts: 0,
    time: new timer_C(), // タイマー
    miss_count: 0, // ミス数記録
    hintMode: false,
    csvMode: false,
    isHint: false,
    RetryOption_miss: true,
    RetryOption_anki: true,
    RetryOption_miss_num: 1,
  },
  methods: {
    startGame: function () {
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
        this.scene = "result";

        //次のフレームでスコアテーブルを表示
        Vue.nextTick(()=> {
          this.MakeScoreTable();
        })

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
      //ミスしたときに背景を一瞬赤くする
      document.getElementById("gameScreen").style.background =  "#ffdab9";//画面を赤く
      setTimeout(() => {
        document.getElementById("gameScreen").style.background = "#ffffff";//100ms後元に戻す
      }, 100)
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

    MakeScoreTable: function () {
      var tbody = document.getElementById("tbody");
      //tbodyを空にする
      tbody.innerHTML = "";
      for (var question in this.questions) {
        //行を生成
        var tr = document.createElement("tr");
        tbody.appendChild(tr);//行をtbodyに追加
        for (var key in this.questions[0]) {
          //dataを作成
          var td = document.createElement("td");
          var data = this.questions[question][key];

          //isCorrect true/falseを◯/×に変換
          if (key == "isCorrect")data = data? "◯" : "×";
          else if (key == "time")data = data.toFixed(2);

          td.innerHTML = data;
          tr.appendChild(td);
          
        }
        //スコアテーブルの背景色を設定
        var state1 = this.RetryOption_miss && this.questions[question]['miss_count'] >= this.RetryOption_miss_num;
        var state2 = this.RetryOption_anki && !this.questions[question]['isCorrect'];
        if (state1 || state2) 
        {
          tr.classList.add('table-danger');
        }
        else 
        {
          tr.classList.add('table-success');
        }
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
    loadCsvFile: function(e) {
      let loadedFile = [];
      let file = e.target.files[0];
      let reader = new FileReader();
      this.questions = [];//現在の途中の問題を空にする
      reader.readAsText(file);
      reader.onload = function(e) {
        let lines = e.target.result.split("\n");
        lines.pop();
        for (let i=0; i < lines.length; i++){
          let data = lines[i].split(",");
          let jp = data[0].replace('\r','');
          let en = data[1].replace('\r','');
          loadedFile[i] = [jp,en];
        } 
        vue.LoadQuestions(loadedFile);
      }
    },
  },

  //htmlページを開いた直後
  mounted: function () {
    //キーが押されたときのイベントを使えるようにする
    document.addEventListener("keydown", this.onKeyDown);
    //問題をサーバーからGET
    this.LoadQuestions(api.getQuestions());

    this.questions_title = api.getParam('title');
  },

  computed: {
    q_gaugeStyleObj: function () {
      //ゲージの長さを制御
      let width,col;
      width = (this.current_count / this.questions.length) * 100 + "%";
      if (this.current_count == this.questions.length) {
        col = "orange";
      } else {
        col = "#007BFF";
      }
      return {
        width: width,
        "background-color": col,
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
  },

  watch: {
    RetryOption_anki: function() {
      this.MakeScoreTable();
    },
    RetryOption_miss: function() {
      this.MakeScoreTable();
    },
    RetryOption_miss_num: function() {
      this.MakeScoreTable();
    }
  }
});

//更新時にアラート
window.addEventListener('beforeunload', function(e) {
  e.returnValue = '行った変更が保存されない可能性があります。';
}, false);