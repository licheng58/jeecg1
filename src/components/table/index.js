import StandardTable from './StandardTable.js'
import PageTitle from './PageTitle'

const custom = {
  install: function(Vue) {
    Vue.component('StandardTable', StandardTable)
    Vue.component('PageTitle', PageTitle)

  }
}

export default custom
