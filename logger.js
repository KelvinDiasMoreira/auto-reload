const logger = () => {
  const defaultColor = "\x1b[0m";

  const colors = {
    black: "\x1b[30m", //Black
    red: "\x1b[31m", //Red
    green: "\x1b[32m", //Green
    yellow: "\x1b[33m", //Yellow
    blue: "\x1b[34m", //Blue
    magenta: "\x1b[35m", //Magenta
    cyan: "\x1b[36m", //Cyan
    white: "\x1b[37m", //White
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
      return Reflect.apply(target, thisArg, [
        colors[color] ?? "white",
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
