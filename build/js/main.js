'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
  close: function close(event, selector) {
    var modalWindow = void 0;
    if (selector) {
      modalWindow = document.querySelector(selector);
    } else {
      modalWindow = event.target.parentNode;
      while (!modalWindow.classList.contains('modal')) {
        modalWindow = modalWindow.parentNode;
      }
    }
    modalWindow.classList.remove('_is-active');
    document.body.classList.remove('_is-fixed');
  }
};

var operatingTime = {
  save: function save() {
    var operatingTimeWrapper = document.querySelector('.operating-time-wrapper');
    var operatingTimeTable = void 0;
    if (operatingTimeWrapper.hasChildNodes()) {
      operatingTimeTable = operatingTimeWrapper.querySelector('.registration__operating-time');
    } else {
      var operatingTimeTemplate = document.getElementById('operating-time-template');
      var operatingTimeToClone = operatingTimeTemplate.content.querySelector('.registration__operating-time');
      operatingTimeTable = operatingTimeToClone.cloneNode(true);
    }

    var operatingTimeInputTable = document.getElementById('operating-time');
    var inputs = [].concat(_toConsumableArray(operatingTimeInputTable.querySelectorAll('input')));
    var th = [].concat(_toConsumableArray(operatingTimeTable.querySelectorAll('th')));
    inputs.forEach(function (input) {
      var span = operatingTimeTable.querySelector('[data-id="' + input.dataset.id + '"]');
      var value = input.value.trim();
      span.innerHTML = value;
      var number = input.dataset.id.substr(input.dataset.id.length - 1);
      if (!value) {
        span.parentNode.classList.add('_is-empty');
        if (input.dataset.id.includes('work')) {
          th[number - 1].classList.add('day-off');
        }
      } else {
        span.parentNode.classList.remove('_is-empty');
        th[number - 1].classList.remove('day-off');
      }
    });

    if (!operatingTimeWrapper.hasChildNodes()) {
      operatingTimeWrapper.appendChild(operatingTimeTable);

      var setBtn = document.getElementById('set-operating-time');
      setBtn.remove();

      var editBtnTemplate = document.getElementById('edit-operating-time');
      var editBtnToClone = editBtnTemplate.content.querySelector('button');
      var editBtn = editBtnToClone.cloneNode(true);
      operatingTimeWrapper.appendChild(editBtn);
    }

    modal.close(null, '#operating-time');
  }
};