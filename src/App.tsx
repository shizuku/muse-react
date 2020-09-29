import React from "react";
import "./App.css";
import MuseConfig from "./muse/MuseConfig";
import MuseNotation, { Notation } from "./muse/MuseNotation";
class App extends React.Component<
  {},
  {
    error: any | null;
    isLoaded: boolean;
    notation: Notation | null;
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      notation: null,
    };
  }

  componentDidMount() {
    // let url = "https://cdn.jsdelivr.net/gh/shizuku/muse-react/test/data/b.json";
    let url = "http://localhost:8888/b.json";
    fetch(url)
      .then((res) => res.text())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            notation: new Notation(JSON.parse(result), new MuseConfig()),
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
    if (this.state.notation) {
      return (
        <div className="app">
          <h1>Example</h1>
          {this.state.isLoaded ? (
            this.state.error ? (
              "error"
            ) : (
              <MuseNotation notation={this.state.notation} />
            )
          ) : (
            "loading..."
          )}
          <button
            onClick={() => {
              console.log(JSON.stringify(this.state.notation?.code()));
            }}
          >
            log
          </button>
        </div>
      );
    } else return <></>;
  }
}

export default App;
