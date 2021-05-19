<template>
  <div class="home">
    <div class="title">
      <div class="environment">
        <div id="btn" @click="read(word)"></div>
        <div class="tem">
          <div class="pic type"></div>
          <div class="right">
            <div class="value" style="font-size:12px">多云转晴</div>
            <div class="name">天气</div>
          </div>
        </div>
        <div class="tem">
          <div class="pic temp"></div>
          <div class="right">
            <div class="value" style="font-size:15px">27°C</div>
            <div class="name">温度</div>
          </div>
        </div>
        <div class="tem">
          <div class="pic humidity"></div>
          <div class="right">
            <div class="value" style="font-size:15px">67%</div>
            <div class="name">湿度</div>
          </div>
        </div>
        <div class="tem">
          <div class="pic pm"></div>
          <div class="right">
            <div class="value" style="font-size:15px">轻微</div>
            <div class="name">PM2.5</div>
          </div>
        </div>
      </div>
      <div class="tablist">
        <div class="tabitem" style="margin-right: 30px;">场景管理</div>
        <div class="tabitem" style="margin-right: 61.5px;">设备管理</div>
        <div class="title">车路协同云控平台</div>
        <div class="tabitem" style="margin-left: 61.5px;">车辆管理</div>
        <div class="tabitem" style="margin-left: 30px;">统计分析</div>
      </div>
      <div class="user">
        <div class="head"></div>
        <div class="name">管理员</div>
        <div class="select"></div>
      </div>
    </div>
    <!-- <div id="full" style="height:30px;background:#fff" @click="fullScreen"></div> -->
    <div class="change-tab">
      <div class="left-tab">
        <img src="../../assets/carAndRoad/left.png" alt />
      </div>
      <div class="tab active">302展厅</div>
      <div class="tab">716园区</div>
      <div class="tab">花果山大道</div>
      <div class="tab">国防科技馆</div>
      <div class="left-tab">
        <img src="../../assets/carAndRoad/right.png" alt />
      </div>
    </div>
    <div class="warning" v-if="tipsFlag">
      <div
        class="biaozhi"
        :style="'background: url(' + require('../../assets/carAndRoad/t' + tipsFlag + '.png')+ ');'"
      ></div>
      <div class="word">{{word}}</div>
    </div>
    <div class="card card1">
      <div class="content">
        <div class="video">
          <img
            v-if="showVideoFlag"
            style="-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 25%);"
            src="http://192.168.20.220:8080/?action=stream"
          />
          <div class="tips">
            <div class="left">
              <div class="go">
                <div class="green" :class="{'active':lightStatus=='1'}">
                  <span v-if="lightStatus=='1'">{{calc}}</span>
                </div>
                <!-- <div class="left-point"></div> -->
              </div>
              <div class="go">
                <div class="yellow" :class="{'active':lightStatus=='2'}">
                  <span v-if="lightStatus=='2'">{{calc}}</span>
                </div>
                <!-- <div class="straight-point"></div> -->
              </div>
              <div class="go">
                <div class="red" :class="{'active':lightStatus=='3'}">
                  <span v-if="lightStatus=='3'">{{calc}}</span>
                </div>
                <!-- <div class="right-point"></div> -->
              </div>
            </div>
            <div class="right">
              <div class="ds">
                <div class="value">50</div>
                <div class="unit">km/h</div>
              </div>
              <div class="recomend">推荐时速</div>
            </div>
          </div>
        </div>
        <div class="incar"></div>
      </div>
    </div>
    <div class="card card2">
      <img
        v-if="showVideoFlag"
        style="-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 25%);"
        src="http://192.168.20.220:8080/?action=stream"
      />
    </div>
    <div class="card card3">
      <live-player
        video-url="http://192.168.20.225:10800/flv/hls/stream_1.flv"
        :live="true"
        :stretch="true"
        style="width:100%;height:100%;object-fit: fill;"
      />
    </div>
    <div class="card card4">
      <div class="dashboard">
        <div id="chart1" class="chart"></div>
        <div class="bottom">车辆速度(hm/h)</div>
      </div>
      <div class="dashboard">
        <div id="chart2" class="chart"></div>
        <div class="bottom">行车里程(km)</div>
      </div>
      <div class="dashboard">
        <div id="chart3" class="chart">{{ms}}ms</div>
        <div class="bottom">5G传输平均时延(ms)</div>
      </div>
      <div class="dashboard" style="margin-right:0">
        <div id="chart4" class="chart">{{bd}}cm</div>
        <div class="bottom">北斗高精度定位平均偏差(cm)</div>
      </div>
    </div>
    <div class="show-container">
      <div class="runway"></div>
      <div class="light"></div>
      <div class="machine"></div>
      <div class="point-cloud">
        <div class="car" :style="'top:'+bottom+';left:'+right+';transform: rotate('+ dig +'deg);'"></div>
        <div class="block" v-show="blFlag" :style="'top:'+blBottom+';left:'+blRight+';'"></div>
        <div
          class="dialog bl"
          v-show="blFlag"
          :style="'top:'+diBottom+';left:'+diRight+';'"
        >前方路面有障碍物，请绕道慢行。</div>
      </div>
      <div class="green-wave"></div>
      <div class="dialog gr">进入绿波道路，推荐车速50km/h。</div>
      <div class="rsu"></div>
    </div>
    <!-- <div id="chart" style="width:100%;height:100%"></div> -->
  </div>
