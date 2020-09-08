import React from "react";
import "./App.css";
import Muse from "./muse/Muse";

class App extends React.Component<
  {},
  { error: any | null; isLoaded: boolean; data: string }
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
    fetch("http://localhost:8888/a")
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
            error,
          });
        }
      );
  }

  render() {
    if (this.state.error) {
      return <div>error</div>;
    } else if (!this.state.isLoaded) {
      return <div>loading...</div>;
    } else {
      return (
        <div className="app">
          <Muse data={this.state.data} />
        </div>
      );
    }
  }
}

export default App;
