<template>
  <div class="home">
    <div class="controller">
      <div class="title">
        Vissim车辆仿真平台
        <span v-if="!onOrOff" class="on" @click="btn1(1)"></span>
        <!-- <span v-if="onOrOff" class="off" @click="btn1(0)"></span> -->
        <span v-if="onOrOff&&!playOrPause" class="play" @click="btn1(2)"></span>
        <span v-if="playOrPause" class="pause" @click="playOrPause = 0"></span>
      </div>
      <div class="dashboard">
        <div id="chart" style="width:100%;height:100%"></div>
        <!-- <div class="pointer"></div> -->
      </div>
      <div class="speed">
        <el-input type="number" placeholder="输入速度" v-model="inputSpeed">
          <template slot="append">
            <span class="confirm" @click="confirm">确定</span>
          </template>
          <template slot="suffix">km/h</template>
        </el-input>
      </div>
      <div class="btn-list">
        <div class="btn" @click="changeSpeed(-5)">
          <img src="../assets/slow.png" alt class="icon" />
          <div class="btn-title">减速5km/h</div>
        </div>
        <div class="btn" @click="stopCar">
          <img src="../assets/stop.png" alt class="icon" />
          <!-- <img v-if="!playOrPause" src="../assets/start.png" alt class="icon" /> -->
          <div class="btn-title">停车</div>
          <!-- <div v-if="!playOrPause" class="btn-title">启动</div> -->
        </div>
        <div class="btn" @click="changeSpeed(5)">
          <img src="../assets/fast.png" alt class="icon" />
          <div class="btn-title">加速5km/h</div>
        </div>
        <div class="btn" @click="changeDirection(1)">
          <img src="../assets/left.png" alt class="icon" />
          <div class="btn-title">左转</div>
        </div>
        <div class="btn" @click="changeDirection(2)">
          <img src="../assets/ahead.png" alt class="icon" />
          <div class="btn-title">直行</div>
        </div>
        <div class="btn" @click="changeDirection(3)">
          <img src="../assets/right.png" alt class="icon" />
          <div class="btn-title">右转</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {
      playOrPause: 0,
      onOrOff: 0,
      model: 1,
      baseUrl: 'http://172.16.22.234:8080',
      speed: 0,
      inputSpeed: '',
      interval: null
    }
  },
  watch: {
    playOrPause(v) {
      if (v == 1) {
      }
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.$http.get(this.baseUrl + '/readspeed').then(res => {
        this.speed = res.data.data.outSpeed

        var myChart = echarts.init(document.getElementById('chart'))
        myChart.setOption({
          series: [
            {
              name: 'Pressure',
              type: 'gauge',
              center: ['50%', '238px'],
              radius: '250px',
              startAngle: 195,
              endAngle: -15,
              min: 0,
              max: 140,
              axisLine: {
                show: false
              },
              splitLine: {
                show: false,
                length: 20,
                lineStyle: {
                  color: '#1bc7ef',
                  width: 4,
                  opacity: 1
                }
              },
              axisTick: {
                show: false,
                splitNumber: 10,
                length: 10,
                distance: 20,
                lineStyle: {
                  color: '#ffffff',
                  width: 4
                }
              },
              axisLabel: {
                show: false,
                color: '#1bc7ef',
                fontSize: 20,
                distance: 10
              },
              pointer: {
                offsetCenter: [0, 0],
                length: 220,
                icon: 'rect',
                width: 6,
                itemStyle: {
                  color: '#e85856',
                  shadowColor: '#e85856',
                  shadowBlur: 10
                }
                // icon: 'image://' + require('../assets/pointer.png')
              },
              detail: {
                fontSize: 30,
                offsetCenter: [0, 40],
                formatter: function(value) {
                  return '{value|' + value + '}{unit|km/h}'
                },
                rich: {
                  value: {
                    fontSize: 50,
                    fontWeight: 'bolder',
                    color: '#1bc7ef',
                    fontFamily: 'UnidreamLED'
                  },
                  unit: {
                    fontSize: 20,
                    color: '#1bc7ef',
                    padding: [0, 0, -20, 0]
                  }
                }
              },
              data: [
                {
                  value: this.speed
                }
              ]
            }
          ]
        })
      })
    }, 500)
  },
  methods: {
    confirm() {
      if (
        !this.inputSpeed &&
        (this.inputSpeed !== 0 || this.inputSpeed !== '0')
      ) {
      } else {
        this.$http
          .post(this.baseUrl + '/speed/' + this.inputSpeed)
          .then(res => {
            debugger
          })
      }
    },
    btn1(type) {
      if (type == 1) {
        this.$http.get(this.baseUrl + '/open').then(res => {
          debugger
          this.onOrOff = type
        })
      } else if (!type) {
      } else if (type == 2) {
        this.$http.get(this.baseUrl + '/start').then(res => {
          debugger
          this.playOrPause = 1
        })
      }
    },
    changeSpeed(type) {
      this.$http.post(this.baseUrl + '/speedchange/' + type).then(res => {
        debugger
      })
    },
    changeDirection(type) {
      this.$http.post(this.baseUrl + '/direction/' + type).then(res => {})
    },
    stopCar() {
      this.$http.post(this.baseUrl + '/parking/0').then(res => {
        debugger
      })
    }
  }
}
</script>
<style >
@font-face {
  font-family: 'UnidreamLED';
  src: url('../assets/font/DS-DIGI-1.ttf') format('TTF'), local('UnidreamLED'),
    url('../assets/font/DS-DIGI-1.ttf');
  /***默认使用本地的***/
}
.home {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('../assets/bg.png');
}
.home .controller {
  width: 52%;
  height: 100%;
  margin: 0 auto;
  background: #272d37;
  opacity: 0.58;
}
.home .controller .title {
  font-size: 39px;
  font-family: Source Han Sans CN;
  font-weight: 800;
  color: #949eac;
  line-height: 100px;
  padding: 0 21px 0 41px;
  background: rgba(16, 23, 32, 0.29);
  box-shadow: 0px 1px 0px 0px #374352;
}
.home .controller .title span {
  display: inline-block;
  cursor: pointer;
  width: 64px;
  height: 64px;
  float: right;
  margin-top: 18px;
}
.home .controller .title .play {
  background: url('../assets/play.png');
}
.home .controller .title .pause {
  background: url('../assets/pause.png');
}
.home .controller .title .on {
  background: url('../assets/on.png');
}
.home .controller .title .off {
  background: url('../assets/off.png');
}
.home .controller .dashboard {
  margin: 0 100px 0 100px;
  border-bottom: 1px solid #1bc7ef;
  background: url('../assets/dashboard.png') no-repeat;
  height: 320px;
  background-position: center;
}
.home .controller .dashboard .pointer {
  background: url('../assets/pointer.png') no-repeat;
  background-position: calc(50% - 96px);
  width: calc(52% - 200px);
  height: 156px;
  position: absolute;
  top: 220px;
  transform: rotate(90deg);
  transform-origin: calc(50% - 96px) 100%;
}
.home .controller .speed {
  width: 364px;
  margin: 20px auto;
}
.el-input__inner {
  background: rgba(5, 35, 60, 0.2);
  border: 2px solid #5e6c82;
  border-right: none;
  color: #fff;
}
.el-input-group__append {
  background: rgba(94, 108, 130, 0.45);
  border: 2px solid #5e6c82;
  padding: 0;
}
.confirm {
  display: inline-block;
  width: 72px;
  height: 36px;
  line-height: 36px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.el-input__suffix-inner {
  line-height: 40px;
}
.btn-list {
  margin: 0 auto;
  width: 364px;
}
.btn {
  display: inline-block;
  width: 100px;
  height: 100px;
  background: rgba(5, 35, 60, 0.2);
  border: 2px solid #5e6c82;
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #778bab;
  margin: 0 21px 32px 0;
  cursor: pointer;
}
.btn:hover {
  background: rgba(5, 35, 60, 0.8);
}
.btn:nth-child(3) {
  margin-right: 0;
}
.btn:nth-child(6) {
  margin-right: 0;
}
.btn .icon {
  display: inline-block;
  width: 30px;
  height: 30px;
  margin-top: 23px;
  margin-bottom: 10px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
/* .home .controller .dashboard{} */
</style>