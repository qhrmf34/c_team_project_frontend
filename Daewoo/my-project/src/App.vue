<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <div>
    <div v-for="item in list" :key="item.id">
        {{ item.title }}
    </div>
    <div id="app">
      <HotelOne />
    </div>
  </div>
</template>

<script>
import HotelOne from './components/hotel/hotel1.vue'
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios';

export default {
  name: 'App',
  components: {
    HelloWorld,
    HotelOne     // ✅ 여기에 등록해야 화면에 보임
  },
  data(){
    return{
      list:[]
    }
  },  
  async mounted(){
     const result = await axios.get('https://jsonplaceholder.typicode.com/posts')
     console.log(result.data);
     this.list = result.data;
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
