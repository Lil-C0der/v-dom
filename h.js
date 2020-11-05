/**
 * 递归生成虚拟 DOM 节点
 * @param {HTMLElementTagNameMap} type 类型
 * @param {vnode.props} props 节点属性
 * @param {Array<vnode>} children 子节点
 */
function createElement(type, props = {}, ...children) {
  let key;
  if (props.key) {
    key = props.key;
    delete props.key;
  }
  children = children.map((child) => {
    if (typeof child === 'string') {
      // 针对文本子元素，包一层
      return vNode(undefined, undefined, undefined, undefined, child);
    } else {
      return child;
    }
  });

  return vNode(type, props, key, children);
}
