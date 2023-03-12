<template>
  <div class="container flex-col h-100">
    <div class="d-flex mb-3">
      <router-link
        class="btn btn-secondary px-4 mr-2"
        v-if="mode == 'update'"
        :to="{ name: 'start', params: { id: this.$route.params.id } }"
        >戻る</router-link
      >
      <button class="btn btn-info px-4" v-b-modal.excel-mdl>Excelで編集</button>
      <button
        class="btn btn-danger ml-auto px-4"
        v-b-modal.delete-mdl
        v-if="mode == 'update'"
      >
        削除
      </button>
    </div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">タイトル</span>
      </div>
      <input type="text" class="form-control" v-model="question_title" />
    </div>
    <div class="scroll">
      <table class="table table-bordered edit-table" id="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">問題(日本語)</th>
            <th scope="col">答え(英語)</th>
          </tr>
        </thead>
        <draggable
          v-model="questions"
          tag="tbody"
          :options="{ handle: '.handle', animation: 300 }"
          ghost-class="ghost"
        >
          <tr
            v-for="(question, key) in this.questions"
            :key="key"
            valign="middle"
          >
            <th scope="row">{{ key + 1 }}</th>
            <td>
              <input
                type="text"
                ref="input"
                v-model="questions[key][0]"
                :style="Find_blank(key, 0)"
              />
            </td>
            <td>
              <input
                type="text"
                ref="input"
                v-model="questions[key][1]"
                :style="Find_blank(key, 1)"
              />
            </td>
            <td
              class="bi bi-trash-fill btn-light"
              style="line-height: 2.5rem"
              @click="ClickedDelLine(key)"
            ></td>
            <td class="handle bi bi-list" style="line-height: 2.5rem"></td>
          </tr>
        </draggable>
      </table>
      <button class="btn btn-outline-secondary btn-block mb-3" @click="AddLine">
        行を追加
      </button>
    </div>

    <b-alert class="mb-3" variant="danger" :show="blankAlert">空白を含む行があります</b-alert>
    <div class="bottom-btn">
      <button
        class="btn btn-primary btn-block"
        @click="ClickedSaveBtn"
        v-if="mode == 'new'"
      >
        保存
      </button>
      <button
        class="btn btn-primary btn-block"
        @click="ClickedUpdateBtn"
        v-if="mode == 'update'"
      >
        更新
      </button>
    </div>

    <b-modal
      id="del-line"
      @ok="DelLine(delLineIndex)"
      hide-header
      ok-title="削除"
    >
      <p class="my-2">行を削除しますか？</p>
    </b-modal>

    <b-modal
      id="update-mdl"
      @ok="Update"
      ok-title="更新"
      :title="question_title + 'を更新'"
    >
      <p class="my-2">問題を更新しますか？</p>
    </b-modal>

    <b-modal
      id="save-mdl"
      @ok="Save"
      ok-title="保存"
      :title="question_title + 'を保存'"
    >
      <p class="my-2">問題を保存しますか？</p>
    </b-modal>

    <b-modal
      id="delete-mdl"
      @ok="Delete"
      ok-title="削除"
      ok-variant="danger"
      :title="question_title + 'を削除'"
    >
      <p class="my-2">本当に削除しますか？</p>
    </b-modal>

    <b-modal id="excel-mdl" title="Excelで編集" @hidden="isFileInput = false">
      <div class="mb-2">
        <p><span class="h4">①</span>ファイルを編集</p>
        <button class="btn btn-info" @click="ExportExcel">
          Excelファイルをダウンロード
        </button>
      </div>
      <div>
        <p><span class="h4">②</span>ファイルをアップロード</p>
        <input type="file" id="file" ref="file" @change="isFileInput = true" />
      </div>
      <template #modal-footer="{ cancel }">
        <button class="btn btn-secondary" @click="cancel()">cancel</button>
        <button
          class="btn btn-primary"
          v-if="isFileInput"
          v-b-modal.excel-mdl-2
        >
          適用
        </button>
      </template>
    </b-modal>

    <b-modal id="excel-mdl-2" @ok="ImportExcel" title="Excelファイルを適用">
      <p class="my-2">元のデータを上書きしますか？</p>
    </b-modal>
  </div>
</template>

<script>
import api from "../api.js";
import draggable from "vuedraggable";
import "bootstrap-icons/font/bootstrap-icons.css";
import XLSX from "xlsx";

