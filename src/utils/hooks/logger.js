export const useLogger = (name) => {
  const _printLog = (lvl, msg) => {
    if (process.env.NODE_ENV === "production") {
      // implement this for minimal logging durring prod
    }
    const color = _color(lvl);
    const style = `color: ${color}`;
    // get date
    const date = _when();

    console.log(`${date}, ${name} %c[${lvl}]`, style, ` : ${msg}`);
    // fs.appendFileSync("logs.txt", `\n${date}, ${this.loc} [${lvl}] : ${msg}`);
  };

  const info = (msg) => {
    _printLog("INFO", msg);
  };

  const warn = (msg) => {
    _printLog("WARN", msg);
  };

  const err = (msg) => {
    _printLog("ERROR", msg);
  };

  const logger = {
    info,
    err,
    warn,
  };

  const _color = (lvl) => {
    let color = "black";
    switch (lvl) {
      case "INFO":
        color = "#3cde46";
        break;
      case "ERROR":
        color = "#d92e2e";
        break;
      case "WARN":
        color = "#edb940";
        break;
      default:
        color = "black";
    }
    return color;
  };

  const _when = () => {
    const date = new Date();

    let m = date.getMonth();
    if (m < 10) {
      m = `0${m}`;
    }

    let d = date.getDate();
    if (d < 10) {
      d = `0${d}`;
    }

    const y = date.getFullYear();
    const time = date.toLocaleTimeString();
    // date string
    return `${y}-${m}-${d} ${time}`;
  };

  return logger;
};
