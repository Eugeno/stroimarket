'use strict';

var filePreview = {
  show: function show(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        input.nextElementSibling.style.backgroundImage = 'url(' + e.target.result + ')';
        input.classList.add('_is-chosen');
      };
      reader.readAsDataURL(input.files[0]);
    }
  },
  remove: function remove(id) {
    var input = document.getElementById(id);
    input.value = '';
    input.classList.remove('_is-chosen');
    input.nextElementSibling.style.backgroundImage = 'none';
  }
};

var ready = function ready() {};

document.addEventListener('DOMContentLoaded', ready);