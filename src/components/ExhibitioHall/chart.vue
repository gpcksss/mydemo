<template>
  <div>
    <div id="chart" style="height:800px"></div>
    <div type="primary" @click="read('前方学校路段，限速30km/h。')">播放</div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  mounted() {
    var data = require('../../../static/newMap')
    var myChart = echarts.init(document.getElementById('chart'))
    var option = {
      xAxis: {
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      series: [
        {
          width: '100%',
          height: '100%',
          symbolSize: 5,
          data: [
            [-4.2785, 0.4653],
            [-4.4455, 8.9366],
            [24.4402, 7.5852],
            [24.4459, -1.0413]
          ],
          type: 'scatter'
        }
      ]
    }
    myChart.setOption(option)
  },
  methods: {
    read: function(word) {
      const synth = window.speechSynthesis
      const msg = new SpeechSynthesisUtterance()
      msg.text = word
      msg.lang = 'zh-CN'
      function handleSpeak(e) {
        synth.speak(msg)
      }
      function throttle(fn, delay) {
        let last = 0
        return function() {
          const now = new Date()
          if (now - last > delay) {
            fn.apply(this, arguments)
            last = now
          }
        }
      }
      console.log(msg)
      throttle(handleSpeak(), 1000)
    }
  }
}
</script>