<template>
  <div class="hello">
    <div class="block">
      <div>
        <!-- <el-radio-group @change="changeType" v-model="dateType">
          <el-radio :label="0">按周</el-radio>
          <el-radio :label="1">按月</el-radio>
        </el-radio-group>-->
      </div>
      <div class="search-place">
        <!-- <el-date-picker
          v-if="dateType===0"
          v-model="searchObj.date"
          type="week"
          @change="changeWeek"
          :format="weekFormat"
          :picker-options="{'firstDayOfWeek': 1}"
          placeholder="选择周"
        ></el-date-picker>
        <el-date-picker
          v-if="dateType===1"
          v-model="searchObj.date"
          type="month"
          value-format="yyyy-MM"
          format="yyyy-MM"
          placeholder="选择月"
        ></el-date-picker>
        <el-date-picker
          v-if="dateType===2"
          v-model="searchObj.date"
          type="year"
          @change="changeWeek"
          format="yyyy年度"
          placeholder="选择年"
        ></el-date-picker>-->
        <el-date-picker
          v-model="searchObj.date1"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始时间"
        ></el-date-picker>
        <el-date-picker
          v-model="searchObj.date2"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束时间"
        ></el-date-picker>
        <!-- <el-select v-model="searchObj.group" class="group" placeholder="查询组">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>-->
        <el-select
          v-model="searchObj.member"
          clearable
          filterable
          class="member"
          placeholder="查询成员"
        >
          <el-option
            v-for="item in memberList"
            :key="item.id"
            :label="item.nickName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button @click="submit">查询</el-button>
      </div>
      <!-- <span v-if="dateDetail">{{dateDetail}}</span> -->
    </div>
    <el-table :data="tableData" default-sort="custom" @sort-change="sortChange" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column align="left" sortable prop="nickName" label="员工姓名" width="150"></el-table-column>
      <el-table-column align="left" sortable prop="logdate" label="日期" width="150"></el-table-column>
      <el-table-column prop="worktime" align="center" label="工时(小时)" width="150"></el-table-column>
      <el-table-column align="left" label="工作内容">
        <template slot-scope="scope">
          <span v-html="scope.row.workcontent"></span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="prop" label="工作进度" align="center"></el-table-column> -->
      <!-- <el-table-column align="left" prop="plan" label="下周工作计划">
        <template slot-scope="scope">
          <span v-html="scope.row.plan"></span>
        </template>
      </el-table-column>-->
      <!-- <el-table-column prop="prop" label="工作进度预估" align="center"></el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      searchObj: { date1: '', date2: '' },
      dateDetail: '',
      tableData: [],
      dateType: 0,
      weekFormat: '',
      memberList: []
    }
  },
  mounted() {
    var date = new Date()
    var month =
      date.getMonth() + 1 > 9
        ? date.getMonth() + 1
        : '0' + (date.getMonth() + 1)
    var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    if (day < 21) {
      this.searchObj.date1 = date.getFullYear() + '-' + (month - 1) + '-21'
    } else {
      this.searchObj.date1 = date.getFullYear() + '-' + month + '-21'
    }
    this.searchObj.date2 = date.getFullYear() + '-' + month + '-' + day
    this.$http.get('http://39.98.187.79:9048/ruoyi/app/user/list').then(res => {
      this.memberList = res.data.rows
    })
    this.submit()
    // this.$http
    //   .get('http://39.98.187.79:9048/ruoyi/app/week_log/weblist')
    //   .then(res => {
    //     this.tableData = res.data.rows
    //     this.tableData.forEach(element => {
    //       var array = element.workcontent.split('\n')
    //       var array2 = element.plan.split('\n')
    //       element.workcontent = ''
    //       element.plan = ''
    //       array.forEach((el, index) => {
    //         if (index < array.length - 1) {
    //           element.workcontent += el + '<br/>'
    //         }
    //       })
    //       array2.forEach((el, index) => {
    //         if (index < array.length - 1) {
    //           element.plan += el + '<br/>'
    //         }
    //       })
    //       console.log()
    //     })
    //   })
  },
  methods: {
    sortChange(data) {
      debugger
    },
    changeType(data) {
      this.searchObj.date = ''
    },
    changeWeek(data) {
      if (!data) {
        this.weekFormat = ''
        return
      }
      var date1 = new Date(data.getTime() - 86400000)
      var date = date1.getTime() + 518400000
      var date2 = new Date(date)
      this.weekFormat = getDate(date1) + ' ~ ' + getDate(date2)

      function getDate(v) {
        var year = v.getFullYear()
        var month =
          v.getMonth() + 1 > 9 ? v.getMonth() + 1 : '0' + (v.getMonth() + 1)
        var day = v.getDate() > 9 ? v.getDate() : '0' + v.getDate()
        return year + '-' + month + '-' + day
      }
    },
    submit() {
      var startDate = this.searchObj.date1 ? this.searchObj.date1 : undefined
      var endDate = this.searchObj.date2 ? this.searchObj.date2 : undefined
      this.$http
        .get('http://39.98.187.79:9048/ruoyi/app/log/weblist', {
          params: {
            userid: this.searchObj.member,
            startdate: startDate,
            enddate: endDate
            // state: 1
          }
        })
        .then(res => {
          this.tableData = res.data.rows
          this.tableData.forEach(element => {
            var array = element.workcontent.split('\n')
            // var array2 = element.plan.split('\n')
            element.workcontent = ''
            element.plan = ''
            array.forEach((el, index) => {
              if (index < array.length) {
                element.workcontent += el + '<br/>'
              }
            })
            // array2.forEach((el, index) => {
            //   if (index < array.length - 1) {
            //     element.plan += el + '<br/>'
            //   }
            // })
            console.log()
          })
        })
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
.hello {
  padding: 20px !important;
}
.search-place {
  margin-top: 20px !important;
}
.el-input {
  width: 30% !important;
}
.el-select {
  width: 30% !important;
}
.el-select .el-input {
  width: 100% !important;
}
.el-table {
  margin-top: 20px !important;
}
.hello .el-input__inner {
  border: 1px solid #000 !important;
}
.el-radio__label {
  color: #000 !important;
}
.el-input__prefix,
.el-input__suffix {
  color: #000 !important;
  right: 15px !important;
  left: auto !important;
  font-size: 30px !important;
}
.el-input__suffix {
  right: 50px !important;
}
.el-select .el-input__suffix {
  right: 15px !important;
}
.el-select .el-input__suffix .el-select__caret {
  color: #000 !important;
}
.el-table td,
.el-table th.is-leaf {
  color: #000 !important;
}

.el-select .el-input .el-select__caret {
  transform: rotateZ(0) !important;
  font-size: 30px !important;
}
.el-select.member .el-icon-arrow-up:before {
  content: '\e7a5' !important;
}
.el-select.group .el-icon-arrow-up:before {
  content: '' !important;
}
.el-select.group .el-icon-arrow-up {
  background: url('../assets/group.png') !important;
  width: 30px !important;
  height: 30px !important;
  margin-top: 5px !important;
}
.el-button {
  color: #000 !important;
  border-color: #000 !important;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
