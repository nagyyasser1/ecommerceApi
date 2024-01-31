import { v4 as uuid } from "uuid";
import { existsSync } from "fs";
import { promises as fsPromises } from "fs";
import { join } from "path";

function formatDateTimeToYYYYMMDDHHMMSS(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return "Invalid date";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

const logEvents = async (message, logFileName) => {
  const dateTime = formatDateTimeToYYYYMMDDHHMMSS(new Date());
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!existsSync(join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};

export  { logEvents, logger };
