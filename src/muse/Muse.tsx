import React from "react";
import config from "./config";
import MuseNotation, { Notation } from "./MuseNotation";

function init(data: string): Notation {
  let hm = 100;
  let vm = 100;
  let w = 800;
  let h = 1000;
  let notation = new Notation(data);
  let notationH = 0;
  notation.pages.forEach((page, pageIdx) => {
    page.dimens.x = hm;
    page.dimens.y = vm * (pageIdx + 1) + (vm + h) * pageIdx;
    page.dimens.width = w;
    page.dimens.marginLeft = hm;
    page.dimens.marginRight = hm;
    page.dimens.height = h;
    page.dimens.marginTop = vm;
    page.dimens.marginBottom = vm;
    notationH +=
      page.dimens.marginTop + page.dimens.marginBottom + page.dimens.height;
    let linesHeight: number[] = [];
    let lineYSpace = page.dimens.height;
    page.lines.forEach((line) => {
      line.dimens.width = page.dimens.width;
      line.dimens.x = page.dimens.marginLeft;
      let lineHeight = 0;
      let trackY = 0;
      line.tracks.forEach((track) => {
        let trackHeight = 0;
        track.dimens.y = trackY;
        track.dimens.width = line.dimens.width;
        let barUnit = track.dimens.width / track.bars.length;
        let maxNoteHeight = 0; //最大note.y
        let maxNoteMarginBottom = 0;
        track.bars.forEach((bar, barIdx) => {
          bar.dimens.width = barUnit;
          bar.dimens.x = barUnit * barIdx;
          let trackXSpace = barUnit; //横向空余空间，用于确定note.x
          let notesWidth: number[] = [];
          bar.notes.forEach((note) => {
            note.settle();
            let noteWidth = note.dimens.width;
            let noteHeight = note.dimens.height;
            let noteMarginBootom = note.dimens.marginBottom;
            maxNoteHeight =
              maxNoteHeight > noteHeight ? maxNoteHeight : noteHeight;
            maxNoteMarginBottom =
              maxNoteMarginBottom > noteMarginBootom
                ? maxNoteMarginBottom
                : noteMarginBootom;
            trackXSpace -= noteWidth;
            notesWidth.push(noteWidth);
          });
          let trackXUnit = trackXSpace / (bar.notes.length + 1);
          bar.notes.forEach((note, idx) => {
            let px = trackXUnit;
            for (let i = 0; i < idx; ++i) {
              px += notesWidth[i] + trackXUnit;
            }
            note.dimens.x = px;
          });
        });
        track.dimens.height = maxNoteHeight + maxNoteMarginBottom;
        track.bars.forEach((bar) => {
          bar.dimens.height = track.dimens.height;
          bar.notes.forEach((note) => {
            note.dimens.height = maxNoteHeight;
            note.dimens.marginBottom = maxNoteMarginBottom;
          });
        });
        trackHeight = maxNoteHeight + maxNoteMarginBottom;
        lineHeight += trackHeight + config.trackGap;
        trackY += trackHeight + config.trackGap;
      });
      lineHeight -= config.trackGap;
      line.dimens.height = lineHeight;
      lineYSpace -= lineHeight;
      linesHeight.push(lineHeight);
    });
    let lineYUnit = lineYSpace / (page.lines.length - 1);
    page.lines.forEach((line, idx) => {
      let py = page.dimens.marginTop;
      for (let i = 0; i < idx; ++i) {
        py += lineYUnit + linesHeight[i];
      }
      line.dimens.y = py;
    });
  });
  notation.dimens.width = w + 2 * hm;
  notation.dimens.height = notationH;
  return notation;
}

function Muse(props: { data: string; width?: number }) {
  return <MuseNotation notation={init(props.data)} />;
}

export default Muse;
