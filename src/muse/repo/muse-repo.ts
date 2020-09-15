import { observable } from "mobx";
import { MobXProviderContext } from "mobx-react";
import React from "react";
import { Notation } from "../MuseNotation";

export class MuseRepo {
  @observable
  notation: Notation;

  constructor(notation: Notation) {
    this.notation = notation;
  }
}

export function useMuseRepo(): MuseRepo {
  return React.useContext(MobXProviderContext).museRepo;
}
