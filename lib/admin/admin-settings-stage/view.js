/* global fetch */
import t from 't-component'
import 'whatwg-fetch'
import FormView from '../../form-view/form-view'
import forumStore from '../../stores/forum-store/forum-store'
import template from './template.jade'
import confirm from 'lib/modals/confirm'


export default class AdminSettings extends FormView {
  constructor(forum) {
    var options = {
      form: { action: `/api/forum/${forum.id}/config` }
    }
    super(template, options)
    this.options = options
    forumStore.findOneByName('proyectos').then(this.loadSettings.bind(this)).then(this.filterFill.bind(this))

  }

  loadSettings(forum) {
    this.forum = forum

    let stageSettings = forum.config

    if (!stageSettings || !Object.keys(stageSettings).length) {
      ;
    } else {
      Object.entries(stageSettings).forEach(([k, v]) => {
        let el = this.find(`.form[data-name='${k}']`)
        if (el) {

          el.attr('name', k)
          el.value(v || '')
          if (el.hasClass('pseudo-radio')) {
            el.forEach((radioStage) => {
              if (v === radioStage.value) {
                radioStage.checked = true
                radioStage.parentNode.parentNode.classList.add('active')
              }
            })
          }

        }
      })
    }
  }


  switchOn() {

    this.votationState()
    this.createEventYear()
    this.on('success', this.onsuccess.bind(this))
    this.on('error', this.onerror.bind(this))
  }


  createEventYear() {
    this.filterYear = document.querySelector("input[data-name='filterYear']")
    this.inputNumber = document.querySelector(".comboboxChips input")
    this.comboboxChips = document.querySelector(".comboboxChips")
    this.comboboxChips.addEventListener('click', () => {
      this.inputNumber.focus()
    })
    this.inputNumber.addEventListener('keyup', (event) => this.inputFilters(event))
  }

  filterFill() {
    this.comboboxChips.innerHTML = ''
    if (this.filterYear.value.length > 0) {
      this.filterYear.value.split(',').forEach(year => {
        let div = document.createElement("div")
        let remove = document.createElement("span")
        div.classList.add('chip')
        remove.classList.add('glyphicon')
        remove.classList.add('glyphicon-remove')
        remove.addEventListener('click', (event) => this.deleteFilter(year))
        div.append(year)
        div.append(remove)
        this.comboboxChips.append(div, this.inputNumber)
      })
    } else { this.comboboxChips.append(this.inputNumber) }
  }

  inputFilters(event) {
    if (event.keyCode === 188 || event.keyCode === 13 || event.target.value.length === 4) {
      if (event.target.value > 1900 && event.target.value < 9999 && event.target.value.length === 4) {
        let arrayFilter = this.filterYear.value.length > 0 ? this.filterYear.value.split(',') : []
        if (!arrayFilter.includes(event.target.value)) arrayFilter.push(event.target.value)
        this.filterYear.value = arrayFilter.sort().toString()
        this.filterFill()
        event.target.value = ''
        event.target.focus()
      }
    } else if (event.keyCode === 8 && (!event.target.dataset.oldval || event.target.dataset.oldval.length < 1)) {
      let filterYeararray = this.filterYear.value.split(',')
      this.deleteFilter(filterYeararray.pop())
      event.target.focus()
    }

    event.target.setAttribute('data-oldVal', event.target.value)
  }
  deleteFilter(yearToDelete) {
    let filterYearfiltred = this.filterYear.value.split(',').filter(year => year !== yearToDelete)
    this.filterYear.value = filterYearfiltred
    this.filterFill()
  }

  switchOff() {
    this.off()
  }

  onsuccess() {
    this.messages(['Los cambios se han guardado exitósamente'], 'success')
    forumStore.findOneByName('proyectos').then(this.loadSettings.bind(this))//.then(this.onShow())
    window.scrollTo(0, 0)
  }

  onerror() {
    this.messages([t('common.internal-error')])
  }

  votationState() {
    let votationState = document.querySelectorAll('.pseudo-radio')
    votationState.forEach((checkbox) => {
      checkbox.addEventListener('change', (event) => {
        if (!event.target.checked) event.target.checked = true
        event.target.parentNode.parentNode.classList.add('active')
        votationState.forEach((toChange) => {
          if (toChange.id === event.target.id) return
          toChange.parentNode.parentNode.classList.remove('active')
          toChange.checked = false
        })
      })
    })
  }
}