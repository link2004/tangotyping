
class question_C {
  constructor(japanese, english) {
    this.japanese = japanese;
    this.english = english;
    this.time = 0;
    this.miss_count = 0;
    this.isCorrect = true;
  }
  in(japanese, english) {
    this.japanese = japanese;
    this.english = english;
  }
  savePlayData(time, miss_count, isCorrect) {
    this.time = time;
    this.miss_count = miss_count;
    this.isCorrect = isCorrect;
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
new Vue({
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
    isHint: false,
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
      this.isHint = false;
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
        //スペースキーが押されたら答え表示
        if (event.key == " "){
          this.isHint = true;
        }else{
          //入力したキーがあっているならば
          if (this.current_answer[this.word_index_counts] == event.key) {
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
            this.miss_count++;
            this.playSound(this.audio.miss); //ミス音
            this.panelBlick();
          }
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

          //data true/falseを◯/×に変換
          if (typeof(data) == "boolean")data = data? "◯" : "×";

          td.innerHTML = data;
          tr.appendChild(td);
          
        }
        //スコアテーブルの背景色を設定
        if (this.questions[question]['isCorrect']) 
        {
          tr.classList.add('table-success');
        }
        else 
        {
          tr.classList.add('table-danger');
        }
      }
    },
    loadCsvFile: function(e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        let lines = reader.result.split("\n");
        lines.pop();
        console.log(lines)
        for (let i=0; i < lines.length; i++){
          data = lines[i].split(",");
          jp = data[0].replace('\r','');
          en = data[1].replace('\r','');
          console.log(typeof en)
          this.all_questions_data.push(new question_C(jp,en));
        }
      }
      this.questions = this.all_questions_data;
    }
  },

  //htmlページを開いた直後
  mounted: function () {
    //キーが押されたときのイベントを使えるようにする
    document.addEventListener("keydown", this.onKeyDown);
  },

  computed: {
    q_gaugeStyleObj: function () {
      //ゲージの長さを制御
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
      if (this.isHint || this.hintMode){
        //表示
        opacity = 1;
        transition = "0.2s"
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