<template>
<div>
    <div class="card-header title">{{title}}</div>
    <div class="card-body option">
        <input v-model="hintMode" type="checkbox">答えを常に表示<br>
        <input v-if="csvMode" id="input_file" type="file" @change="loadCsvFile" accept=".csv" v-cloak>
        <router-link to="/typing/game" class="btn btn-primary btn-lg">ゲームスタート(Enter)</router-link>
    </div>

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
.title{
    font-size: 30px;
}
</style>