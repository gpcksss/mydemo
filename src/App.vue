<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      date: ''
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
/* .hello {
  padding: 20px;
}
.search-place {
  margin-top: 20px;
}
.el-input {
  width: 30%;
}
.el-select {
  width: 30%;
}
.el-table {
  margin-top: 20px;
}
.hello .el-input__inner {
  border: 1px solid #000 !important;
} */
</style>
