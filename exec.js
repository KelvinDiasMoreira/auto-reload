import { fork, exec } from "node:child_process";

const files = ["./api/server.js", "./src/monitor.js"];
const mainPid = process.pid;
const processes = [];

for (let i = 0; i < files.length; i++) {
  const process = fork(files[i]);
  processes.push(process);
}

for (let i = 0; i < processes.length; i++) {
  processes[i].on("spawn", () => {
    console.log(`proccess ${i} with pid: ${processes[i].pid} initialized`);
  });
  processes[i].on("message", (message) => {
    // message.event that come from the ./src/monitor.js
    // is just the 'changed' event
    if (message?.event) {
      for (let j = 0; j < processes.length; j++) {
        console.log(`killing proccess with pid: ${processes[j].pid}`);
        processes[j].kill();
        exec("node", ["./exec.js"], (error, stdout, stderr) => {
          if (error) {
            process.kill(mainPid);
          }
        });
      }
    }
  });
}
