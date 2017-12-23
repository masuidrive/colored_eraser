import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class ReactPaint extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object.isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    brushCol: PropTypes.string,
    lineWidth: PropTypes.number,
    onDraw: PropTypes.func
  };

  static defaultProps = {
    className: 'react-paint',
    style: {},
    height: 500,
    width: 500,
    brushCol: 'red',
    lineWidth: 4,
    onDraw: () => {},
  };

  constructor(...props) {
    super(...props);

    this.state = {
      mouseDown: false,
      mouseLoc: [0, 0],
      drawable: true
    };
  }

  componentDidMount() {
    const { brushCol, lineWidth } = this.props;

    var canvas = ReactDOM.findDOMNode(this.refs.canvas)
    var context = canvas.getContext('2d');
    context.lineWidth = lineWidth;
    context.strokeStyle = brushCol;
    context.lineJoin = context.lineCap = 'round';
//    context.scale(0.5, 0.5)

    this.setState({
      canvas: canvas,
      context: context,
      bb: canvas.getBoundingClientRect()
    })
  }

  componentWillUpdate(nextProps) {
    const { brushCol, lineWidth } = this.props;

    if (
      brushCol !== nextProps.brushCol ||
      lineWidth !== nextProps.lineWidth
    ) {
      this.state.context.lineWidth = nextProps.lineWidth;
      this.state.context.strokeStyle = nextProps.brushCol;
    }
  }

  setDrawable(flg) {
    this.setState({drawable: flg});
  }

  mouseDown = e => {
    if(!this.state.drawable) return 
    if(!this.state.mouseDown) this.setState({ mouseDown: true });

    this.setState({
      mouseLoc: [e.pageX || e.touches[0].pageX, e.pageY || e.touches[0].pageY],
    });

    this.state.context.moveTo(
      (e.pageX || e.touches[0].pageX) - this.state.bb.left,
      (e.pageY || e.touches[0].pageY) - this.state.bb.top
    );
  }

  mouseUp = () => (this.setState({ mouseDown: false }));

  mouseMove = e => {
    if(!this.state.drawable) return 
    if (this.state.mouseDown) {
      // prevent iOS scroll when drawing
      if (e.touches) e.preventDefault();

      if (
        (e.pageX || e.touches[0].pageX) > 0 &&
        (e.pageY || e.touches[0].pageY) < this.props.height
      ) {
        console.log("c",this,this.state.context)
        this.state.context.lineTo(
          ((e.pageX || e.touches[0].pageX) - this.state.bb.left),
          ((e.pageY || e.touches[0].pageY) - this.state.bb.top)
        );

        this.state.context.stroke();
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
      <div className={className}>
        <div>
          <button onClick={e => this.pen('#333333')}>Black pen</button>
          <button onClick={e => this.pen('#ff3333')}>Red pen</button>
          / 
          <button onClick={e => this.eraser('#333333')}>Black eraser</button>
          <button onClick={e => this.eraser('#ff3333')}>Red eraser</button>
        </div>

        <canvas
          ref="canvas"
          className={`${className}__canvas`}

          width={width}
          height={height}

          onClick={onDraw}

          style={
            Object.assign({}, style, {
              opacity: 0.5,
              width: this.props.width,
              height: this.props.height,
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
      </div>
    );
  }
}


export { ReactPaint };