</template>
<script>
import * as echarts from 'echarts'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import screenfull from 'screenfull'
export default {
  data() {
    return {
      baseUrl: 'http://192.168.20.225:8091',
      socketSig: null,
      stompClientSig: null,
      carSocketSig: null,
      carStompClientSig: null,
      lightStatus: '0',
      bottom: 0,
      right: 0,
      dig: 0,
      speed: 0,
      calc: 0,
      tipsFlag: false,
      ms: 5,
      bd: 5,
      blBottom: 0,
      blRight: 0,
      diRight: 0,
      diBottom: 0,
      blFlag: false,
      word: '',
      oldX: 0,
      oldY: 0,
      newX: 0,
      newY: 0,
      timeFlag: 0,
      interval: null,
      showVideoFlag: false,
      carConnectNumber: 0
    }
  },
  mounted() {
    const synth = window.speechSynthesis
    const msg = new SpeechSynthesisUtterance()
    msg.text = 'hello world'
    msg.lang = 'zh-CN'
    function handleSpeak(e) {
      synth.speak(msg)
    }
    function throttle(fn, delay) {
      let last = 0
      return function() {
        fn.apply(this, arguments)
      }
    }
    setTimeout(() => {
      throttle(handleSpeak, 1000)
    }, 1000)
    this.interval = setInterval(() => {
      this.timeFlag += 1
      this.carConnectNumber += 1
      console.log(this.timeFlag)
    }, 1000)
    // this.initMap()
    this.initSocket()
    this.initCar()
    this.carSocket()
    this.initNumber()
    this.initEvent()
    // this.initVideo()
    // document.getElementById('full').click()
  },
  watch: {
    carConnectNumber(v) {
      if (v > 5 && this.showVideoFlag) {
        this.showVideoFlag = false
        // setTimeout(() => {
        //   this.showVideoFlag = true
        // }, 10)
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    // reloadImg() {
    //   debugger
    //   this.showVideoFlag = false
    //   setTimeout(() => {
    //     this.showVideoFlag = true
    //   }, 5000)
    // },
    read: function(word) {
      const synth = window.speechSynthesis
      const msg = new SpeechSynthesisUtterance()
      msg.text = word
      msg.lang = 'zh-CN'
      msg.pitch = 1
      function handleSpeak(e) {
        synth.speak(msg)
      }
      function throttle(fn, delay) {
        let last = 0
        return function() {
          const now = new Date()
          // if (now - last > delay) {
          fn.apply(this, arguments)
          // last = now
          // }
        }
      }
      console.log(msg)
      throttle(handleSpeak(), 1000)
    },
    fullScreen() {
      if (!screenfull.isEnabled) {
        // this.$message({
        //   message: 'you browser can not work',
        //   type: 'warning'
        // })
        return false
      }
      screenfull.toggle()
    },
    initVideo() {
      this.$http
        .get('http://192.168.20.220:8080/?action=stream', {})
        .then(res => {
          debugger
        })
        .catch(e => {
          debugger
        })
    },
    initEvent() {
      this.eventSocketSig = new SockJS(`${this.baseUrl}/webSocketServer`)
      this.eventStompClientSig = Stomp.over(this.eventSocketSig)
      console.log('启动前时间：' + new Date().toLocaleTimeString())
      this.eventStompClientSig.connect(
        {},
        frame => {
          console.log('建立连接成功aaa')
          const subscribeUrl = `/user/ccc/info`
          this.eventStompClientSig.subscribe(subscribeUrl, res => {
            const re = JSON.parse(res.body)
            if (this.timeFlag < 2) {
              if (re) {
                this.tipsFlag = re
                switch (re) {
                  case '1':
                    this.word = '前方路面积水，请减速慢行。'
                    break
                  case '2':
                    this.word = '前方路面施工，请减速慢行。'
                    break
                  case '3':
                    this.word = '前方学校路段，限速30km/h。'
                    break
                  case '4':
                    this.word = '前方行人过街，请停车避让。'
                    break
                  case '5':
                    this.word = '前方有障碍物，请绕道慢行。'
                    break
                  case '6':
                    this.word = '前方道路拥堵，请减速慢行。'
                    break
                  default:
                    break
                }
                // this.read(this.word)
                document.getElementById('btn').click()
                setTimeout(() => {
                  this.tipsFlag = false
                }, 4000)
              }
            }
            // console.log(re)

            // var light = re.keyList[2]
          })
        },
        err => {
          // 连接发生错误时的处理函数
          console.log('222222222222222')
          setTimeout(() => {
            location.reload()
          }, 10000)
        }
      )
    },
    initNumber() {
      setInterval(() => {
        this.ms = Math.floor(Math.random() * 25 + 5)
      }, 200)
      setInterval(() => {
        this.bd = Math.floor(Math.random() * 45 + 5)
      }, 1000)
    },
    initSocket() {
      this.socketSig = new SockJS(`${this.baseUrl}/webSocketServer`)
      this.stompClientSig = Stomp.over(this.socketSig)
      console.log('启动前时间：' + new Date().toLocaleTimeString())
      this.stompClientSig.connect(
        {},
        frame => {
          console.log('建立连接成功aaa')
          const subscribeUrl = `/user/aaa/queue/lightstatus`
          this.stompClientSig.subscribe(subscribeUrl, res => {
            const re = JSON.parse(res.body)
            console.log(re)
            // var light = re.keyList[2]
            re.keyList.forEach(element => {
              if (element.index == 2) {
                this.lightStatus = element['137.1.3']
                this.calc = element['137.1.4']
              }
            })
          })
        },
        err => {
          // 连接发生错误时的处理函数
          console.log('222222222222222')
          setTimeout(() => {
            location.reload()
          }, 10000)
        }
      )
    },
    initCar() {
      var myChart = echarts.init(document.getElementById('chart1'))
      var myChart2 = echarts.init(document.getElementById('chart2'))
      var option = {
        series: [
          {
            type: 'gauge',
            startAngle: 176,
            endAngle: 4,
            min: 0,
            max: 70,
            splitNumber: 7,
            radius: '180%',
            center: ['50%', '95%'],
            itemStyle: {
              color: '#fff',
              shadowColor: 'rgba(0,138,255,0.45)',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
              width: 5
            },
            progress: {
              show: false,
              roundCap: true,
              width: 8,
              itemStyle: {
                color: '#07DBFF'
              }
            },
            pointer: {
              icon:
                'path://M151.1,26.3c0,0-14.7,188.6-14.7,196.7c0,8.1,6.6,14.7,14.7,14.7c8.1,0,14.7-6.6,14.7-14.7				C165.8,214.9,151.1,26.3,151.1,26.3z M151.1,231.9c-4.8,0-8.6-3.9-8.6-8.6c0-3.6,2.2-6.7,5.4-8l3.2-161.6l3.8,161.9				c2.9,1.4,4.9,4.3,4.9,7.8C159.7,228.1,155.9,231.9,151.1,231.9z',
              length: '75%',
              width: 16,
              offsetCenter: [0, '5%']
            },
            axisLine: {
              show: false,
              roundCap: true,
              lineStyle: {
                width: 8,
                color: [[1, '#206ED4']]
              }
            },
            axisTick: {
              show: false,
              splitNumber: 4,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            detail: {
              show: false
            },
            splitLine: {
              show: false,
              length: 12,
              lineStyle: {
                width: 3,
                color: '#999'
              }
            },
            axisLabel: {
              show: false,
              distance: 10,
              color: '#999',
              fontSize: 16
            },
            title: {
              show: false
            },
            data: [
              {
                value: this.speed * 36
              }
            ]
          }
        ]
      }
      var option2 = {
        series: [
          {
            type: 'gauge',
            startAngle: 176,
            endAngle: 4,
            min: 0,
            max: 70,
            splitNumber: 7,
            radius: '180%',
            center: ['50%', '95%'],
            itemStyle: {
              color: '#fff',
              shadowColor: 'rgba(0,138,255,0.45)',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
              width: 5
            },
            progress: {
              show: false,
              roundCap: true,
              width: 8,
              itemStyle: {
                color: '#07DBFF'
              }
            },
            pointer: {
              icon:
                'path://M151.1,26.3c0,0-14.7,188.6-14.7,196.7c0,8.1,6.6,14.7,14.7,14.7c8.1,0,14.7-6.6,14.7-14.7				C165.8,214.9,151.1,26.3,151.1,26.3z M151.1,231.9c-4.8,0-8.6-3.9-8.6-8.6c0-3.6,2.2-6.7,5.4-8l3.2-161.6l3.8,161.9				c2.9,1.4,4.9,4.3,4.9,7.8C159.7,228.1,155.9,231.9,151.1,231.9z',
              length: '75%',
              width: 16,
              offsetCenter: [0, '5%']
            },
            axisLine: {
              show: false,
              roundCap: true,
              lineStyle: {
                width: 8,
                color: [[1, '#206ED4']]
              }
            },
            axisTick: {
              show: false,
              splitNumber: 4,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            detail: {
              show: false
            },
            splitLine: {
              show: false,
              length: 12,
              lineStyle: {
                width: 3,
                color: '#999'
              }
            },
            axisLabel: {
              show: false,
              distance: 10,
              color: '#999',
              fontSize: 16
            },
            title: {
              show: false
            },
            data: [
              {
                value: 50
              }
            ]
          }
        ]
      }
      myChart.setOption(option)
      myChart2.setOption(option2)
    },
    carSocket() {
      // this.socket = new WebSocket(
      //   'ws://192.168.20.100:8091/webSocketServer/user/bbb/info'
      // )
      var json = require('../../../static/map')
      var width = document.getElementsByClassName('point-cloud')[0].offsetWidth
      var height = document.getElementsByClassName('point-cloud')[0]
        .offsetHeight
      var width2 = document.getElementsByClassName('car')[0].offsetWidth
      var height2 = document.getElementsByClassName('car')[0].offsetHeight
      // var x = 24.4402
      // var y = 7.5852
      // var d = 0.0239
      // // setTimeout(() => {
      // //   this.speed = 1
      // //   this.initCar()
      // // }, 2000)
      // // setTimeout(() => {
      // //   this.speed = 0.8
      // //   this.initCar()
      // // }, 3000)
      // //0.0572x+y+0.1415=0
      // var u = y + 0.288
      // var p = Math.sqrt(1)
      // var dy = Math.abs(u / p)
      // //x-26.6=0
      // var u2 = x - 24.44
      // var p2 = Math.sqrt(1)
      // var dy2 = Math.abs(u2 / p2)
      // if (dy2 / 28.74 > 0.5) {
      //   if (dy2 / 28.74 > 0.98) {
      //     this.right = 0.98 * width - width2 / 2 + 'px'
      //   } else {
      //     this.right = (dy2 / 28.74) * width - width2 / 2 + 'px'
      //   }
      // } else {
      //   if (dy2 / 28.74 < 0.02) {
      //     this.right = 0.02 * width - width2 / 2 + 'px'
      //   } else {
      //     this.right = (dy2 / 28.74) * width - width2 / 2 + 'px'
      //   }
      // }
      // if (dy / 8.5 > 0.5) {
      //   if (dy / 8.5 > 0.93) {
      //     this.bottom = 0.93 * height - height2 / 2 + 'px'
      //   } else {
      //     this.bottom = (dy / 8.5) * height - height2 / 2 + 'px'
      //   }
      // } else {
      //   if (dy / 8.5 < 0.08) {
      //     this.bottom = 0.08 * height - height2 / 2 + 'px'
      //   } else {
      //     this.bottom = (dy / 8.5) * height - height2 / 2 + 'px'
      //   }
      // }
      // this.dig = 270 - ((d + 0.0239) / 3.14) * 180
      //     i++
      //   } else {
      //     clearInterval(int)
      //   }
      // }, 100)

      this.carSocketSig = new SockJS(`${this.baseUrl}/webSocketServer`)
      this.carStompClientSig = Stomp.over(this.carSocketSig)
      console.log('启动前时间：' + new Date().toLocaleTimeString())
      this.carStompClientSig.connect(
        {},
        frame => {
          console.log('建立连接成功bbb')
          const subscribeUrl = `/user/bbb/info`
          this.carStompClientSig.subscribe(subscribeUrl, res => {
            const re = JSON.parse(res.body)
            console.log(re)
            if (re.type === 69) {
              this.carConnectNumber = 0
              this.timeFlag = 0
              setTimeout(() => {
                this.showVideoFlag = true
              }, 10000)

              this.speed = re.speed
              this.initCar()
              var x = re.lon
              var y = re.lat
              var d = re.direction
              //y+0.7760=0
              var u = y + 0.288
              var p = Math.sqrt(1)
              var dy = Math.abs(u / p)
              //x-26.6=0
              var u2 = x - 24.44
              var p2 = Math.sqrt(1)
              var dy2 = Math.abs(u2 / p2)
              if (dy2 / 28.74 > 0.5) {
                if (dy2 / 28.74 > 0.98) {
                  this.right = 0.98 * width - width2 / 2 + 'px'
                } else {
                  this.right = (dy2 / 28.74) * width - width2 / 2 + 'px'
                }
              } else {
                if (dy2 / 28.74 < 0.02) {
                  this.right = 0.02 * width - width2 / 2 + 'px'
                } else {
                  this.right = (dy2 / 28.74) * width - width2 / 2 + 'px'
                }
              }
              if (dy / 8.5 > 0.5) {
                if (dy / 8.5 > 0.93) {
                  this.bottom = 0.93 * height - height2 / 2 + 'px'
                } else {
                  this.bottom = (dy / 8.5) * height - height2 / 2 + 15 + 'px'
                }
              } else {
                if (dy / 8.5 < 0.08) {
                  this.bottom = 0.08 * height - height2 / 2 + 'px'
                } else {
                  this.bottom = (dy / 8.5) * height - height2 / 2 - 10 + 'px'
                }
              }
              this.dig = 270 - ((d + 0.0239) / 3.14) * 180

              // if (this.oldX && this.oldY) {
              //   if (
              //     Math.abs(re.lon - this.oldX) < 0.03 &&
              //     Math.abs(re.lat - this.oldY) < 0.03
              //   ) {
              //     this.speed = 0
              //   } else if (
              //     Math.abs(re.lon - this.oldX) < 0.06 &&
              //     Math.abs(re.lat - this.oldY) < 0.06
              //   ) {
              //     this.speed = Math.random() * 0.3
              //   } else {
              //     this.speed = 0.5 + Math.random()
              //   }
              //   this.initCar()
              // } else {
              // }
              this.oldX = re.lon
              this.oldY = re.lat
            } else if (re.type === 68) {
              this.blFlag = true
              var width3 = document.getElementsByClassName('block')[0]
                .offsetWidth
              var height3 = document.getElementsByClassName('block')[0]
                .offsetHeight
              var width4 = document.getElementsByClassName('bl')[0].offsetWidth
              var height4 = document.getElementsByClassName('bl')[0]
                .offsetHeight
              var x = re.lon
              var y = re.lat
              var u = y + 0.288
              var p = Math.sqrt(1)
              var dy = Math.abs(u / p)
              //x-26.6=0
              var u2 = x - 24.44
              var p2 = Math.sqrt(1)
              var dy2 = Math.abs(u2 / p2)
              if (dy2 / 28.74 > 0.5) {
                if (dy2 / 28.74 > 0.98) {
                  this.blRight = 0.98 * width - width3 / 2 + 'px'
                  this.diRight = 0.98 * width - width3 / 2 - width4 / 2 + 'px'
                } else {
                  this.blRight = (dy2 / 28.74) * width - width3 / 2 + 'px'
                  this.diRight =
                    (dy2 / 28.74) * width - width3 / 2 - width4 / 2 + 'px'
                }
              } else {
                if (dy2 / 28.74 < 0.02) {
                  this.blRight = 0.02 * width - width3 / 2 + 'px'
                  this.diRight = 0.02 * width - width3 / 2 - width4 / 2 + 'px'
                } else {
                  this.blRight = (dy2 / 28.74) * width - width3 / 2 + 'px'
                  this.diRight = 0.02 * width - width3 / 2 - width4 / 2 + 'px'
                }
              }
              if (dy / 8.5 > 0.5) {
                if (dy / 8.5 > 0.93) {
                  this.blBottom = 0.93 * height - height3 / 2 + 'px'
                  this.diBottom =
                    0.93 * height - height3 / 2 - height4 - 10 + 'px'
                } else {
                  this.blBottom = (dy / 8.5) * height - height3 / 2 + 'px'
                  this.diBottom =
                    (dy / 8.5) * height - height3 / 2 - height4 - 10 + 'px'
                }
              } else {
                if (dy / 8.5 < 0.08) {
                  this.blBottom = 0.08 * height - height3 / 2 + 'px'
                  this.diBottom =
                    0.08 * height - height3 / 2 - height4 - 10 + 'px'
                } else {
                  this.blBottom = (dy / 8.5) * height - height3 / 2 + 'px'
                  this.diBottom =
                    (dy / 8.5) * height - height3 / 2 - height4 - 10 + 'px'
                }
              }
            }
          })
        },
        err => {
          // 连接发生错误时的处理函数
          console.log('222222222222222')
          setTimeout(() => {
            location.reload()
          }, 10000)
        }
      )
    }
    // // initMap() {
    // //   var file = require('../assets/json/newMap.json')
    // //   debugger
    // //   var myChart = echarts.init(document.getElementById('chart'))
    // //   var option = {
    // //     xAxis: {},
    // //     yAxis: {},
    // //     series: [
    // //       {
    // //         symbolSize: 1,
    // //         data: file,
    // //         type: 'scatter'
    // //       }
    // //     ]
    // //   }
    // //   myChart.setOption(option)
    // // }
  }
}
</script>
<style lang="scss">
@font-face {
  font-family: 'UnidreamLED';
  src: url('../../assets/font/DS-DIGI-1.ttf') format('TTF'),
    local('UnidreamLED'), url('../../assets/font/DS-DIGI-1.ttf');
  /***默认使用本地的***/
}
html {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
  width: 100%;
  height: 100%;
}
body {
  margin: 0;
  width: 100%;
  height: 100%;
}
* {
  background-size: cover !important;
  -webkit-background-size: cover !important;
  -o-background-size: cover !important;
}
.home {
  color: #b2e3ff;
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('../../assets/carAndRoad/bg.png');
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  .warning {
    width: 332px;
    height: 170px;
    background: url('../../assets/carAndRoad/detail.png');
    padding: 30px;
    position: absolute;
    right: 25px;
    top: 100px;
    .biaozhi {
      display: inline-block;
      width: 85px;
      height: 75px;
      // background: url('../../assets/carAndRoad/zhangaiwu.png');
      margin-top: 17.5px;
      margin-left: 10px;
    }
    .word {
      width: 136px;
      height: 50px;
      padding: 5px;
      background: linear-gradient(
        0deg,
        rgba(127, 228, 248, 0.18),
        rgba(1, 190, 245, 0.18)
      );
      margin-top: 30px;
      float: right;
      line-height: 19px;
      font-size: 14px;
      color: #09d2ee;
    }
  }
  .environment {
    float: left;
    padding: 29px 23px;
    .tem {
      // margin-right: 10px;
      display: inline-block;
      .right {
        width: 48.5px;
        display: inline-block;
        vertical-align: top;
        margin-left: 5px;
        .value {
          color: #fff;
        }
        .name {
          color: #ffffff;
          opacity: 0.35;
        }
      }
    }
    .tem:first-child {
      margin-right: 10px;
    }
    .pic {
      display: inline-block;
      width: 34px;
      height: 34px;
    }
    .type {
      background: url('../../assets/carAndRoad/weather.png');
    }
    .temp {
      background: url('../../assets/carAndRoad/tem.png');
    }
    .humidity {
      background: url('../../assets/carAndRoad/humidity.png');
    }
    .pm {
      background: url('../../assets/carAndRoad/pm.png');
    }
  }
  .tablist {
    text-align: center;
    width: 1038px;
    height: 70.5px;
    margin: 0 auto;
    background: url('../../assets/carAndRoad/tit_bg.png');
    div {
      display: inline-block;
    }
    .title {
      width: 275px;
      height: 31px;
      font-size: 32px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 70.5px;
      height: 100%;
      vertical-align: text-bottom;
      letter-spacing: 2px;
    }
    .tabitem {
      width: 133px;
      height: 44px;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #b2e3ff;
      line-height: 44px;
      background: url('../../assets/carAndRoad/tab-bg.png');
      cursor: pointer;
    }
    .tabitem:hover {
      background: url('../../assets/carAndRoad/tab-bg-hover.png');
      color: #fff;
    }
  }
  .user {
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px;
    .head {
      width: 28px;
      height: 28px;
      display: inline-block;
      background: url('../../assets/carAndRoad/user.png');
      cursor: pointer;
    }
    .name {
      display: inline-block;
      line-height: 28px;
      vertical-align: top;
      margin-left: 5px;
      font-size: 14px;
      cursor: pointer;
    }
    .select {
      display: inline-block;
      width: 11px;
      height: 6px;
      background: url('../../assets/carAndRoad/select.png');
      margin-bottom: 11px;
      cursor: pointer;
    }
  }
  .card {
    position: absolute;
    padding: 28px 17.5px;
    box-sizing: border-box;
  }
  .card1 {
    left: 23px;
    top: 126px;
    background: url('../../assets/carAndRoad/card1.png');
    width: 386px;
    height: 400px;
    .content {
      .video {
        width: 351px;
        height: 222.5px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .incar {
        width: 351px;
        height: 127.5px;
        background: url('../../assets/carAndRoad/incar.png');
      }
    }
    .tips {
      width: 332px;
      height: 170px;
      background: url('../../assets/carAndRoad/detail.png');
      padding: 30px;
      position: absolute;
      left: 25px;
      top: 50px;
      .left {
        display: inline-block;
        vertical-align: top;
        padding-top: 10px;
        .go {
          display: inline-block;
          font-family: 'UnidreamLED';
          font-size: 28px;
          text-align: center;
          line-height: 44px;
          color: rgba(255, 255, 255, 1);
          vertical-align: text-bottom;
          .red {
            width: 44px;
            height: 44px;
            background: #ef1818;
            opacity: 0.55;
            border-radius: 50%;
          }
          .left-point {
            width: 44px;
            height: 44px;
            background: url('../../assets/carAndRoad/r.png');
            margin-top: 10px;
          }
          .straight-point {
            width: 44px;
            height: 44px;
            background: url('../../assets/carAndRoad/s.png');
            margin-top: 10px;
          }
          .right-point {
            width: 44px;
            height: 44px;
            background: url('../../assets/carAndRoad/l.png');
            margin-top: 10px;
          }
          .green {
            width: 44px;
            height: 44px;
            background: #02cc53;
            opacity: 0.5;
            border-radius: 50%;
          }
          .yellow {
            width: 44px;
            height: 44px;
            background: #d1e80e;
            opacity: 0.55;
            border-radius: 50%;
          }
          .active {
            opacity: 1;
          }
        }
      }
      .right {
        display: inline-block;
        text-align: center;
        margin-left: 20px;
        .ds {
          background: url('../../assets/carAndRoad/ds.png');
          width: 97px;
          height: 78px;
          .value {
            font-size: 38px;
            font-family: UnidreamLED;
            font-weight: normal;
            color: #22c6e4;
            line-height: 68px;
            height: 50px;
          }
          .unit {
            height: 12px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;
          }
        }
        .recomend {
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #22c6e4;
        }
      }
    }
  }
  .card2 {
    top: 545.5px;
    left: 23px;
    background: url('../../assets/carAndRoad/card2.png');
    width: 386px;
    height: 247px;
    img {
      width: 350px;
      height: 198px;
    }
  }
  .card3 {
    top: 813.5px;
    left: 23px;
    background: url('../../assets/carAndRoad/card3.png');
    width: 386px;
    height: 247px;
  }
  .card4 {
    width: 1470px;
    height: 252px;
    left: 427.5px;
    top: 813.5px;
    padding-left: 42.5px;
    background: url('../../assets/carAndRoad/card4.png');
    .dashboard {
      width: 295px;
      height: 100%;
      display: inline-block;
      margin-right: 60px;
      .chart {
        width: 100%;
        height: 150px;
        color: #fff;
        text-align: center;
        line-height: 240px;
        font-size: 36px;
      }
      #chart1 {
        background: url('../../assets/carAndRoad/chart1.png');
      }
      #chart2 {
        background: url('../../assets/carAndRoad/chart2.png');
      }
      #chart3 {
        background: url('../../assets/carAndRoad/chart3.png');
      }
      #chart4 {
        background: url('../../assets/carAndRoad/chart4.png');
      }
      .bottom {
        text-align: center;
        width: 100%;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fbfbfb;
        opacity: 0.8;
        margin-top: 20px;
        font-size: 20px;
        background: linear-gradient(0deg, #89f3ef 0%, #3ec2ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  .change-tab {
    position: absolute;
    left: 629px;
    top: 126.5px;
    div {
      display: inline-block;
      text-align: center;
      line-height: 38px;
      vertical-align: top;
      cursor: pointer;
      margin: 0 6px;
      img {
        width: 16px;
        height: 14px;
        position: relative;
        top: 2px;
      }
    }
    .left-tab {
      width: 73px;
      height: 38px;
      background: url('../../assets/carAndRoad/left-btn.png');
    }
    .left-tab:hover {
      background: url('../../assets/carAndRoad/right-btn.png');
    }
    .tab {
      width: 119px;
      height: 38px;
      background: url('../../assets/carAndRoad/place.png');
    }
    .tab:hover {
      color: #fff;
      background: url('../../assets/carAndRoad/place-hover.png');
    }
    .tab.active {
      color: #fff;
      background: url('../../assets/carAndRoad/place-hover.png');
    }
  }
  .show-container {
    display: inline-block;
    position: absolute;
    top: 180px;
    left: 440px;
    div {
      display: inline-block;
    }
    .runway {
      width: 1355px;
      height: 500px;
      background: url('../../assets/carAndRoad/runway.png');
      margin: 100px 50px 20px 90px;
    }
    .light {
      width: 189px;
      height: 148.5px;
      background: url('../../assets/carAndRoad/light.png');
      position: absolute;
      left: 147px;
      top: 29px;
    }
    .machine {
      width: 136.5px;
      height: 136px;
      background: url('../../assets/carAndRoad/machine.png');
      position: absolute;
      left: 0;
      top: 225px;
    }
    .point-cloud {
      width: 1300px;
      height: 425px;
      position: absolute;
      // border: 1px solid #fff;
      left: 141px;
      top: 137px;
      .car {
        position: absolute;
        width: 146px;
        height: 108px;
        background: url('../../assets/carAndRoad/car.png');
        // left: 1340px;
        // top: 300px;
        // transform: rotate(0deg);
        z-index: 9999;
      }
    }
    .green-wave {
      width: 332px;
      height: 54px;
      position: absolute;
      background: rgba(30, 188, 138, 0.45);
      left: 600px;
      top: 509px;
    }
    .dialog {
      width: 137px;
      height: 55px;
      background: #15446b;
      border: 2px solid rgba(8, 199, 228, 0.51);
      border-radius: 4px;
      position: absolute;
      line-height: 23px;
      padding: 5px;
    }
    .dialog.bl {
      left: 530px;
      top: 70px;
    }
    .dialog.gr {
      left: 698px;
      top: 450px;
    }
    .block {
      width: 37.5px;
      height: 45px;
      background: url('../../assets/carAndRoad/block.png');
      position: absolute;
      left: 580px;
      top: 130px;
    }
    .rsu {
      width: 189px;
      height: 147px;
      background: url('../../assets/carAndRoad/rsu.png');
      position: absolute;
      left: 900px;
      top: 29px;
    }
  }
}
</style>