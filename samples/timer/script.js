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
    input_string: "",
    word_index_counts: 0,
    miss_flg: "",
    time: new timer_C(), // タイマー
    miss_count: 0, // ミス数記録
    mondai: {
      "林檎":"apple",
      "葡萄":"grape",
      "檸檬":"lemon",
      "蜜柑":"orange",
    },
  },
  methods: {
    startGame: function () {
      // ゲームスタート
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

        //この時点ではまだスコアテーブルが表示されていないため，次のフレームに実行
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
      this.startGame();
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
          // 画面の色を不正解色から直す
          this.miss_flg = false;

          this.playSound(this.audio.type); //タイプ音
          this.input_string += event.key;
          this.word_index_counts++;

          //もし単語を入力し終わったら
          if (this.word_index_counts == this.current_answer.length) {
            this.nextQuestion(); //次の問題へ
          }
        } else {
          this.miss_count++;
          this.playSound(this.audio.miss); //ミス音
          this.miss_flg = true;
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
      }
    },
  },

  //htmlページを開いた直後
  mounted: function () {
    //キーが押されたときのイベントを使えるようにする
    document.addEventListener("keydown", this.onKeyDown);

    // 問題追加(仮)
    for (var jp in this.mondai){
      var en = this.mondai[jp]
      this.questions.push(new question_C(jp,en))
    }
  },

  computed: {
    gaugeStyleObj: function () {
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
    cardStyleObj: function () {
      //ミスしたときのカードの色を制御
      if (this.miss_flg) col = "#ffdab9";
      else col = "#ffffff";
      return {
        "background-color": col,
      };
    },
  },
});
