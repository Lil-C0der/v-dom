/**
 * 递归生成虚拟 DOM 节点
 * @param {*} type 类型
 * @param {*} props 节点属性
 * @param {*} children 子节点
 */
function createElement(type, props = {}, ...children) {
  let key;
  if (props.key) {
    key = props.key;
    delete props.key;
  }
  children = children.map((child) => {
    if (typeof child === 'string') {
      return vNode(undefined, undefined, undefined, undefined, child);
    } else {
      return child;
    }
  });

  return vNode(type, props, key, children);
}
