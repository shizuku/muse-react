import React from "react";
import MuseConfig from "./MuseConfig";
import MuseNotation, { INotation, Notation } from "./MuseNotation";

function Muse(props: { data: string; config?: MuseConfig }) {
  let n: INotation = JSON.parse(props.data);
  let notation = new Notation(
    n,
    props.config ? props.config : new MuseConfig()
  );
  return (
    <div>
      <MuseNotation notation={notation} />
      <button
        onClick={() => {
          console.log(notation.code());
        }}
      >
        log
      </button>
    </div>
  );
}

export default Muse;
