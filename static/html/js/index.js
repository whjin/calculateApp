window.onload = function () {
  createBtnEl();
};

let map = new Map();
let showEl = document.querySelector('.calc-show');
showEl.innerHTML = '<div>0</div>';
function createBtnEl() {
  showEl.setAttribute('contenteditable', false);
  let operateEl = document.querySelector('.calc-operate');
  let brandEl = document.querySelector('.brand');
  let year = new Date().getFullYear();
  let dateTxt = year == 2025 ? '2025-现在' : `2025-${year}`;
  brandEl.innerText = `Copyright © ${dateTxt} wuhuajin.com 版权所有`;

  btnKeys.forEach(item => {
    map.set(item.label, item);
    let el = document.createElement('div');
    el.classList.add('btn-key');
    if (item.label == 'AC') {
      el.classList.add('btn-reset');
    }
    el.innerText = item.label;
    el.style.color = item.color;
    el.style.background = item.background;
    el.setAttribute('value', item.value);
    operateEl.appendChild(el);
  });

  showEl.insertAdjacentElement('afterend', operateEl);

  getBtnText();
}

function getBtnText() {
  let btnEls = document.querySelectorAll('.btn-key');
  [...btnEls].forEach(el => {
    const { background, hover } = map.get(el.innerText);
    el.addEventListener('mouseover', e => {
      el.style.background = hover;
    });
    el.addEventListener('mouseleave', e => {
      el.style.background = background;
    });
    el.addEventListener('mousedown', e => {
      el.classList.add('remove-shadow');
    });
    el.addEventListener('mouseup', e => {
      el.classList.remove('remove-shadow');
      let value = el.getAttribute('value');
      handleKeyAction(el, value);
    });
  });
}

let valList = [];
let resetEl = null;
let result = 0;
function handleKeyAction(el, value) {
  if (['AC', 'CE'].includes(el.innerText)) {
    resetEl = el;
    if (valList.includes('=')) {
      valList.length = 0;
    } else {
      valList.pop();
    }
  } else {
    let lastVal = valList[valList.length - 1] || '';
    if (lastVal !== '=') {
      valList.push(value);
      resetEl = document.querySelector('.btn-reset');
    } else {
      valList.length = 0;
      valList[0] = result;
      valList.push(value);
    }
  }

  handleKeyPress();
}

function handleKeyPress() {
  if (valList.length) {
    let expstr = '';
    let expressEl = document.createElement('div');
    let equalEl = document.createElement('div');
    valList.forEach(val => {
      if (val == '=') {
        equalEl.innerText = val;
      } else {
        expstr += val;
      }
    });
    expressEl.innerText = expstr || '0';
    showEl.replaceChildren();
    showEl.appendChild(expressEl);
    if (equalEl.innerText) {
      expressEl.classList.add('expression');
      result = handleCalcEval(expstr);
      equalEl.innerText += result;
      expressEl.insertAdjacentElement('afterend', equalEl);
    }
    showEl.scrollTop = showEl.scrollHeight;
  } else {
    showEl.innerHTML = '<div>0</div>';
  }
  resetEl.innerText = valList.length ? 'CE' : 'AC';
}

function handleCalcEval(expstr) {
  let resList = [];
  const regex = /(\d+|[-%÷×+().])/g;
  resList = expstr.match(regex) || ['0'];
  const calcMap = {
    '÷': '/',
    '×': '*',
  };
  resList.forEach((item, index) => {
    if (calcMap[item]) {
      resList[index] = calcMap[item];
    }
  });
  let calcstr = '';
  resList.forEach(val => (calcstr += val));
  try {
    let res = parseFloat(eval(calcstr).toFixed(8));
    return res;
  } catch (e) {
    return '算式错误';
  }
}

function setContent(data) {
  const { deviceOrientation } = data.content;
  let containerEl = document.querySelector('.container');
  if (deviceOrientation == 'portrait') {
    containerEl.style.height = '100%';
    containerEl.style.paddingTop = '0px';
  } else {
    containerEl.style.height = 'auto';
    containerEl.style.paddingTop = '90px';
  }
}
