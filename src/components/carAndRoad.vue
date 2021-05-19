<template>
  <div class="home">
    123
    <div id="chart" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  data() {},
  mounted() {
    // this.initMap()
  },
  methods: {
    initMap() {
      var file = require('../assets/json/newMap.json')
      debugger
      var myChart = echarts.init(document.getElementById('chart'))
      var option = {
        xAxis: {},
        yAxis: {},
        series: [
          {
            symbolSize: 1,
            data: file,
            type: 'scatter'
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>
<style>
.home {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>