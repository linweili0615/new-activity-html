import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login','/404'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  /*if (getToken()) {
    console.log('getToken')
    if (to.path === '/login') {
      console.log('/login')
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {

        store.dispatch('GetInfo').then(response => {
          console.log('/GetInfo')
          // 拉取用户信息
          const data = response.data
          if(data != ''){
            next()
          }else {
            store.dispatch('FedLogOut').then(() => {
              next({ path: '/' })
            })
          }

        }).catch((err) => {
          console.log('/FedLogOut')
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/' })
          })
        })
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      console.log('whiteList')
      next()
    } else {
      console.log('redirect')
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }*/
  next()
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
