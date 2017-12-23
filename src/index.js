import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import LayeredCanvas from './layered-canvas'


export default class App extends Component {
  constructor(...props) {
    super(...props);
    this.state = {
      penColor: 'red'
    }
  }

  componentDidMount() {
  }

  componentWillUpdate(nextProps) {
  }

  render() {
    const colors = ['red', 'blue', 'green']
    return (
      <div>
        <div>
          { colors.map((color) => 
            <button key={color} onClick={()=>this.setState({penColor: color, eraserColor: undefined, lineWidth: 4})}>Pen: {color}</button>
          ) }
          /
          { colors.map((color) => 
            <button key={color} onClick={()=>this.setState({penColor: undefined, eraserColor: color, lineWidth: 12})}>Eraser: {color}</button>
          ) }
        </div>
        <LayeredCanvas
          colors={colors}
          className='painter'
          height={500}
          width={500}
          onDraw={(layer)=>console.log('layer', layer)}
          lineWidth={this.state.lineWidth}
          penColor={this.state.penColor}
          eraserColor={this.state.eraserColor}
        />
      </div>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('app')  
)