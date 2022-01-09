<template>
<div class="card-body" :style="panelStyleObj">
    <div class="typeFormWrapper">
        <div class="question">{{ current_question }}</div>
        <div class="card-header border-0">
            <span>{{input_string}}</span><span id="hint-str" :style="hintStrStyleObj" >{{hint_string}}</span>
        </div>
        <div class="gauge progress mt-4">
            <div class="progress-bar" :style="q_gaugeStyleObj"></div>
        </div>
        <div>{{current_count}}/{{this.questions.length}}</div>
        <div id="miss_count">{{miss_count}} miss</div>
    </div>
</div>
</template>

<style>
#hint-str{color:gray;}
#miss_count{text-align: right}
</style>

<script>
const MISS_SE = new Audio("../audio/miss.mp3");
const TYPE_SE = new Audio("../audio/type.mp3");
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
            questions: [
                new question_C("りんご","apple"),
                new question_C("ぶどう","grape"),
                new question_C("ばなな","banana"),
                ],
            current_question: "aaaa",
            current_answer: "aiueo",
            current_count: 0,
            input_string: "",
            hint_string:"aiueo",
            word_index_counts: 0,
            isHint: false,
            HintMode: false,
            miss_count: 0,
            time: new timer_C(),
            panel_col: "#ffffff",
        }
    },
    methods: {
        startGame: function() {
            this.current_count = 0;
            this.startQuestion();
        },
        startQuestion: function() {
            // タイマースタート
            this.time.saveDate(1);
            this.current_question = this.questions[this.current_count].japanese;
            this.current_answer = this.questions[this.current_count].english;
            this.input_string = "";
            this.hint_string = this.current_answer;
            this.word_index_counts = 0;
            this.miss_count = 0;
            this.isHint = this.hintMode;
        },
        nextQuestion: function(){
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
                //リザルト画面へ移動
                setTimeout(()=>{this.$router.push('/typing/result')},500);
            } else {
                this.startQuestion();
            }
        },
        panelBlick: function(){
            this.panel_col = "#ffdab9";//画面を赤く
            setTimeout(()=>{this.panel_col = "#ffffff"},100);//100ms後元に戻す
        },
        playSound: function(sound){
            sound.currentTime = 0; //連続して音を鳴らせるようにする
            sound.play(); //再生
        },
        onKeyDown: function(event) {
            if (this.current_count == this.questions.length)return;
            if (event.key == " ") this.isHint = true;
            else if (this.current_answer[this.word_index_counts] == event.key){
                this.playSound(TYPE_SE);
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
                this.playSound(MISS_SE); //ミス音
                this.panelBlick();
            }
        }
    },
    mounted: function(){
        document.addEventListener("keydown", this.onKeyDown);
        this.startGame();
    },
    computed: {
        q_gaugeStyleObj: function() {
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
        panelStyleObj: function() {
            return {"background":this.panel_col}
        }
    }
}
</script>