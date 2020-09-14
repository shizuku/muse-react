const fs = require("fs");

fs.readFile("./data/a.json", "utf-8", (err, data) => {
  let o = JSON.parse(data);
  o.pages.forEach((page) => {
    page.lines.forEach((line) => {
      line.tracks.forEach((track) => {
        track.bars.forEach((bar) => {
          bar.notes.forEach((note) => {
            note.n = note.n + "@" + note.l + "|" + note.p;
            note.l = undefined;
            note.p = undefined;
          });
        });
      });
    });
  });
  fs.writeFile("./data/a.json", JSON.stringify(o),()=>{});
});
