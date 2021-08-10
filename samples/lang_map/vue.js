
new Vue({
    el: "#app",
    data:{
        audio: {
            miss:new Audio('./sounds/miss.mp3'),
            type:new Audio('./sounds/type.mp3'),
        },
        scene:"home",//{"home","game","result"}
        current_question:"",
        current_answer:"",
        current_count:0,
        questions:[// [英語,日本語]
            ["test0","テスト0"],
            ["test1","テスト1"],
            ["test2","テスト2"],
        ],
        input_string:"",
        word_index_counts:0,
        miss_flg:"",

        // debug
        lang_mode:0,// 0が通常
    },
    methods:{
        startGame:function(){
            //　ゲームスタート
            this.questions = this.shuffle(this.questions)//問題をシャッフル
            this.updateQuestion()
            // this.startFlg = true
            this.scene = "game"
        },
        updateQuestion:function(){
            // 問題を更新する
            this.current_answer = this.questions[this.current_count][0^this.lang_mode]
            this.current_question = this.questions[this.current_count][1^this.lang_mode]
            this.input_string = ""
            this.word_index_counts = 0
        },
        nextQuestion:function(){
            // 次の問題に進む
            this.current_count += 1
            // 最後の問題なら
            if (this.current_count == this.questions.length){
                this.scene = "result"
            }
            this.updateQuestion()
        },
        retry:function(){
            // リトライ
            this.current_count = 0
            this.scene = "game"
            this.startGame()
        },
        shuffle: function(array){
            // 問題をシャッフル
            for (let i = array.length - 1; i > 0; i--) {
                let r = Math.floor(Math.random() * (i + 1))
                let tmp = array[i]
                array[i] = array[r]
                array[r] = tmp
            }
            return array
        },
        playSound:function(sound){
            //音声再生
            sound.currentTime = 0 //連続して音を鳴らせるようにする
            sound.play() //再生
        },
        onKeyDown:function(event){
            //ゲーム画面
            if(this.scene=='game'){
                //入力するキーが合っているか判別
                if(event.key==this.current_answer[this.word_index_counts]){
                    // 画面の色を不正解色から直す
                    this.miss_flg = false

                    this.playSound(this.audio.type)//タイプ音
                    this.input_string += event.key
                    this.word_index_counts++

                    //もし単語を入力し終わったら
                    if(this.word_index_counts==this.current_answer.length){
                        this.nextQuestion()//次の問題へ
                    }
                }else{
                    this.playSound(this.audio.miss)//ミス音
                    this.miss_flg = true
                }
            }

            //リザルト画面のとき，Enterでリトライ
            if(this.scene=="result" & event.key=="Enter") {
                this.retry()
            }
        }
    },
    mounted:function(){
        //キーが押されたときのイベントを使えるようにする
        document.addEventListener('keydown', this.onKeyDown);
        
    },
    computed:{
        gaugeStyleObj:function(){
            //ゲージの長さを制御
            width = (this.current_count / this.questions.length)*100 + "%"
            if (this.current_count == this.questions.length){
                col = "orange"
            }else{
                col = "#007BFF"
            }
            return {
                'width': width,
                'background-color': col
            }
        },
        cardStyleObj:function(){
            if (this.miss_flg) col = "#ffdab9"
            else col = "#ffffff"
            return {
                'background-color': col
            }
        }
    },
})