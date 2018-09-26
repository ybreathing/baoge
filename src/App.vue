 <!-- App.vue是我们的跟组件，所有页面都是在App.vue下面进行切换的，可以理解为所有的组件都是App.vue的子组件，我们可以吧头部课底部及每个页面都出现的内容放在App.vue里面。 -->
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h2>{{msg}}</h2>
    <AuthorInfo></AuthorInfo>
    <!-- <router-view/> -->
    <router-link to="/view1">Go to view1</router-link>
    <router-link to="/view2">Go to view2</router-link>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>
<script>
import AuthorInfo from './components/AuthorInfo.vue'
export default {
  name: 'App',
  data () {
    return {
      msg: 'Hello World!'
    }
  },
  components: {
    AuthorInfo
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
