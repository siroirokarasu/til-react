import React from "react";
import "../../index.css";
class Wannatag extends React.Component {
  componentDidMount() {
    const height = this.divElement.clientHeight;
    this.props.heightRef(height);
  }

  render() {
    const transform = this.props.translate
      ? `translate(${this.props.translate.x}px, ${this.props.translate.y}px)`
      : "";
    const style = {
      boxShadow: "0 0 1px black",
      width: `${this.props.width}px`,
      wordWrap: "break-word",
      display: "inline-block",
      transform,
      position: "absolute"
    };
    const d = new Date(this.props.postDate);
    const dateStr =
      `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ` +
      `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

    return (
      <div
        style={style}
        ref={divElement => (this.divElement = divElement)}
        className={transform ? "wannatag-animation" : ""}
      >
        <div>{dateStr}</div>
        <div>{this.props.author}</div>
        <div>{this.props.title}</div>
        <p>{this.props.body}</p>
      </div>
    );
  }
}

class GridLayoutSandbox extends React.Component {
  constructor() {
    super();
    this.state = {
      wannatags: [],
      wannatagHeights: [],
      rails: [],
      childWidth: 250
    };
  }

  async componentWillMount() {
    const res = await fetch("/wannatags/0");
    const wannatags = await res.json();
    this.setState({ wannatags, rails: this.getRails() });

    window.onresize = () => {
      this.setState({ rails: this.getRails() });
    };
  }

  getRails() {
    const cols = Math.floor(window.innerWidth / 270);
    const rails = [];
    for (let i = 0; i < cols; i++) {
      rails.push({ height: 0, itemCount: 0 });
    }
    return rails;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.wannatagHeights.length > 0 &&
      nextState.wannatagHeights.length < this.state.wannatagHeights.length
    ) {
      return false;
    }
    return true;
  }

  pushHeight(key, height) {
    this.setState(prevState => {
      const wannatagHeights = [...prevState.wannatagHeights, { height, key }];
      wannatagHeights.sort((item1, item2) => item1.key - item2.key);
      return Object.assign({}, prevState, { wannatagHeights });
    });
  }

  minIndex(rails) {
    let dst = 0;
    for (let i = 1, minHeihgt = rails[0].height; i < rails.length; i++) {
      if (minHeihgt > rails[i].height) {
        minHeihgt = rails[i].height;
        dst = i;
      }
    }
    return dst;
  }

  calculateChildTranslate(rails, i) {
    const height = this.state.wannatagHeights[i].height;
    const col = this.minIndex(rails, height);
    const mergin = 10;
    const translate = {
      x: this.state.childWidth * col + mergin * col + 10,
      y: rails[col].height + mergin * rails[col].itemCount + 10
    };
    rails[col].height += height;
    rails[col].itemCount++;
    return translate;
  }

  render() {
    const rails = this.state.rails;
    const wannatags = this.state.wannatags.map((wannatag, i) => {
      let translate = null;
      if (this.state.wannatagHeights.length === this.state.wannatags.length) {
        translate = this.calculateChildTranslate(rails, i);
      }

      return (
        <Wannatag
          key={wannatag.wannatagId}
          {...wannatag}
          heightRef={this.pushHeight.bind(this, i)}
          translate={translate}
          width={this.state.childWidth}
        />
      );
    });
    const style = {
      width: "100%"
    };
    return <div style={style}>{wannatags}</div>;
  }
}

export default GridLayoutSandbox;
