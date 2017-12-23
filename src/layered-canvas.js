import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Layer from './layer'

export default class LayeredCanvas extends Component {
  static propTypes = {
    colors: PropTypes.array.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    height: PropTypes.number,
    width: PropTypes.number,
    lineWidth: PropTypes.number,
    onDraw: PropTypes.func
  };

  static defaultProps = {
    className: 'painter',
    style: {},
    height: 500,
    width: 500,
    lineWidth: 4,
    onDraw: () => {},
  };

  constructor(...props) {
    super(...props);
  }

  componentDidMount() {
  }

  componentWillUpdate(nextProps) {
  }

  render() {
    return (
      <div
        className="layeredCanvas"
        style={ {
          position: "relative"
        } }
      >
        { this.props.colors.map((color) => 
          <Layer
            ref="canvas"
            key={color}
            className={`className-${this.props.color}`}
            opacity={0.4}
            lineWidth={this.props.lineWidth}
            drawable={this.props.penColor === color}
            erasable={this.props.eraserColor === color}

            width={this.props.width}
            height={this.props.height}
            color={color}
            onDraw={this.props.onDraw}
          />
        )}
      </div>
    )
  }
}

export { LayeredCanvas };