const logger = () => {
  const defaultColor = "\x1b[0m";

  const colors = {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  };

  /**
   * @param {keyof colors} color
   * @param {*} message
   */
  const log = (color, message) => {
    console.log(colors[color], message, defaultColor);
  };

  const proxyLog = new Proxy(log, {
    apply(target, thisArg, argArray) {
      const [color, message] = argArray;
      let colorReturned = "";

      for (let i = 0; i < Object.keys(colors).length; i++) {
        if (color === Object.keys(colors)[i]) {
          colorReturned = Object.keys(colors)[i];
          break;
        }
        colorReturned = "white";
      }

      return Reflect.apply(target, thisArg, [
        colorReturned,
        message ?? "not message found",
      ]);
    },
  });

  const warn = (message) => {
    console.log(colors.yellow, message, defaultColor);
  };

  const success = (message) => {
    console.log(colors.green, message, defaultColor);
  };

  const error = (message) => {
    console.log(colors.red, message, defaultColor);
  };

  return {
    log: proxyLog,
    warn,
    success,
    error,
  };
};

export { logger };
