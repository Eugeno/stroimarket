const filePreview = {
  show (input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        input.nextElementSibling.style.backgroundImage = `url(${e.target.result})`
        input.classList.add(`_is-chosen`)
      }
      reader.readAsDataURL(input.files[0])
    }
  },

  remove (id) {
    const input = document.getElementById(id)
    input.value = ''
    input.classList.remove(`_is-chosen`)
    input.nextElementSibling.style.backgroundImage = `none`
  }
}

const ready = () => {

}

document.addEventListener('DOMContentLoaded', ready)

