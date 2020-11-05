/**
 * 创建一个虚拟 DOM 节点
 * @param {HTMLElementTagNameMap} type
 * @param {vnode.props} props
 * @param {vnode.key} key
 * @param {Array<vnode>} children
 * @param {string} text
 */

function vNode(type, props, key, children, text = undefined) {
  return {
    type,
    props,
    key,
    children,
    text
  };
}

/**
 * 判断两个 vnode 是否相同
 * @param {*} node1
 * @param {*} node2
 * @return {*}
 */
function sameVNode(node1, node2) {
  if (node1.key && node2.key) {
    return node1.key === node2.key && node1.type === node2.type;
  } else {
    return node1.type === node2.type;
  }
}
