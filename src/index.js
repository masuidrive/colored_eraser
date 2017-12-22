import React from 'react';
import ReactDOM from 'react-dom'

import ReactPaint from 'react-paint'

const props = {
  style: {
    background: 'tomato',
    /* Arbitrary css styles */
  },
  brushCol: '#ffffff',
  lineWidth: 10,
  className: 'react-paint',
  height: 500,
  width: 500,
  onDraw: () => { console.log('i have drawn!'); },
};
ReactDOM.render(
  <ReactPaint {...props} />,
  document.getElementById('app')  
)