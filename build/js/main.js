'use strict';

var ready = function ready() {};

document.addEventListener('DOMContentLoaded', ready);

var filePreview = {
  show: function show(event) {
    var input = event.target;
    var file = input.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      input.nextElementSibling.style.backgroundImage = 'url(' + e.target.result + ')';
      input.classList.add('_is-chosen');
    };
    reader.readAsDataURL(file);
  },
  remove: function remove(id) {
    var input = document.getElementById(id);
    input.value = '';
    input.classList.remove('_is-chosen');
    input.nextElementSibling.style.backgroundImage = 'none';
  }
};

var modal = {
  open: function open(selector) {
    var modalWindow = document.querySelector(selector);
    modalWindow.classList.add('_is-active');
    var modalOverlay = modalWindow.querySelector('.modal__overlay');
    var modalClose = modalWindow.querySelector('.modal__close');
    modalOverlay.onclick = modalClose.onclick = modal.close;
    document.body.classList.add('_is-fixed');
  },
  close: function close(event) {
    var modalWindow = event.target.parentNode;
    while (!modalWindow.classList.contains('modal')) {
      modalWindow = modalWindow.parentNode;
    }
    modalWindow.classList.remove('_is-active');
    document.body.classList.remove('_is-fixed');
  }
};