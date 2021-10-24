import api from "./api.js";


class question_C {
  constructor(japanese, english) {
    this.japanese = japanese;
    this.english = english;
    this.time = 0;
    this.miss_count = 0;
  }
  in(japanese, english) {
    this.japanese = japanese;
    this.english = english;
  }
  savePlayData(time, miss_count) {
    this.time = time;
    this.miss_count = miss_count;
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
    input_string: "",
    hint_string: "",//透明度によって表示切替
    word_index_counts: 0,
    time: new timer_C(), // タイマー
    miss_count: 0, // ミス数記録
    hintMode: false,
  },
  methods: {
    startGame: function () {
      // ゲームスタート
      //もし問題がなくなったら初めからにする
      if (this.questions.length == 0)this.questions = this.all_questions_data;

      this.questions = this.shuffle(this.questions); //問題をシャッフル
      this.updateQuestion();
      // this.startFlg = true
      this.scene = "game";
    },
    updateQuestion: function () {
      // タイマースタート
      this.time.saveDate(1);
      // 問題を更新する
      this.current_question = this.questions[this.current_count].japanese;
      this.current_answer = this.questions[this.current_count].english;
      this.input_string = "";
      this.hint_string = this.current_answer;
      this.word_index_counts = 0;
      this.miss_count = 0;
    },
    nextQuestion: function () {
      // タイマーストップ
      this.time.saveDate(0);
      // 時間とミス数の保存
      this.questions[this.current_count].savePlayData(
        this.time.getTime,
        this.miss_count
      );
      // 次の問題に進む
      this.current_count += 1;
      // 最後の問題なら
      if (this.current_count == this.questions.length) {
        this.scene = "result";

        //次のフレームでスコアテーブルを表示
        Vue.nextTick(()=> {
          this.scoreTable();
        })

      } else {
        this.updateQuestion();
      }
      
    },
    retry: function () {
      // リトライ
      this.current_count = 0;
      this.scene = "game";

      //missが0の問題を消す
      this.questions = this.questions.filter((quesiton) => {
        return quesiton.miss_count > 0
      });
      console.log(this.questions);

      this.startGame();
    },
    panelBlick: function(){
      //ミスしたときに背景を一瞬赤くする
      document.getElementById("gameScreen").style.background =  "#ffdab9";//画面を赤く
      setTimeout(() => {
        document.getElementById("gameScreen").style.background = "#ffffff";//100ms後元に戻す
      }, 100)
    },
    shuffle: function (array) {
      // 問題をシャッフル
      for (let i = array.length - 1; i > 0; i--) {
        let r = Math.floor(Math.random() * (i + 1));
        let tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
      }
      return array;
    },
    playSound: function (sound) {
      //音声再生
      sound.currentTime = 0; //連続して音を鳴らせるようにする
      sound.play(); //再生
    },
    
    onKeyDown: function (event) {
      //ゲーム画面
      if (this.scene == "game") {
        //入力したキーがあっているならば
        if (event.key == this.current_answer[this.word_index_counts]) {

          this.playSound(this.audio.type); //タイプ音
          this.input_string += event.key;
          this.hint_string = this.hint_string.slice(1);//先頭文字を削除
          this.word_index_counts++;

          //もし単語を入力し終わったら
          if (this.word_index_counts == this.current_answer.length) {
            this.nextQuestion(); //次の問題へ
          }
        } else {
          this.miss_count++;
          this.playSound(this.audio.miss); //ミス音
          this.panelBlick();
        }
      }

      //リザルト画面のとき，Enterでリトライ
      if ((this.scene == "result") & (event.key == "Enter")) {
        this.retry();
      }
    },

    scoreTable: function () {
      for (var question in this.questions) {
        //行を生成
        var tr = document.createElement("tr");
        document.getElementById("tbody").appendChild(tr);//行をtbodyに追加
        for (var key in this.questions[0]) {
          //dataを作成
          var td = document.createElement("td");
          var data = this.questions[question][key];
          td.innerHTML = data;
          tr.appendChild(td);
          
        }
        //スコアテーブルの背景色を設定
        if (this.questions[question]['miss_count'] > 0) 
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
      for (let i=0; i < file.length; i++){
        let jp = file[i][0];
        let en = file[i][1];
        this.all_questions_data.push(new question_C(jp,en));
      }
      this.questions = this.all_questions_data;
    },
    loadCsvFile: function(e) {
      let loadedFile = [];
      let file = e.target.files[0];
      let reader = new FileReader();
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

    var q = api.getQuestions();
    console.log("load success!:",q);
    console.log("length:",q.length);
    this.LoadQuestions(q);
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
      let opacity,transition;
      if (this.miss_count > 0　|| this.hintMode){
        //表示
        opacity = 1;
        transition = "0.5s"
      } else {
        //非表示
        opacity = 0;
        transition = "0s"
      }
      return {"opacity": opacity, "transition": transition}
    }
  },
});

//更新時にアラート
window.addEventListener('beforeunload', function(e) {
  e.returnValue = '行った変更が保存されない可能性があります。';
}, false);