/**
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {*} children
 * @param {*} text
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
