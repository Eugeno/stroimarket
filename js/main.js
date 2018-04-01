const ready = () => {
  if (typeof autosize !== 'undefined') {
    autosize(document.querySelectorAll(`textarea`))
  }
  paintRating()

  if (document.querySelector(`[data-expander]`)) {
    expander.init()
  }

  if (document.querySelector(`[data-accordion]`)) {
    accordion.init()
  }

  if (document.querySelector(`[data-message]`)) {
    message.init()
  }

  const tabs = [...document.querySelectorAll(`[data-tabs-title]`)]
  tabs.forEach(tab => tabControl.init(tab))

  if (document.querySelector(`[data-minimizable]`)) {
    minimizeTexts([...document.querySelectorAll(`[data-minimizable]`)])
  }

  if (document.querySelector(`[data-cart-counter]`)) {
    cartCounter.init()
  }

  if (document.querySelector(`[data-summary-counter]`)) {
    summaryCounter.init()
  }

  if (document.querySelector(`[data-choose-cities]`)) {
    citiesChooser.init()
  }

  if (document.querySelector(`.lang-switcher`)) {
    langSwitcher.init()
  }
}

document.addEventListener('DOMContentLoaded', ready)

const accordion = {
  init (items = document.querySelectorAll(`[data-accordion]`)) {
    [...items].forEach(item => {
      const title = item.querySelector(`.accordion-title`)
      title.addEventListener('click', () => accordion.toggle(item))
    })
  },

  toggle (item) {
    if (item.dataset.accordion && !item.classList.contains(`_is-open`)) {
      const boundAccordions = [...document.querySelectorAll(`[data-accordion="${item.dataset.accordion}"]`)]
      boundAccordions.forEach(accordionItem => accordion.close(accordionItem))
    }

    item.classList.toggle(`_is-open`)
    const content = item.querySelector(`.accordion-content`)
    content.hidden = !content.hidden
    const button = item.querySelector(`.accordion-title`)
    if (button.dataset.show) {
      button.innerHTML = item.classList.contains(`_is-open`) ?
        button.dataset.hide :
        button.dataset.show
    }

    const nestedAccordions = [...item.querySelectorAll(`[data-accordion]`)]
    if (nestedAccordions) {
      nestedAccordions.forEach(nestedAccordion => accordion.close(nestedAccordion))
    }
  },

  close (item) {
    item.classList.remove(`_is-open`)
    item.querySelector(`.accordion-content`).hidden = true
    const button = item.querySelector(`.accordion-title`)
    if (button.dataset.show) {
      button.innerHTML = button.dataset.hide
    }
  }
}

const expander = {
  init () {
    const expanderElements = [...document.querySelectorAll(`[data-expander]`)]
    expanderElements.forEach(expanderElement => {
      const expanderItems = [...expanderElement.querySelectorAll(`[data-expander-item]`)]
      expanderItems.forEach(expanderItem => {
        expanderItem.addEventListener('click',
          () => expander.toggle(expanderItem, expanderElement))
      })
    })
  },

  toggle (expanderItem, expanderElement) {
    if (!expanderItem.classList.contains(`_is-active`) && event.target.tagName.toLowerCase() !== 'a') {
      expanderElement.querySelector(`._is-active[data-expander-item]`).classList.remove(`_is-active`)
      expanderItem.classList.add(`_is-active`)
    }
  }
}

const message = {
  init () {
    const items = [...document.querySelectorAll(`[data-message]`)]
    items.forEach(item => {
      item.addEventListener('click', () => message.toggle(item))
    })
  },

  toggle (item) {
    item.classList.toggle(`_is-minimized`)
    const timeElement = item.querySelector(`time`)
    const datetime = timeElement.dateTime
    const dt = datetime.split(/[- :]/).map(i => parseInt(i, 10))
    const jsDate = new Date(dt[0], dt[1] - 1, dt[2], dt[3], dt[4])
    const longOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    const shortOptions = {
      month: 'short',
      day: 'numeric'
    }
    if (item.classList.contains(`_is-minimized`)) {
      timeElement.innerHTML = jsDate.toLocaleString('ru-RU', shortOptions)
    } else {
      timeElement.innerHTML = jsDate.toLocaleString('ru-RU', longOptions)
    }
  },
}

const paintRating = () => {
  const ratings = [...document.querySelectorAll(`.rating[data-value]`)]
  const starWidth = 15
  ratings.forEach(rating => {
    rating.style.width = `${rating.dataset.max * starWidth}px`
    rating.childNodes[0].style.width = `${rating.dataset.value / rating.dataset.max * 100}%`
  })
}

