import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class Layer extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object.isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    color: PropTypes.string,
    lineWidth: PropTypes.number,
    drawable: PropTypes.bool,
    erasable: PropTypes.bool,
    onDraw: PropTypes.func
  };

  static defaultProps = {
    className: 'layer',
    style: {},
    height: 500,
    width: 500,
    color: 'red',
    lineWidth: 4,
    opacity: 1.0,
    drawable: true,
    onDraw: () => {},
  };

  constructor(...props) {
    super(...props);

    this.state = {
      mouseDown: false,
      mouseLoc: [0, 0]
    };
  }

  canvasInfo() {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas)
    return({
      canvas: canvas,
      context2d: canvas.getContext('2d'),
      bb: canvas.getBoundingClientRect()
    })
  }

  mousePosition(e) {
    return({
      mouseX: e.clientX || e.touches[0].clientX,
      mouseY: e.clientY || e.touches[0].clientY
    })
  }

  componentDidMount() {
    const { color, lineWidth } = this.props
    const { canvas, context2d, bb } = this.canvasInfo()
    context2d.lineWidth = lineWidth;
    context2d.strokeStyle = color;
    context2d.lineJoin = context2d.lineCap = 'round';
  }

  componentWillUpdate(nextProps) {
    const { color, lineWidth, drawable, erasable } = this.props;
    const { canvas, context2d, bb } = this.canvasInfo()

    if (
      color !== nextProps.color ||
      lineWidth !== nextProps.lineWidth ||
      drawable !== nextProps.drawable ||
      erasable !== nextProps.erasable
    ) {
      context2d.strokeStyle = nextProps.color;
      if(nextProps.erasable) {
        context2d.globalCompositeOperation="destination-out";
        context2d.lineWidth = nextProps.lineWidth
      }
      else {
        context2d.globalCompositeOperation="source-over";
        context2d.lineWidth = nextProps.lineWidth
      }
      this.setState({ mouseDown: false })
    }
  }

  mouseDown = e => {
    if(!this.state.mouseDown) this.setState({ mouseDown: true });
    const { canvas, context2d, bb } = this.canvasInfo()
    const { mouseX, mouseY } = this.mousePosition(e)

    this.setState({
      mouseLoc: [mouseX, mouseY],
    });

    context2d.beginPath();
    context2d.moveTo(
      mouseX - bb.left,
      mouseY - bb.top
    );
  }

  mouseUp = () => {
    const { canvas, context2d, bb } = this.canvasInfo()
    this.setState({ mouseDown: false })
    if (this.state.mouseDown) {
      context2d.closePath();
      this.props.onDraw(this)
    }
  }

  mouseMove = e => {
    if (this.state.mouseDown) {
      const { canvas, context2d, bb } = this.canvasInfo()
      const { mouseX, mouseY } = this.mousePosition(e)

      // prevent iOS scroll when drawing
      if (e.touches) e.preventDefault();

      if (
        mouseX > 0 &&
        mouseY < this.props.height
      ) {
        context2d.lineTo(
          (mouseX - bb.left),
          (mouseY - bb.top)
        );
        context2d.stroke()
      }
    }
  }

  render() {
    const {
      width,
      height,
      onDraw,
      style,
      className,
    } = this.props;

    return (
      <canvas
        ref="canvas"
        className={className}

        width={width}
        height={height}

        style={
          Object.assign({}, style, {
            opacity: this.props.opacity,
            width: this.props.width,
            height: this.props.height,
            backgroundColor: 'transparent',
            border: `1px solid ${this.props.color}`,

            pointerEvents: ((this.props.drawable || this.props.erasable) ? 'auto' : 'none'),
            position: "absolute",
            left: 0,
            top: 0
          })
        }

        onMouseDown={this.mouseDown}
        onTouchStart={this.mouseDown}

        onMouseUp={this.mouseUp}
        onTouchEnd={this.mouseUp}

        onMouseLeave={this.mouseUp}
        onTouchCancel={this.mouseUp}

        onMouseMove={this.mouseMove}
        onTouchMove={this.mouseMove}
      />
    )
  }
}

export { Layer };