new Vue({
    el: "#app",
    data:{
        question_num: 0,
    },
    methods: {
        AddLine: function() {
            var tr = document.createElement("tr");
            document.getElementById("tbody").appendChild(tr);
            this.question_num += 1;
            tr.innerHTML = 
                    `<th scope="row">`+String(this.question_num)+`</th>
                    <td id="td"><input type="text" style="border: none; width: 100%;"></td>
                    <td id="td"><input type="text" style="border: none; width: 100%;"></td>`;
        },
        DownloadData() {
            //テーブルをcsv変換
            var table = document.getElementById("table");
            var table_csv="";
            for (var i=0;i<this.question_num;i++){
                var low_csv = "";//行
                for (var j=0;j<2;j++){
                    var value = table.rows[i+1].cells[j+1].firstElementChild.value;
                    if (value == "")break;//もし値がないならその行は無視

                    low_csv += value;
                    if (j==1){
                        low_csv += "\n";
                    }else{
                        low_csv += ","
                    }
                }
                if (j<2)continue;
                table_csv += low_csv;
            }
            console.log(table_csv);


            //csvファイルとしてダウンロード
            var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);//文字コードをBOM付きUTF-8に指定
            var blob = new Blob([ bom, table_csv], { "type" : "text/csv" });//table_csvのデータをcsvとしてダウンロードする関数
            if (window.navigator.msSaveBlob) { //IEの場合の処理
                // window.navigator.msSaveBlob(blob, "test.csv"); 
                window.navigator.msSaveOrOpenBlob(blob, "test.csv");// msSaveOrOpenBlobの場合はファイルを保存せずに開ける
            } else {
                document.getElementById("download").href = window.URL.createObjectURL(blob);
            }
    
            delete table_csv;//table_csvオブジェクトはもういらないので消去してメモリを開放
        },
        onKeyDown: function(event){
            if (event.key == "Enter" || event.key == "ArrowDown"){
                //今フォーカスが当たっている行を取得
                target = document.activeElement;
                HTMLTableCellElement; cell = target.closest("td");
                HTMLTableRowElement; row =  target.closest("tr");
                //次の行を取得
                var row_next = row.nextSibling;

                if (row_next != null){
                    //次の下ににカーソル移動
                    row_next.children[cell.cellIndex].children[0].focus();
                }else if(event.key == "Enter"){
                    this.AddLine();
                    row_next = row.nextSibling;
                    row_next.children[cell.cellIndex].children[0].focus();
                }
            }
            if (event.key == "ArrowUp"){
                target = document.activeElement;
                var cell = target.closest("td");
                var row =  target.closest("tr");
                var tbody = target.closest("tbody");

                // 上の行を取得
                var upper_row = tbody.children[row.rowIndex-2];
                if (upper_row != null){
                    upper_row.children[cell.cellIndex].children[0].focus();
                }
            }
            if (event.key == "ArrowRight" || event.key == "ArrowLeft"){
                target = document.activeElement;
                var cell = target.closest("td");
                var row =  target.closest("tr");

                //右か左か決める
                var direction = 1;
                if (event.key == "ArrowLeft")direction = -1;

                //隣のcellを取得
                var next_cell = row.children[cell.cellIndex+direction];

                if (next_cell != null){
                    if (next_cell.children[0] != null){
                        next_cell.children[0].focus();
                    }
                }
                    
            }
        }
    },
    mounted: function(){
        //キーが押されたときのイベントを使えるようにする
        document.addEventListener("keydown", this.onKeyDown);
        this.AddLine();//一行目追加
    }
})