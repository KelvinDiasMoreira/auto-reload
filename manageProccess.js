const manageProccess = () => {
  /**
   * @type {Array<ChildProcess>}
   */
  let processes = [];

  /**
   *
   * @param {ChildProcess} procces
   */
  const addProccesToArray = (procces) => {
    processes.push(procces);
  };

  /**
   *
   * @param {number} pid
   */
  const removeProccesFromArray = (pid) => {
    processes = processes.filter((proc) => proc.pid !== pid);
  };

  const findProccessByPid = (pid) => {
    return processes.find((proc) => proc.pid === pid) ?? false;
  };

  /**
   *
   * @returns {number}
   */
  const countProccess = () => {
    return processes.length;
  };

  return {
    removeProccesFromArray,
    addProccesToArray,
    findProccessByPid,
    countProccess,
    processes,
  };
};

export { manageProccess };
