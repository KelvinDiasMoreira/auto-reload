import { createServer } from "http";
import { readFile } from "fs";

const hostName = "127.0.0.1";
const port = 3000;

const server = createServer((req, res) => {
  if (req.url === "/") {
    readFile("./index.html", (err, content) => {
      if (err) {
        setNotFoundStatusCode(res);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    });
  } else if (req.url === "/src/main.js") {
    readFile("./src/main.js", (err, content) => {
      if (err) {
        setNotFoundStatusCode(res);
      } else {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(content);
      }
    });
  } else {
    setNotFoundStatusCode(res);
  }
});

server.listen(port, hostName, () => {
  console.log(`server listen in http://${hostName}:${port}/`);
});

const setNotFoundStatusCode = (res) => {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found\n");
};
