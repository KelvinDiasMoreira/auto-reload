import { fork } from "node:child_process";
import { manageProccess } from "./manageProccess.js";
import { logger } from "./logger.js";
const files = ["./api/server.js", "./src/monitor.js"];

const loopProcesses = () => {
  const proccesManager = manageProccess();
  const loggerr = logger();

  for (let i = 0; i < files.length; i++) {
    const process = fork(files[i]);
    proccesManager.addProccesToArray(process);
  }

  for (let i = 0; i < proccesManager.processes.length; i++) {
    proccesManager.processes[i].on("spawn", () => {
      loggerr.log(
        "green",
        `proccess ${i} with pid: ${proccesManager.processes[i].pid} initialized`
      );
    });
    proccesManager.processes[i].on("message", (message) => {
      if (message && message?.event === "change") {
        for (let j = 0; j < proccesManager.processes.length; j++) {
          if (
            !proccesManager.findProccessByPid(proccesManager.processes[j].pid)
          )
            continue;

          proccesManager.processes[j].kill();
          proccesManager.removeProccesFromArray(
            proccesManager.processes[j].pid
          );
          console.log(
            `proccess with pid: ${proccesManager.processes[j].pid} terminated`
          );
          // logger.log
        }
      }
    });
    proccesManager.processes[i].on("exit", (code, signal) => {
      if (i === proccesManager.processes.length - 1) {
        setTimeout(() => {
          loopProcesses();
        }, 500);
      }
    });
  }
};

loopProcesses();
