const ready = () => {

}

document.addEventListener('DOMContentLoaded', ready)

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

  close (event) {
    let modalWindow = event.target.parentNode
    while (!modalWindow.classList.contains(`modal`)) {
      modalWindow = modalWindow.parentNode
    }
    modalWindow.classList.remove(`_is-active`)
    document.body.classList.remove(`_is-fixed`)
  }
}
