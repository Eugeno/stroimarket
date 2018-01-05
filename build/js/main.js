'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ready = function ready() {
  if (typeof autosize !== 'undefined') {
    autosize(document.querySelectorAll('textarea'));
  }

  var sidePanel = document.querySelector('.side-panel');
  if (sidePanel) {
    accordion.init(sidePanel);
  }

  var tabs = [].concat(_toConsumableArray(document.querySelectorAll('[data-tabs-title]')));
  tabs.forEach(function (tab) {
    return tabControl.init(tab);
  });
};

document.addEventListener('DOMContentLoaded', ready);

var accordion = {
  init: function init() {
    var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;

    var items = [].concat(_toConsumableArray(container.querySelectorAll('[data-accordion]')));
    items.forEach(function (item) {
      var title = item.querySelector('.accordion-title');
      title.addEventListener('click', function () {
        return accordion.toggle(item);
      });
    });
  },
  toggle: function toggle(item) {
    item.classList.toggle('_is-open');
    var content = item.querySelector('.accordion-content');
    content.hidden = !content.hidden;
  }
};

var tabControl = {
  init: function init(tab) {
    var tabSwitchers = [].concat(_toConsumableArray(tab.querySelectorAll('[data-tab]')));
    tabSwitchers.forEach(function (tabSwitcher) {
      tabSwitcher.addEventListener('click', function () {
        return tabControl.switch(tabSwitcher, tab);
      });
    });
  },
  switch: function _switch(tabSwitcher, tab) {
    var activeClass = '_is-active';
    if (!tabSwitcher.classList.contains(activeClass)) {
      var name = tab.dataset.tabsTitle;
      var tabsContent = document.querySelector('[data-tabs-content=' + name + ']');
      var activeTabSwitcher = tab.querySelector('.' + activeClass);
      activeTabSwitcher.classList.remove(activeClass);
      tabSwitcher.classList.add(activeClass);
      tabsContent.querySelector('[data-tab="' + activeTabSwitcher.dataset.tab + '"]').hidden = true;
      tabsContent.querySelector('[data-tab="' + tabSwitcher.dataset.tab + '"]').hidden = false;
    }
  }
};

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

var registrationDelivery = {
  toggle: function toggle() {
    var registrationDeliveryWrapper = document.querySelector('.registration-delivery-wrapper');
    if (registrationDeliveryWrapper.hasChildNodes()) {
      registrationDelivery.clear(registrationDeliveryWrapper);
    } else {
      registrationDelivery.enable(registrationDeliveryWrapper);
    }
  },
  clear: function clear(wrapper) {
    wrapper.innerHTML = '';
  },
  enable: function enable(wrapper) {
    var registrationDeliveryTemplate = document.getElementById('registration-delivery-template');
    var registrationDeliveryToClone = registrationDeliveryTemplate.content.querySelector('div');
    var registrationDelivery = registrationDeliveryToClone.cloneNode(true);
    wrapper.appendChild(registrationDelivery);
    this.addItem();
  },
  addItem: function addItem() {
    var registrationDeliveryWrapper = document.querySelector('.registration-delivery-wrapper');
    var deliveryItemTemplate = document.getElementById('delivery-item-template');
    var deliveryItemToClone = deliveryItemTemplate.content.querySelector('div');
    var deliveryItem = deliveryItemToClone.cloneNode(true);
    var addButton = registrationDeliveryWrapper.querySelector('.registration__add-delivery');
    addButton.parentNode.insertBefore(deliveryItem, addButton);
  }
};

var checkForm = function checkForm(form) {
  var requiredFields = [].concat(_toConsumableArray(form.querySelectorAll('[required]')));
  var allFieldsValid = true;
  requiredFields.forEach(function (field) {
    if (!field.checkValidity()) {
      allFieldsValid = false;
    }
  });

  var noErrorFields = !form.querySelector('.form__error');

  var submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = !allFieldsValid || !noErrorFields;
  console.log(submitBtn);
  console.log(!allFieldsValid || !noErrorFields);
};