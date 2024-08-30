import { fork } from "node:child_process";
const files = ["./api/server.js", "./src/monitor.js"];
const mainPid = process.pid;
let processes = [];

const loopProcesses = () => {
  console.log(processes.length);
  for (let i = 0; i < files.length; i++) {
    const process = fork(files[i]);
    processes.push(process);
  }

  for (let i = 0; i < processes.length; i++) {
    processes[i].on("spawn", () => {
      console.log(`proccess ${i} with pid: ${processes[i].pid} initialized`);
    });
    processes[i].on("message", (message) => {
      if (message?.event) {
        for (let j = 0; j < processes.length; j++) {
          console.log(`killing proccess with pid: ${processes[j].pid}...`);
          processes[j].kill();
          processes.splice(i, 1);
        }
      }
    });
    processes[i].on("exit", (code, signal) => {
      processes = [];
      console.log("starting new proccess...");
      setTimeout(() => {
        loopProcesses();
      }, 500);
    });
  }
};

loopProcesses();

// process.on("exit", (code) => {
//   console.log(process.argv);
//   spawn(process.argv.shift(), process.argv, {
//     cwd: process.cwd(),
//     detached: true,
//     stdio: "inherit",
//   });
// });