export default {
  components: {
    draggable: draggable,
  },
  data() {
    return {
      question_title: "新規データ",
      questions: [],
      userID: null,
      draggingIndex: null,
      focusIndex: 0,
      message: "",
      mode: "",
      token: null,
      tableID: null,
      delLineIndex: null,
      blankAlert: false,
      isFileInput: false,
    };
  },
  methods: {
    getData: async function () {
      var data = await api.getQuestions(this.tableID);
      return data;
    },
    setData: function (data) {
      this.question_title = data.body.title;
      this.questions = data.body.info.questions;
      this.userID = data.body.userID;
    },
    ClickedSaveBtn: function () {
      this.deleteNull();
      if (this.check_blank()) {
        this.blankAlert = true;
        return;
      }
      this.$bvModal.show("save-mdl");
    },
    ClickedUpdateBtn: function () {
      this.deleteNull();
      if (this.check_blank()) {
        this.blankAlert = true;
        return;
      }
      this.$bvModal.show("update-mdl");
    },
    ClickedDelLine: function (i) {
      if (this.questions[i][0] == "" && this.questions[i][1] == "") {
        this.DelLine(i);
      } else {
        this.delLineIndex = i;
        this.$bvModal.show("del-line");
      }
    },
    deleteNull: function () {
      //未入力の行を削除
      var i;
      for (i = 0; i < this.questions.length; i++) {
        var v1 = this.questions[i][0];
        var v2 = this.questions[i][1];
        if (v1 == "" && v2 == "") {
          this.questions.splice(i, 1);
          i -= 1;
        }
      }
      //全ての行が消えてしまったら
      if (this.questions.length == 0) this.AddLine();
    },
    check_blank: function () {
      //未入力のマスを検出
      var i;
      for (i = 0; i < this.questions.length; i++) {
        var v1 = this.questions[i][0];
        var v2 = this.questions[i][1];
        if (v1 == "" || v2 == "") {
          return true;
        }
      }
      return false;
    },
    CloseModal(){
      const url = this.$route.fullPath.split("/m/")[0];
      this.$router.push(url).then(()=>{
        this.$router.go(0);
      })
    },
    Save: async function () {
      var response = await api.putQuestions(
        this.question_title,
        this.questions
      );
      if (response.statusCode == 200) {
        this.CloseModal();
      }else{
        alert(response.msg);
      }
    },
    Update: async function () {
      var response = await api.updateQuestions(
        this.question_title,
        this.questions,
        this.tableID
      );
      if (response.statusCode == 200) {
        this.CloseModal();
      }else{
        alert(response.msg);
      }
    },
    Delete: async function () {
      var response = await api.deleteQuestions(this.tableID);
      if (response.statusCode == 200) {
        this.CloseModal();
      }else{
        alert(response.msg);
      }
    },
    errormsg(text) {
      const errorview = document.getElementById("errorview");
      errorview.textContent = text;
    },
    moveFocus: function (move) {
      this.$nextTick(() => {
        if (
          this.focusIndex + move < this.questions.length * 2 &&
          this.focusIndex + move >= 0
        ) {
          this.focusIndex += move;
        }
      });
    },
    setFocus: function (index) {
      this.focusIndex = index;
    },
    AddLine: function () {
      this.questions.push(["", ""]);
    },
    DelLine: function (index) {
      this.questions.splice(index, 1);
    },
    onKeyDown: function (event) {
      switch (event.key) {
        case "ArrowRight":
          this.moveFocus(1);
          break;
        case "ArrowLeft":
          this.moveFocus(-1);
          break;
        case "Enter":
        case "ArrowDown":
          if (this.focusIndex >= (this.questions.length - 1) * 2)
            this.AddLine();
          this.moveFocus(2);
          break;
        case "ArrowUp":
          this.moveFocus(-2);
          break;
      }
    },
    Find_blank: function (key, i) {
      if (this.questions[key][i] == "") {
        return { "background-color": "rgb(230, 230, 230)" };
      } else {
        return { "background-color": "white" };
      }
    },
    ImportExcel: function () {
      this.$bvModal.hide("excel-mdl");
      let file = this.$refs.file.files[0];

      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        data = new Uint8Array(data);
        var workbook = XLSX.read(data, {
          type: "array",
        });

        /* DO SOMETHING WITH workbook HERE */
        var first_sheet_name = workbook.SheetNames[0];
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];
        //It will prints with header and contents ex) Name, Home...
        var json = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        _this.questions = [];
        for (var i = 1; i < json.length; i++) {
          json[i].length = 2;
          if (json[i][0] == undefined) json[i][0] = "";
          if (json[i][1] == undefined) json[i][1] = "";
          _this.questions[i - 1] = json[i];
        }
      };
      const _this = this;

      reader.readAsArrayBuffer(file);
    },
    ExportExcel: function () {
      const wb = XLSX.utils.book_new();
      var data = this.questions.concat();
      data.unshift(["【問題】", "【答え】"]);
      var ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws);
      XLSX.writeFile(wb, this.question_title + ".xlsx");
    },
  },
  mounted: async function () {
    this.tableID = this.$route.params.id;

    //tableIDの有無により新規作成か編集か判別
    const data = await this.getData();
    const tableIdIsExist = data.statusCode == 200;
    if (tableIdIsExist) {
      this.mode = "update";
      this.setData(data);
    } else {
      this.mode = "new";
      this.AddLine();
    }
  },
  watch: {
    focusIndex: function () {
      this.$refs.input[this.focusIndex].select();
    },
    questions: function () {
      if (this.check_blank() == false) this.blankAlert = false;
    },
  },
  computed: {
    email() {
      return this.$store.state.user.attributes.email;
    },
  },
  created() {
    window.addEventListener('keydown', this.onKeyDown);
  },
  destroyed() {
    window.removeEventListener('keydown', this.onKeyDown);
  }
};
</script>

<style>
.flex-col {
  display: flex;
  flex-direction: column;
}
.scroll {
  overflow-y: scroll;
  max-height: 24rem;
}
.table input:focus {
  border-color: skyblue !important;
  background-color: white !important;
  outline: 0 none;
}
.table input,
.table i {
  width: 100%;
  height: 100%;
  border: solid;
  border-color: white;
  background-color: transparent;
}
.edit-table td {
  padding: 0 !important;
  height: 0rem;
}
.table tr {
  line-height: 1rem;
}
.ghost {
  opacity: 60%;
}
</style>