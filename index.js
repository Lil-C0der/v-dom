let vnode = createElement(
  'div',
  {
    id: 'wrapper',
    a: 1,
    key: 'xx',
    style: { fontWeight: 700 }
  },
  createElement('span', { style: { color: 'red' } }, 'hello '),
  'world'
);

render(vnode, document.getElementById('app'));

let newVNode = createElement(
  'div',
  // { href: 'https://google.com' },
  {
    id: 'wrapper2',
    style: { color: '#00f' }
  },
  'hello world'
);
setTimeout(() => {
  patch(vnode, newVNode);
  console.log('change');
}, 2000);
