let vnode = createElement(
  'div',
  {
    id: 'wrapper',
    key: 'xx',
    style: { fontWeight: 700 }
  },
  // createElement('span', { style: { color: 'red' } }, 'hello '),
  // 'world'

  createElement('li', { key: '1', style: { backgroundColor: '#ccc' } }, 'a'),
  createElement('li', { key: '2', style: { backgroundColor: '#ccc' } }, 'b'),
  createElement('li', { key: '3', style: { backgroundColor: '#ccc' } }, 'c'),
  createElement('li', { key: '4', style: { backgroundColor: '#ccc' } }, 'd')
);

render(vnode, document.getElementById('app'));

let newVNode = createElement(
  'div',
  // { href: 'https://google.com' },
  {
    id: 'wrapper2',
    style: { color: '#00f' }
  },
  // 'hello world'
  // createElement('li', { key: '5', style: { backgroundColor: '#ccc' } }, 'f'),
  // createElement('li', { key: '5', style: { backgroundColor: '#ccc' } }, 'e'),
  createElement(
    'li',
    { key: '1', id: 'item', style: { backgroundColor: '#ccc' } },
    'a'
  ),
  createElement('li', { key: '2', style: { backgroundColor: '#ccc' } }, 'b'),
  createElement('li', { key: '3', style: { backgroundColor: '#ccc' } }, 'c'),
  createElement('li', { key: '4', style: { backgroundColor: '#ccc' } }, 'd'),
  createElement('li', { key: '5', style: { backgroundColor: '#ccc' } }, 'e')
  // createElement('li', { key: '6', style: { backgroundColor: '#ccc' } }, 'f')
);
setTimeout(() => {
  patch(vnode, newVNode);
  console.log('change');
}, 2000);
