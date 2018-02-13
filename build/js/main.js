'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ready = function ready() {
  if (typeof autosize !== 'undefined') {
    autosize(document.querySelectorAll('textarea'));
  }
  paintRating();

  if (document.querySelector('[data-accordion]')) {
    accordion.init();
  }

  if (document.querySelector('[data-message]')) {
    message.init();
  }

  var tabs = [].concat(_toConsumableArray(document.querySelectorAll('[data-tabs-title]')));
  tabs.forEach(function (tab) {
    return tabControl.init(tab);
  });
};

document.addEventListener('DOMContentLoaded', ready);

var accordion = {
  init: function init() {
    var items = [].concat(_toConsumableArray(document.querySelectorAll('[data-accordion]')));
    items.forEach(function (item) {
      var title = item.querySelector('.accordion-title');
      title.addEventListener('click', function () {
        return accordion.toggle(item);
      });
    });
  },
  toggle: function toggle(item) {
    if (item.dataset.accordion && !item.classList.contains('_is-open')) {
      var boundAccordions = [].concat(_toConsumableArray(document.querySelectorAll('[data-accordion="' + item.dataset.accordion + '"]')));
      boundAccordions.forEach(function (accordionItem) {
        return accordion.close(accordionItem);
      });
    }

    item.classList.toggle('_is-open');
    var content = item.querySelector('.accordion-content');
    content.hidden = !content.hidden;
    var button = item.querySelector('.accordion-title');
    if (button.dataset.show) {
      button.innerHTML = item.classList.contains('_is-open') ? button.dataset.hide : button.dataset.show;
    }
  },
  close: function close(item) {
    item.classList.remove('_is-open');
    item.querySelector('.accordion-content').hidden = true;
    var button = item.querySelector('.accordion-title');
    if (button.dataset.show) {
      button.innerHTML = button.dataset.hide;
    }
  }
};

var message = {
  init: function init() {
    var items = [].concat(_toConsumableArray(document.querySelectorAll('[data-message]')));
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        return message.toggle(item);
      });
    });
  },
  toggle: function toggle(item) {
    item.classList.toggle('_is-minimized');
    var timeElement = item.querySelector('time');
    var datetime = timeElement.dateTime;
    var dt = datetime.split(/[- :]/).map(function (i) {
      return parseInt(i, 10);
    });
    var jsDate = new Date(dt[0], dt[1] - 1, dt[2], dt[3], dt[4]);
    var longOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    var shortOptions = {
      month: 'short',
      day: 'numeric'
    };
    if (item.classList.contains('_is-minimized')) {
      timeElement.innerHTML = jsDate.toLocaleString('ru-RU', shortOptions);
    } else {
      timeElement.innerHTML = jsDate.toLocaleString('ru-RU', longOptions);
    }
  }
};

var paintRating = function paintRating() {
  var ratings = [].concat(_toConsumableArray(document.querySelectorAll('.rating[data-value]')));
  var starWidth = 15;
  ratings.forEach(function (rating) {
    rating.style.width = rating.dataset.max * starWidth + 'px';
    rating.childNodes[0].style.width = rating.dataset.value / rating.dataset.max * 100 + '%';
  });
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
    event.preventDefault();
    var modalWindow = document.querySelector(selector);
    modalWindow.classList.add('_is-active');
    var modalOverlay = modalWindow.querySelector('.modal__overlay');
    var modalClose = modalWindow.querySelector('.modal__close');
    modalOverlay.onclick = modalClose.onclick = function () {
      return modal.close(selector);
    };
    document.body.classList.add('_is-fixed');
  },
  close: function close(selector) {
    var modalWindow = document.querySelector(selector);
    modalWindow.classList.remove('_is-active');
    document.body.classList.remove('_is-fixed');
  }
};

var operatingTime = {
  save: function save() {
    var operatingTimeWrapper = document.querySelector('.operating-time-wrapper');
    if (operatingTimeWrapper) {
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

      modal.close('#operating-time');
    }
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
};

var sidePanel = {
  toggle: function toggle() {
    var sidePanels = [].concat(_toConsumableArray(document.querySelectorAll('.grid__column_side-panel')));
    sidePanels.forEach(function (sidePanel) {
      sidePanel.classList.toggle('_is-minimized');
    });
    if (sidePanels[0].classList.contains('_is-minimized')) {
      sidePanel.closeAccordion();
    }
  },
  closeAccordion: function closeAccordion() {
    var openedItem = document.querySelector('.side-panel__item._is-open');
    if (openedItem) {
      accordion.close(openedItem);
    }
  }
};

var categories = {
  open: function open(selector) {
    event.currentTarget.disabled = true;
    document.querySelector(selector).classList.add('categories__list_full');
  },
  toggle: function toggle(selector) {
    var item = document.querySelector(selector);
    item.classList.toggle('categories__list_full');

    var button = event.currentTarget;
    if (button.dataset.show) {
      button.innerHTML = item.classList.contains('categories__list_full') ? button.dataset.hide : button.dataset.show;
    }
  }
};

var showMore = {
  toggle: function toggle(selector) {
    var list = document.querySelector(selector);
    var button = event.currentTarget;
    button.innerHTML = list.classList.contains('_is-expanded') ? button.dataset.showMore : button.dataset.showLess;
    list.classList.toggle('_is-expanded');
  }
};

var layoutView = {
  toggle: function toggle(selector) {
    if (!event.currentTarget.classList.contains('_is-active')) {
      document.querySelector('.layout-view__layout-type_list').classList.toggle('_is-active');
      document.querySelector('.layout-view__layout-type_grid').classList.toggle('_is-active');
      document.querySelector(selector).classList.toggle('_list-view');
      document.querySelector(selector).classList.toggle('_grid-view');
    }
  }
};