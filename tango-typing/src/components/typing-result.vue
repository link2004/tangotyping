<template>
<div>
    <div style="color:orange;">Clear!</div>
    <router-link to="/typing/game" class="btn btn-primary">リトライ(Enter)</router-link>
    <router-link to="/typing" class="btn btn-secondary">戻る(Esc)</router-link>
    <p><input v-model="hintMode" type="checkbox">答えを常に表示</p>
    <div class="card option">
        <div class="card-header">リトライ設定</div>
        <div class="card-body">
            <input v-model="RetryOption_miss" type="checkbox">ミス数が <input v-model="RetryOption_miss_num" type="number" style="width:40px" min="0"> 以上の問題<br>
            <input v-model="RetryOption_anki" type="checkbox">暗記していない問題<br>
        </div>
    </div>
    <div class="card">
        <div class="card-body" id="scoretable">
            <table class="table table-bordered table-sm">
                <thead>
                    <tr class="table-light">
                        <th scope="col">問題</th>
                        <th scope="col">解答</th>
                        <th scope="col">時間</th>
                        <th scope="col">ミス</th>
                        <th scope="col">暗記</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                </tbody>
            </table>
        </div>
        
    </div>
    
</div>
</template>

<script>
export default {
    props: ['questions']
}
</script>