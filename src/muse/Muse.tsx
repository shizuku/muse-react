import React from "react";
import MuseConfig from "./MuseConfig";
import MuseNotation, { Notation } from "./MuseNotation";
import Selector from "./Selector";

function init(data: string, config: MuseConfig): Notation {
  let hm = config.pageMarginHorizontal;
  let vm = config.pageMarginVertical;
  let w = config.notationWidth - hm * 2;
  let h = config.notationWidth * config.pageE - vm * 2;
  let notation = new Notation(data, config);
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
    if (pageIdx === 0) {
      let x = 0;
      x += config.infoTitleFontSize + config.infoGap;
      x += config.infoSubtitleFontSize + config.infoGap;
      x += notation.author.length * (config.infoFontSize + config.infoGap);
      page.dimens.marginTop += x;
      page.dimens.height -= x;
      page.dimens.y += x;
    }
    page.index = pageIdx + 1;
    notationH +=
      page.dimens.marginTop + page.dimens.marginBottom + page.dimens.height;
    let linesHeight: number[] = [];
    let lineYSpace = page.dimens.height;
    page.lines.forEach((line) => {
      line.dimens.width = page.dimens.width;
      line.dimens.x = page.dimens.marginLeft;
      let lineHeight = 0;
      let trackY = 0;
      let barsW: number[] = [];
      line.tracks.forEach((track) => {
        track.bars.forEach((bar, barIdx) => {
          if (barsW[barIdx] !== undefined) {
            barsW[barIdx] =
              barsW[barIdx] > bar.unitNum ? barsW[barIdx] : bar.unitNum;
          } else {
            barsW.push(bar.unitNum);
          }
        });
      });
      let barUnitSum = barsW.reduce((s, it) => s + it);
      line.tracks.forEach((track) => {
        let trackHeight = 0;
        track.dimens.y = trackY;
        track.dimens.width = line.dimens.width;
        let maxNoteHeight = 0; //最大note.y
        let maxNoteMarginBottom = 0;
        let barX = 0;
        track.bars.forEach((bar, barIdx) => {
          bar.unitNum = barsW[barIdx];
          bar.dimens.width = (barsW[barIdx] / barUnitSum) * track.dimens.width;
          bar.dimens.x = barX;
          barX += bar.dimens.width;
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
            notesWidth.push(noteWidth);
          });
          let x = 0;
          bar.notes.forEach((note, idx) => {
            x += (bar.notesX[idx] / (bar.unitNum + 1)) * bar.dimens.width;
            note.dimens.x = x - config.noteWidth / 2 - note.dx;
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

function Muse(props: { data: string; config?: MuseConfig }) {
  let notation = init(
    props.data,
    props.config ? props.config : new MuseConfig()
  );
  return <MuseNotation notation={notation} selector={new Selector(notation)} />;
}

export default Muse;