const tabControl = {
  init (tab) {
    const tabSwitchers = [...tab.querySelectorAll(`[data-tab]`)]
    tabSwitchers.forEach(tabSwitcher => {
      tabSwitcher.addEventListener(`click`, () => tabControl.switch(tabSwitcher, tab))
    })
  },

  switch (tabSwitcher, tab) {
    const activeClass = `_is-active`
    if (!tabSwitcher.classList.contains(activeClass)) {
      const name = tab.dataset.tabsTitle
      const tabsContent = document.querySelector(`[data-tabs-content=${name}]`)
      const activeTabSwitcher = tab.querySelector(`.${activeClass}`)
      activeTabSwitcher.classList.remove(activeClass)
      tabSwitcher.classList.add(activeClass)
      tabsContent.querySelector(`[data-tab="${activeTabSwitcher.dataset.tab}"]`).hidden = true
      tabsContent.querySelector(`[data-tab="${tabSwitcher.dataset.tab}"]`).hidden = false

      if (tabsContent.querySelector(`._is-minimized[data-minimizable]`)) {
        minimizeTexts([...tabsContent.querySelectorAll(`._is-minimized[data-minimizable]`)])
      }
    }
  }
}

const filePreview = {
  show (event) {
    const input = event.target
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      input.nextElementSibling.style.backgroundImage = `url(${e.target.result})`
      input.classList.add(`_is-chosen`)
    }
    reader.readAsDataURL(file)
  },

  remove (id) {
    const input = document.getElementById(id)
    input.value = ``
    input.classList.remove(`_is-chosen`)
    input.nextElementSibling.style.backgroundImage = `none`
  }
}

const modal = {
  open (selector) {
    if (event) event.preventDefault()
    const modalWindow = document.querySelector(selector)
    modalWindow.classList.add(`_is-active`)
    const modalOverlay = modalWindow.querySelector(`.modal__overlay`)
    const modalClose = modalWindow.querySelector(`.modal__close`)
    modalOverlay.onclick = modalClose.onclick = () => modal.close(selector)
    document.body.classList.add(`_is-fixed`)
  },

  close (selector) {
    const modalWindow = document.querySelector(selector)
    modalWindow.classList.remove(`_is-active`)
    document.body.classList.remove(`_is-fixed`)
  }
}

const operatingTime = {
  save () {
    const operatingTimeWrapper = document.querySelector(`.operating-time-wrapper`)
    if (operatingTimeWrapper) {
      let operatingTimeTable
      if (operatingTimeWrapper.hasChildNodes()) {
        operatingTimeTable = operatingTimeWrapper.querySelector(`.registration__operating-time`)
      } else {
        const operatingTimeTemplate = document.getElementById(`operating-time-template`)
        const operatingTimeToClone = operatingTimeTemplate.content.querySelector(`.registration__operating-time`)
        operatingTimeTable = operatingTimeToClone.cloneNode(true)
      }

      const operatingTimeInputTable = document.getElementById(`operating-time`)
      const inputs = [...operatingTimeInputTable.querySelectorAll(`input`)]
      const th = [...operatingTimeTable.querySelectorAll(`th`)]
      inputs.forEach(input => {
        const span = operatingTimeTable.querySelector(`[data-id="${input.dataset.id}"]`)
        const value = input.value.trim()
        span.innerHTML = value
        const number = input.dataset.id.substr(input.dataset.id.length - 1)
        if (!value) {
          span.parentNode.classList.add(`_is-empty`)
          if (input.dataset.id.includes(`work`)) {
            th[number - 1].classList.add(`day-off`)
          }
        } else {
          span.parentNode.classList.remove(`_is-empty`)
          th[number - 1].classList.remove(`day-off`)
        }
      })

      if (!operatingTimeWrapper.hasChildNodes()) {
        operatingTimeWrapper.appendChild(operatingTimeTable)

        const setBtn = document.getElementById(`set-operating-time`)
        setBtn.remove()

        const editBtnTemplate = document.getElementById(`edit-operating-time`)
        const editBtnToClone = editBtnTemplate.content.querySelector(`button`)
        const editBtn = editBtnToClone.cloneNode(true)
        operatingTimeWrapper.appendChild(editBtn)
      }

      modal.close(`#operating-time`)
    }
  }
}

