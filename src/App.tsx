import React from "react";
import "./App.css";
import Muse from "./muse/Muse";

class App extends React.Component<
  {},
  {
    errorA: any | null;
    errorB: any | null;
    isLoadedA: boolean;
    isLoadedB: boolean;
    a: string;
    b: string;
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      errorA: null,
      errorB: null,
      isLoadedA: false,
      isLoadedB: false,
      a: "",
      b: "",
    };
  }

  componentDidMount() {
    let url = "";
    if (true) {
      url = "https://cdn.jsdelivr.net/gh/shizuku/muse-react/test/data/";
    } else {
      url = "http://localhost:8888/";
    }
    fetch(url + "a.json")
      .then((res) => res.text())
      .then(
        (result) => {
          this.setState({
            isLoadedA: true,
            a: result,
          });
        },
        (error) => {
          this.setState({
            isLoadedA: true,
            errorA: error,
          });
        }
      );
    fetch(url + "b.json")
      .then((res) => res.text())
      .then(
        (result) => {
          this.setState({
            isLoadedB: true,
            b: result,
          });
        },
        (error) => {
          this.setState({
            isLoadedB: true,
            errorB: error,
          });
        }
      );
  }

  render() {
    return (
      <div className="app">
        <h2>Example A</h2>
        {this.state.isLoadedA ? (
          this.state.errorA ? (
            "error"
          ) : (
            <Muse data={this.state.a} />
          )
        ) : (
          "loading..."
        )}
        <h2>Example B</h2>
        {this.state.isLoadedB ? (
          this.state.errorB ? (
            "error"
          ) : (
            <Muse data={this.state.b} />
          )
        ) : (
          "loading..."
        )}
      </div>
    );
  }
}

export default App;
