import { observer } from "mobx-react";
import React from "react";
import MuseNotation, { Notation } from "./MuseNotation";

@observer
class Muse extends React.Component<{ notation: Notation }> {
  render() {
    return (
      <div>
        <MuseNotation notation={this.props.notation} />
        <button
          onClick={() => {
            console.log(this.props.notation.code());
          }}
        >
          log
        </button>
      </div>
    );
  }
}

export default Muse;
