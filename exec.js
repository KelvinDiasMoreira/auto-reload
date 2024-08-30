import { fork } from "node:child_process";
const files = ["./api/server.js", "./src/monitor.js"];
const mainPid = process.pid;

const manageProccess = () => {
  let processes = [];

  const updateListProccesses = (procces) => {
    processes.push(procces);
  };

  const countProccesses = () => {
    return processes.length;
  };

  return {
    updateListProccesses,
    countProccesses,
    processes,
  };
};

const loopProcesses = () => {
  const proccesManager = manageProccess();

  for (let i = 0; i < files.length; i++) {
    const process = fork(files[i]);
    proccesManager.updateListProccesses(process);
  }

  for (let i = 0; i < proccesManager.processes.length; i++) {
    proccesManager.processes[i].on("spawn", () => {
      console.log(
        `proccess ${i} with pid: ${proccesManager.processes[i].pid} initialized`
      );
    });
    proccesManager.processes[i].on("message", (message) => {
      if (message?.event) {
        for (let j = 0; j < proccesManager.processes.length; j++) {
          console.log(
            `killing proccess with pid: ${proccesManager.processes[j].pid}...`
          );
          proccesManager.processes[j].kill();
          proccesManager.processes.splice(i, 1);
        }
      }
    });
    proccesManager.processes[i].on("exit", (code, signal) => {
      proccesManager.processes = [];

      console.log("starting new proccess...");
      setTimeout(() => {
        loopProcesses();
      }, 500);
    });
  }
};

loopProcesses();
