const supportsColor = process.stdout.isTTY;

type LogLevel = "debug" | "info" | "warn" | "error";

const COLORS = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  debug: "\x1b[36m", // Cyan
  info: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
};

const getTimestamp = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  return `[${hours}:${minutes}:${seconds}.${milliseconds}]`;
};

const innerLog = (level: LogLevel, ...messages: any[]) => {
  const timestamp = getTimestamp();

  if (supportsColor) {
    console.log(
      `${COLORS.dim}${timestamp}${COLORS.reset} ${
        COLORS[level]
      }[${level.toUpperCase()}]${COLORS.reset}`,
      ...messages
    );
  } else {
    console.log(`${timestamp} [${level.toUpperCase()}]`, ...messages);
  }
};

const debug = (...messages: any[]) => innerLog("debug", ...messages);
const info = (...messages: any[]) => innerLog("info", ...messages);
const warn = (...messages: any[]) => innerLog("warn", ...messages);
const error = (...messages: any[]) => innerLog("error", ...messages);

export const log = {
  debug,
  info,
  warn,
  error,
};
