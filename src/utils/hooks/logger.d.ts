type logger = {
  info: (msg: string) => void;
  err: (msg: string) => void;
  warn: (msg: string) => void;
};

/**
 * returns a logger object that can be used to log to the console using
 * different severity levels
 */
export const useLogger: (name: string) => logger;
