import JModal from './JModal'
import JFormContainer from './JFormContainer.vue'
import JPopup from './JPopup.vue'
import CustomerSelect from './CustomerSelect'
import comInput from './comInput'

export default {
  install(Vue) {
    Vue.component('JFormContainer', JFormContainer)
    Vue.component('JPopup', JPopup)
    Vue.component(JModal.name, JModal)
    Vue.component('CustomerSelect', CustomerSelect)
    Vue.component('comInput', comInput)

  }
}
