import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store/index.js"
import Auth from "@aws-amplify/auth"

Vue.use(VueRouter)

const routes = [
  {
    path:'/', name:"home",
    component: () => import('../views/Home.vue'),
    children:[
      {
        path:'m',
        component: () => import('../components/modal.vue'),
        props:true,
        children:[
          {
            path:'start/:id',
            component: () => import('../components/typing-start.vue'),
            props: true,
          },
          {
            path: 'typing/:id',
            component: () => import('../components/typing-game.vue'),
            props: true,
          },
        ]
      }
    ]
  },
  {
    path: '/mypage', name:"mypage",
    meta: { requireAuth: true },
    component: () => import('../views/Mypage.vue'),
    children:[
      {
        path:'m',name:"modal",
        component: () => import('../components/modal.vue'),
        props: true,
        children:[
          {
            path:'start/:id',name:"start",
            component: () => import('../components/typing-start.vue'),
            props: true,
          },
          {
            path: 'typing/:id', name:"typing",
            component: () => import('../components/typing-game.vue'),
            props: true,
          },
          {
            path: 'edit/:id', name:"edit",
            component: () => import('../components/typing-edit.vue'),
          }
        ]
      },

    ]
  },
  { 
    path: '/login', name:"login", component: () => import('../views/Login.vue'), 
  },
  {
    path: '/signup', component: () => import('../views/Signup.vue'),
  },
  {
    path: '/confirm', name:"confirm", component: () => import('../views/Confirm.vue'),
  },
  {
    path: '/policy',
    name: 'policy',
    component: () => import('../views/policy.vue')
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('../views/terms.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// ・現在ユーザーが認証済みであればそのユーザー情報をuserステートに保存
// ・未認証であればuserステートを空にする
function getAuthenticatedUser() {
  return Auth.currentAuthenticatedUser()
    .then((data) => {
      if (data && data.signInUserSession) {
        store.commit("setUser", data);
        return data;
      }
    })
    .catch((e) => {
      console.error(e);
      store.commit("setUser", null);
      return null;
    });
}

// 画面遷移するたびに実行される処理
// 画面遷移のたび getAuthenticatedUser() を呼び出して、
// userステートの状態を更新

let user;

router.beforeResolve(async (to, from, next) => {
  user = await getAuthenticatedUser();
  
  //ログイン状態でログイン画面だったら
  if(to.name === "login" && user) {
    return next({name: "home"});//homeへ移動
  }

  //ログイン状態が必須のページだったら
  if (to.matched.some((record) => record.meta.requireAuth) && !user) {
    return next({name: "login"});//login画面へ移動
  }
  return next();
});

// onAuthUIStateChange((authState, authData) => {
//   //サインインしたら
//   if (authState === AuthState.SignedIn && authData) {
//     router.push({name: "home"});//homeへ移動
//   }
//   //サインアウトされたら
//   if(authState === AuthState.SignedOut) {
//     router.push({ name: "login"});//login画面へ移動
//   }
// });

export default router