const registrationDelivery = {
  toggle () {
    const registrationDeliveryWrapper = document.querySelector(`.registration-delivery-wrapper`)
    if (registrationDeliveryWrapper.hasChildNodes()) {
      registrationDelivery.clear(registrationDeliveryWrapper)
    } else {
      registrationDelivery.enable(registrationDeliveryWrapper)
    }
  },

  clear (wrapper) {
    wrapper.innerHTML = ``
  },

  enable (wrapper) {
    const registrationDeliveryTemplate = document.getElementById(`registration-delivery-template`)
    const registrationDeliveryToClone = registrationDeliveryTemplate.content.querySelector(`div`)
    const registrationDelivery = registrationDeliveryToClone.cloneNode(true)
    wrapper.appendChild(registrationDelivery)
    this.addItem()
  },

  addItem () {
    const registrationDeliveryWrapper = document.querySelector(`.registration-delivery-wrapper`)
    const deliveryItemTemplate = document.getElementById(`delivery-item-template`)
    const deliveryItemToClone = deliveryItemTemplate.content.querySelector(`div`)
    const deliveryItem = deliveryItemToClone.cloneNode(true)
    // const dp = new Dropkick(deliveryItem.querySelector(`select`))
    const addButton = registrationDeliveryWrapper.querySelector(`.registration__add-delivery`)
    addButton.parentNode.insertBefore(deliveryItem, addButton)
  }
}

const checkForm = (form) => {
  const requiredFields = [...form.querySelectorAll(`[required]`)]
  let allFieldsValid = true
  requiredFields.forEach(field => {
    if (!field.checkValidity()) {
      allFieldsValid = false
    }
  })

  let noErrorFields = !form.querySelector(`.form__error`)

  const submitBtn = form.querySelector(`[type="submit"]`)
  submitBtn.disabled = !allFieldsValid || !noErrorFields
}

const sidePanel = {
  toggle () {
    const sidePanels = [...document.querySelectorAll(`.grid__column_side-panel`)]
    sidePanels.forEach(sidePanel => {
      sidePanel.classList.toggle(`_is-minimized`)
    })
    if (sidePanels[0].classList.contains(`_is-minimized`)) {
      sidePanel.closeAccordion()
    }
  },

  closeAccordion () {
    const openedItem = document.querySelector(`.side-panel__item._is-open`)
    if (openedItem) {
      accordion.close(openedItem)
    }
  }
}

const categories = {
  open (selector) {
    event.currentTarget.disabled = true
    document.querySelector(selector).classList.add(`categories__list_full`)
  },

  toggle (selector) {
    const item = document.querySelector(selector)
    item.classList.toggle(`categories__list_full`)

    const button = event.currentTarget
    if (button.dataset.show) {
      button.innerHTML = item.classList.contains(`categories__list_full`) ?
        button.dataset.hide :
        button.dataset.show
    }
  }
}

const showMore = {
  toggle (selector) {
    const list = document.querySelector(selector)
    const button = event.currentTarget
    button.innerHTML = list.classList.contains(`_is-expanded`) ?
      button.dataset.showMore :
      button.dataset.showLess
    list.classList.toggle(`_is-expanded`)
  }
}

const layoutView = {
  toggle (selector) {
    if (!event.currentTarget.classList.contains(`_is-active`)) {
      document.querySelector(`.layout-view__layout-type_list`).classList.toggle(`_is-active`)
      document.querySelector(`.layout-view__layout-type_grid`).classList.toggle(`_is-active`)
      document.querySelector(selector).classList.toggle(`_list-view`)
      document.querySelector(selector).classList.toggle(`_grid-view`)
    }
  }
}

const minimizeTexts = texts => {
  texts.forEach(text => {
    const button = text.querySelector(`.product-sheet__expand-caption`)
    if (text.scrollHeight) {
      if (text.scrollHeight > text.clientHeight) {
        text.classList.add(`_is-minimized`)
        button.addEventListener('click', () => {
          text.classList.remove(`_is-minimized`)
          button.remove()
        })
      } else {
        text.classList.remove(`_is-minimized`)
        if (button) button.remove()
      }
    }
  })
}

const triggerInput = (element) => {
  const event = new Event('input', {
    'bubbles': true,
    'cancelable': true
  })

  element.dispatchEvent(event)
}

const cartCounter = {
  init (items = document.querySelectorAll(`[data-cart-counter]`)) {
    [...items].forEach(item => {
      const count = item.querySelector(`[data-cart-count]`)
      const increment = item.querySelector(`[data-cart-increment]`)
      const decrement = item.querySelector(`[data-cart-decrement]`)

      const options = {
        item,
        count,
        increment,
        decrement,
        min: 1,
        max: 99
      }
      increment.addEventListener('click', () => {
        this.increase(options)
        triggerInput(count)
      })
      decrement.addEventListener('click', () => {
        this.decrease(options)
        triggerInput(count)
      })
      count.addEventListener('input', () => this.checkEdges(options))
    })
  },

  increase (options) {
    if (!options.increment.disabled) {
      options.count.value++
    }
  },

  decrease (options) {
    if (!options.decrement.disabled) {
      options.count.value--
    }
  },

  checkEdges (options) {
    if (+options.count.value === options.max) {
      options.increment.disabled = true
    } else {
      if (options.increment.disabled) {
        options.increment.disabled = false
      }
    }
    if (+options.count.value === options.min) {
      options.decrement.disabled = true
    } else {
      if (options.decrement.disabled) {
        options.decrement.disabled = false
      }
    }
  }
}

