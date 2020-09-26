import React from "react";
import "./App.css";
import Muse from "./muse/Muse";

class App extends React.Component<
  {},
  {
    error: any | null;
    isLoaded: boolean;
    data: string;
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: "",
    };
  }

  componentDidMount() {
    let url = "https://cdn.jsdelivr.net/gh/shizuku/muse-react/test/data/b.json";
    // let url = "http://localhost:8888/b.json";
    fetch(url)
      .then((res) => res.text())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            data: result,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: error,
          });
        }
      );
  }

  render() {
    return (
      <div className="app">
        <h1>Example</h1>
        {this.state.isLoaded ? (
          this.state.error ? (
            "error"
          ) : (
            <Muse data={this.state.data} />
          )
        ) : (
          "loading..."
        )}
      </div>
    );
  }
}

export default App;
