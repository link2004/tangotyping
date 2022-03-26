<template>
  <div class="container text-center">
    <amplify-authenticator>
      <amplify-sign-up
        slot="sign-up"
        username-alias="email"
        :form-fields.prop="formFields"
      />
    </amplify-authenticator>
  </div>
</template>
<script>
export default {
  data(){
    return {
      formFields: [
        {
          type: "name",
          label: "ユーザー名",
          placeholder: "ユーザー名を入力"
        },
        {
          type: "email",
          label: "メールアドレス",
          placeholder: "メールアドレスを入力"
        },
        {
          type: "password",
          label:"パスワード",
          placeholder: "パスワードを入力",
          inputProps: {required: true, autocomplete: "new-password"}
        }
      ]
    }
  }
}
</script>