const summaryCounter = {
  init (items = document.querySelectorAll(`[data-summary-counter]`)) {
    [...items].forEach(item => {
      const name = item.dataset.summaryCounter
      const unit = item.querySelector(`[data-summary-unit="${name}"]`)
      const increment = item.querySelector(`[data-summary-increment="${name}"]`)
      const value = item.querySelector(`[data-summary-value="${name}"]`)
      const summands = [...item.querySelectorAll(`[data-summary-summand="${name}"]`)]

      const options = {
        item,
        unit,
        increment,
        value,
        summands
      }
      if (increment) {
        increment.addEventListener('input', () => this.calculate(options))
      } else {
        summands.forEach(summand => {
          summand.addEventListener('input', () => this.calculate(options))
        })
      }
    })
  },

  calculate (options) {
    let value
    if (options.increment) {
      value = parseInt(options.increment.value, 10) * parseFloat(options.unit.innerHTML).toFixed(2)
    } else {
      value = options.summands.map(a => parseFloat(a.value)).reduce((a, b) => a + b, 0)
    }
    if (options.value.hasAttribute(`data-summary-bind`)) {
      const name = options.value.dataset.summaryBind
      const binded = options.item.querySelector(`[data-summary-binded="${name}"]`)
      binded.value = value
      triggerInput(binded)
    }
    options.value.innerHTML = value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
}

const citiesChooser = {
  init (items = document.querySelectorAll(`[data-choose-cities]`)) {
    [...items].forEach(item => {
      this.chooserForm = item.querySelector(`.choose-city__form`)
      this.choosenContainer = this.chooserForm.querySelector(`fieldset`)
      const cities = [...this.chooserForm.querySelectorAll(`input`)]
      cities.forEach(city => city.addEventListener('change', () => this.action(city)))
    })
  },

  action (city, isInit = false) {
    const container = city.parentNode
    if (city.checked) {
      const clonedContainer = container.cloneNode(true)
      this.choosenContainer.appendChild(clonedContainer)
      this.choosenContainer.classList.remove(`_is-hidden`)

      const clonedCity = clonedContainer.querySelector(`input`)
      clonedCity.addEventListener('change', () => this.action(clonedCity))

      city.dataset.id = city.getAttribute(`id`)
      city.removeAttribute(`id`)
      container.classList.add(`_is-chosen`)

      const currentFieldset = container.parentNode
      if (!currentFieldset.querySelector(`p:not(._is-chosen)`)) {
        currentFieldset.classList.add(`_is-hidden`)
      }

      if (city.getAttribute('type') === 'radio') {
        this.deselect(clonedContainer.previousElementSibling.querySelector('input'))
      }
    } else if (!isInit) {
      this.deselect(city)
    }
  },

  deselect (city) {
    const container = city.parentNode
    const id = city.getAttribute(`id`)
    container.remove()
    const originalCity = this.chooserForm.querySelector(`[data-id="${id}"]`)
    originalCity.setAttribute(`id`, originalCity.dataset.id)
    originalCity.removeAttribute(`data-id`)
    originalCity.checked = false

    const originalContainer = originalCity.parentNode
    originalContainer.classList.remove(`_is-chosen`)

    if (!this.choosenContainer.querySelector(`p`)) {
      this.choosenContainer.classList.add(`_is-hidden`)
    }

    const currentFieldset = originalContainer.parentNode
    currentFieldset.classList.remove(`_is-hidden`)
  }
}

const deleteElement = (selector) => {
  const el = document.querySelector(selector)
  if (el) el.remove()
}

const langSwitcher = {
  init () {
    const switcherContainer = document.querySelector(`.lang-switcher`)
    const button = switcherContainer.querySelector(`.lang-switcher__button`)
    button.addEventListener('click', () => this.toggle(switcherContainer))
  },

  toggle (sc) {
    sc.classList.toggle(`_is-active`)
    const bodyHandler = (event) => {
      if (event.target.parentNode !== sc) {
        this.close(sc)
        document.body.removeEventListener('click', bodyHandler)
      }
    }
    if (sc.classList.contains(`_is-active`)) {
      document.body.addEventListener('click', bodyHandler)
    }
  },

  close (sc) {
    sc.classList.remove(`_is-active`)
  }
}
