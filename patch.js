/**
 * 根据虚拟 DOM 节点的属性更新真实的 DOM 节点
 * @param {vnode} newVNode 新的 VNode 节点
 * @param {vnode.props} [oldProps={}] 旧的属性对象
 */
function updateProperties(newVNode, oldProps = {}) {
  // 后续根据 oldProps 和 props 更新节点
  let newEl = newVNode.el;
  let newProps = newVNode.props;

  for (const oldProperty in oldProps) {
    // 如果 oldVNode 有这个属性，newVNode 没有，说明是需要被移除的属性
    if (oldProperty !== 'style' && !newProps[oldProperty]) {
      delete oldProps[oldProperty];
    }
  }
  // 如果 oldVNode 的样式在 newVNode 上不存在，说明需要移除这个样式
  let newStyleObj = newProps?.style;
  let oldStyleObj = oldProps?.style;
  // console.log(newStyleObj, oldStyleObj);
  for (const s in oldStyleObj) {
    // s 表示样式属性名
    if (!newStyleObj || !newStyleObj[s]) {
      newEl.style[s] = '';
    }
  }

  // 用新的 props 覆盖 oldVNode 的属性，更新 props
  for (const newProperty in newProps) {
    // 注意：最终只会显示 HTMLElement 的属性，自定义属性不会出现在元素上，但是仍然可以访问
    let val = newProps[newProperty];
    // 需要考虑例如 style、v-bind、v-on 等特殊情况
    if (newProperty === 'style') {
      let styleObj = val;
      for (const s in styleObj) {
        newEl.style[s] = styleObj[s];
      }
    } else {
      // 更新 props
      newEl[newProperty] = val;
    }
  }
}

/**
 * 创建真实的 DOM 节点
 * @param {vnode} vNode 虚拟 DOM 节点
 * @return {HTMLElement} 创建的真实 DOM 元素
 */
function createDOMElementFromVNode(vNode) {
  let { type, key, props, children, text } = vNode;
  if (type) {
    // 在虚拟节点上记录真实的 DOM 元素，建立关联，用于更新真实 DOM 元素
    vNode.el = document.createElement(type);
    updateProperties(vNode);
    // 创建并插入 VNode 的子节点
    for (const childNode of children) {
      render(childNode, vNode.el);
    }
  } else {
    // 文本元素
    vNode.el = text && document.createTextNode(text);
  }

  return vNode.el;
}

/**
 * diff，更新 parenEl 内的子元素，核心
 * @param {HTMLElement} parentEl 需要被更新的元素
 * @param {Array<vnode>} oldCh oldVNode.children 数组
 * @param {Array<vnode>} newCh newVNode.children 数组
 */
