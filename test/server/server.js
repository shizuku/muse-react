const http = require("http");
const fs = require("fs");

http
  .createServer(function (req, res) {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    });
    fs.readFile("./data.json", function (err, data) {
      if (err) {
        return console.error(err);
      }
      res.end(JSON.stringify(JSON.parse(data.toString())));
    });
  })
  .listen(8888);
