import { watch } from "fs";

const files = ["./api/server.js", "./src/main.js"];

for (let i = 0; i < files.length; i++) {
  watch(files[i], (ev, filename) => {
    ev == "change" &&
      process.send({ fromPid: process.pid, event: ev, fileChanged: filename });
  });
}
