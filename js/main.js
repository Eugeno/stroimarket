const ready = () => {
  if (typeof autosize !== 'undefined') {
    autosize(document.querySelectorAll(`textarea`))
  }

  const sidePanel = document.querySelector(`.side-panel`)
  if (sidePanel) {
    accordion.init(sidePanel)
  }

  const tabs = [...document.querySelectorAll(`[data-tabs-title]`)]
  tabs.forEach(tab => tabControl.init(tab))
}

document.addEventListener('DOMContentLoaded', ready)

const accordion = {
  init (container = document.body) {
    const items = [...container.querySelectorAll(`[data-accordion]`)]
    items.forEach(item => {
      const title = item.querySelector(`.accordion-title`)
      title.addEventListener('click', () => accordion.toggle(item))
    })
  },

  toggle (item) {
    item.classList.toggle(`_is-open`)
    const content = item.querySelector(`.accordion-content`)
    content.hidden = !content.hidden
  }
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
    const modalWindow = document.querySelector(selector)
    modalWindow.classList.add(`_is-active`)
    const modalOverlay = modalWindow.querySelector(`.modal__overlay`)
    const modalClose = modalWindow.querySelector(`.modal__close`)
    modalOverlay.onclick = modalClose.onclick = modal.close
    document.body.classList.add(`_is-fixed`)
  },

  close (event, selector) {
    let modalWindow
    if (selector) {
      modalWindow = document.querySelector(selector)
    } else {
      modalWindow = event.target.parentNode
      while (!modalWindow.classList.contains(`modal`)) {
        modalWindow = modalWindow.parentNode
      }
    }
    modalWindow.classList.remove(`_is-active`)
    document.body.classList.remove(`_is-fixed`)
  }
}

const operatingTime = {
  save () {
    const operatingTimeWrapper = document.querySelector(`.operating-time-wrapper`)
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
    inputs.forEach((input) => {
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

    modal.close(null, `#operating-time`)
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
  requiredFields.forEach((field) => {
    if (!field.checkValidity()) {
      allFieldsValid = false
    }
  })

  let noErrorFields = !form.querySelector(`.form__error`)

  const submitBtn = form.querySelector(`[type="submit"]`)
  submitBtn.disabled = !allFieldsValid || !noErrorFields
  console.log(submitBtn)
  console.log(!allFieldsValid || !noErrorFields)
}
