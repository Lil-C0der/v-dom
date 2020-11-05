// function renderItems(optionList) {
//   return optionList.map(({ type, props, children }) =>
//     createElement(type, props, children)
//   );
// }

let vnode = createElement(
  'div',
  {
    id: 'wrapper',
    key: 'xx',
    style: { fontWeight: 700 }
  },
  createElement('li', { key: 'a', style: { backgroundColor: '#ccc' } }, 'a'),
  createElement('li', { key: 'b', style: { backgroundColor: '#ccc' } }, 'b'),
  createElement(
    'li',
    { key: 'c', id: 'old', style: { backgroundColor: '#ccc' } },
    'c'
  ),
  createElement('li', { key: 'd', style: { backgroundColor: '#ccc' } }, 'd')
);

render(vnode, document.getElementById('app'));

let newVNode = createElement(
  'div',
  // { href: 'https://google.com' },
  {
    id: 'wrapper2',
    style: { color: '#00f' }
  },
  // 从头开始匹配
  createElement('li', { key: 'g', style: { backgroundColor: '#ccc' } }, 'g'),
  createElement(
    'li',
    { key: 'c', id: 'new', style: { backgroundColor: '#ccc' } },
    'c'
  ),
  createElement(
    'li',
    { key: 'a', id: 'a', style: { backgroundColor: '#ccc' } },
    'a'
  ),
  createElement('li', { key: 'e', style: { backgroundColor: '#ccc' } }, 'e'),
  createElement('li', { key: 'f', style: { backgroundColor: '#ccc' } }, 'f')

  // 从尾开始匹配
  // createElement('li', { key: 'b', style: { backgroundColor: '#ccc' } }, 'b'),
  // createElement(
  //   'li',
  //   { key: 'a', id: 'a', style: { backgroundColor: '#ccc' } },
  //   'a'
  // ),
  // createElement('li', { key: 'f', style: { backgroundColor: '#ccc' } }, 'f'),
  // createElement('li', { key: 'e', style: { backgroundColor: '#ccc' } }, 'e'),
  // createElement('li', { key: 'd', style: { backgroundColor: '#ccc' } }, 'd')

  // 没有 key
  // createElement('li', { style: { backgroundColor: '#ccc' } }, 'b'),
  // createElement('li', { id: 'a', style: { backgroundColor: '#ccc' } }, 'a'),
  // createElement('li', { style: { backgroundColor: '#ccc' } }, 'f'),
  // createElement('li', { style: { backgroundColor: '#ccc' } }, 'e'),
  // createElement('li', { style: { backgroundColor: '#ccc' } }, 'd')
);

// update
setTimeout(() => {
  patch(vnode, newVNode);
  console.log('change');
}, 1500);