function updateChildren(parentEl, oldCh, newCh) {
  let oldStartIdx = 0,
    oldEndIdx = oldCh.length - 1,
    newStartIdx = 0,
    newEndIdx = newCh.length - 1;

  let oldStartVNode = oldCh[0],
    oldEndVNode = oldCh[oldEndIdx],
    newStartVNode = newCh[0],
    newEndVNode = newCh[newEndIdx];

  // 注意：针对常见的 DOM 操作进行优化，例如数组的前后插入，翻转数组

  // 依据 newCh 和 oldCh 中较短的数组进行匹配
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 向后插入（push），对比节点数组的头部，进行匹配
    if (sameVNode(oldStartVNode, newStartVNode)) {
      patch(oldStartVNode, newStartVNode);
      oldStartVNode = oldCh[++oldStartIdx];
      newStartVNode = newCh[++newStartIdx];
    } else if (sameVNode(oldEndVNode, newEndVNode)) {
      // 向前插入（unshift），对比节点数组的尾部，进行匹配
      patch(oldEndVNode, newEndVNode);
      oldEndVNode = oldCh[--oldEndIdx];
      newEndVNode = newCh[--newEndIdx];
    }
  }
  // console.log(oldStartIdx, oldEndIdx, newStartIdx, newEndIdx, parentEl);

  // 在 while 循环结束后，即比对完成后，新旧节点的首指针 > 尾指针
  // 接着需要处理两种特殊情况：添加新增节点 或删除多余节点

  /* 
    在最后一次 while 循环时，newStartIdx > newEndIdx，终止了循环
    但是 oldCh 中的节点并没有遍历完，需要删除 oldCh 中的多余节点
  */
  if (oldStartIdx <= oldEndIdx) {
    console.log('remove', parentEl);
  }
  /* 
    在最后一次 while 循环时，由于 oldStartIdx > oldEndIdx，提前终止了循环，
    但是 newCh 中的节点并没有遍历完，此时需要新增节点
    需要考虑向后插入和向前插入的情况，批量增加节点
   */
  if (newStartIdx <= newEndIdx) {
    /* 
      从后往前比对时，此时 newStartIdx 和 newEndIdx 指向的是新增的节点的位置
      newEndIdx + 1 表示 oldCh 中第一个元素的位置，lastVNode 则是 oldCh 中第一个元素
      从前往后比对，lastVNode 应该是 undefined
    */
    let lastVNode = newCh[newEndIdx + 1]?.el;
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      // 调用 Node.insertBefore 方法，向前插入则在 lastVNode 之前插入新增的节点
      // 向后插入时不存在 lastVNode，第二个参数为为空时 insertBefore 默认追加元素
      parentEl.insertBefore(createDOMElementFromVNode(newCh[i]), lastVNode);
    }
  }
}

/**
 * patchVNode 更新 VNode 属性，同时对比子节点 children 并更新
 * @param {vnode} oldVNode
 * @param {vnode} newVNode
 */
function patch(oldVNode, newVNode) {
  // 如果类型不同
  if (oldVNode.type !== newVNode.type) {
    // 利用 parentNode 来替换 DOM 元素
    oldVNode.el.parentNode.replaceChild(
      createDOMElementFromVNode(newVNode),
      oldVNode.el
    );
    return;
  } else {
    // 类型相同，且为文本节点
    // 如果不是文本的元素则 text 为 undefined
    if (oldVNode.text) {
      // 对于没有发生变化的文本节点，直接返回即可
      if (oldVNode.text === newVNode.text) return;
      // innerHTML 和 innerText 是元素的属性，对于文本节点应该使用 textContent
      oldVNode.el.textContent = newVNode.text;
      return;
    } else {
      // 类型相同，且为标签元素，
      // 先根据 newVNode 的 props 更新 oldVNOde 的 props，再对比子节点，进行 patch
      // 复用 oldVNode 的节点
      newVNode.el = oldVNode.el; // newVNode.el 是 oldVNode.el 的一个引用，所以可以通过修改 newVNode.el 来更新 oldVNode.el
      let { el } = newVNode;
      // 更新 oldVNOde 的 props
      updateProperties(newVNode, oldVNode.props);

      // 对比子节点
      let oldCh = oldVNode.children,
        newCh = newVNode.children;

      // 如果 oldCh 和 newCh 都存在且不相同时，对子节点进行 diff
      if (newCh.length > 0 && oldCh.length > 0) {
        // diff
        updateChildren(el, oldCh, newCh);
      } else if (oldCh.length > 0) {
        // 只有 oldCh，则删除原先的子节点
        el.innerHTML = '';
      } else if (newCh.length > 0) {
        // 只有 newCh，则添加子节点
        let arr = [];
        for (const childVNode of newCh) {
          // child 是 VNode 对象
          // render(child, el);
          arr.push(createDOMElementFromVNode(childVNode));
        }
        el.append(...arr);
      }
    }
  }
}

/**
 * 将虚拟 DOM 节点渲染到页面上
 * @param {vnode} vNode 节点
 * @param {HTMLElement} container 容器
 */
function render(vNode, container) {
  let el = createDOMElementFromVNode(vNode);
  container.appendChild(el);
}
