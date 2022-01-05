<template>
<div>
    <div class="card">
        <div class="card-header">{{title}}</div>
        <div class="card-body option">
            <input v-model="hintMode" type="checkbox">答えを常に表示<br>
            <input v-if="csvMode" id="input_file" type="file" @change="loadCsvFile" accept=".csv" v-cloak>
        </div>
    </div>
    <button class="btn btn-primary btn-lg" @click="startGame">ゲームスタート(Enter)</button>
</div>
</template>
<script>
export default {
  name: 'Start',
  props: {
    title: String
  }
}
</script>
<style>
.card {
    margin:20px;
}
.card-header{
    font-size: 30px;
}
</style>