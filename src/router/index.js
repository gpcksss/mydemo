import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import DailyReport from '@/components/DailyReport'
import VehicleSimulation from '@/components/VehicleSimulation'
import carAndRoad from '@/components/ExhibitioHall/index'
import chart from '@/components/ExhibitioHall/chart'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'VehicleSimulation',
      component: carAndRoad
    },
    {
      path: '/chart',
      name: 'a',
      component: chart
    },
    {
      path: '/a',
      name: 'a',
      component: HelloWorld
    },
    {
      path: '/b',
      name: 'a',
      component: DailyReport
    }
  ]
})
