import React from "react";
import Observer from "react-intersection-observer";

const width = "250px";
const style = {
  boxShadow: "0 0 1px black",
  flexBasis: width,
  maxWdith: width,
  width, // https://qiita.com/taka_mura3/items/2e9719165eab1ea6bfbe
  alignItems: "flex-start",
  wordWrap: "break-word",
  margin: "10px"
};

class Wannatag extends React.Component {
  constructor(props) {
    super();
    this.state = {
      onEnterWindow: props.onEnterWindow
    };
  }

  onEnter(inView) {
    if (!inView) return;
    this.props.onEnterWindow(this.props.postDate);
    this.setState({ onEnterWindow: false });
  }

  render() {
    const d = new Date(this.props.postDate);
    const dateStr =
      `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDay()} ` +
      `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    const elem = (
      <div style={style}>
        <div>{dateStr}</div>
        <div>{this.props.username}</div>
        <div>{this.props.title}</div>
        <p>{this.props.body}</p>
        {this.props.isOwner ? <button>delete</button> : null}
      </div>
    );
    if (this.state.onEnterWindow) {
      return (
        <Observer onChange={inView => this.onEnter(inView)} triggerOnce={true}>
          {elem}
        </Observer>
      );
    }
    return elem;
  }
}

export default Wannatag;
