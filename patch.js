/**
 * 根据虚拟 DOM 节点的属性更新真实的 DOM 节点
 * @param {*} newVNode 新的 VNode 节点
 * @param {*} [oldProps={}] 旧的属性对象
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
 * @param {*} vNode 虚拟 DOM 节点
 * @return {*} 创建的真实 DOM 元素
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
    // 文本
    vNode.el = text && document.createTextNode(text);
  }

  return vNode.el;
}

/**
 *
 *
 * @param {*} oldVNode
 * @param {*} newVNode
 */
function patch(oldVNode, newVNode) {
  console.log(oldVNode, newVNode);

  // 如果类型不同
  if (oldVNode.type !== newVNode.type) {
    // 利用 parentNode 来替换 DOM 元素
    oldVNode.el.parentNode.replaceChild(
      createDOMElementFromVNode(newVNode),
      oldVNode.el
    );
    return;
  } else {
    // 类型相同，文本节点，如果不是文本的元素则 text 都为 undefined
    if (oldVNode.text) {
      console.log('in');
      oldVNode.el.textContent = newVNode.text;
      return;
    }
    // 类型相同，且为标签元素，则根据 newVNode 的 props 更新 oldVNOde 的 props
    newVNode.el = oldVNode.el;
    console.log(oldVNode.props);
    updateProperties(newVNode, oldVNode.props);
    oldVNode.el.parentNode.replaceChild(newVNode.el, oldVNode.el);

    // let oldCh = oldVNode.children,newCh = newVNode.children
    // let oldStartIdx = 0,
    //   oldEndIdx = oldCh.length - 1,
    //   newStartIdx = 0,
    //   newEndIdx = newCh.length - 1;

    // while (oldStartIdx<oldEndIdx||newStartIdx<newEndIdx) {
    //   // oldStartIdx++;
    //   // newStartIdx++;
    //   patch(oldCh[oldStartIdx],newCh[newStartIdx])
    // }
  }
  // 类型相同，
  // for (let i = 0; i < oldVNode.children.length; i++) {
  //   patch(oldVNode.children[i], newVNode.children[i]);
  // }
}

/**
 * 将虚拟 DOM 节点渲染到页面上
 * @param {*} vNode 节点
 * @param {*} container 容器
 */
function render(vNode, container) {
  let el = createDOMElementFromVNode(vNode);
  container.appendChild(el);
}
