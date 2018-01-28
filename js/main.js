const ready = () => {
  if (typeof autosize !== 'undefined') {
    autosize(document.querySelectorAll(`textarea`))
  }
  paintRating()

  if (document.querySelector(`[data-accordion]`)) {
    accordion.init()
  }

  const tabs = [...document.querySelectorAll(`[data-tabs-title]`)]
  tabs.forEach(tab => tabControl.init(tab))
}

document.addEventListener('DOMContentLoaded', ready)

const accordion = {
  init () {
    const items = [...document.querySelectorAll(`[data-accordion]`)]
    items.forEach(item => {
      const title = item.querySelector(`.accordion-title`)
      title.addEventListener('click', () => accordion.toggle(item))
    })
  },

  toggle (item) {
    item.classList.toggle(`_is-open`)
    const content = item.querySelector(`.accordion-content`)
    content.hidden = !content.hidden
    const button = item.querySelector(`.accordion-title`)
    if (button.dataset.show) {
      button.innerHTML = item.classList.contains(`_is-open`) ?
        button.dataset.hide :
        button.dataset.show
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
    event.preventDefault()
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
