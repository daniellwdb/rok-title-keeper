import { Device, Client as AdbClient } from "adb-ts";
import path from "node:path";
import { getADBPort } from "./util/get-adb-port.js";
import type { Logger } from "pino";

const ADB_HOST = "127.0.0.1";
const PLATFORM_TOOLS_DIR = "platform-tools";

let deviceInstance: Device;

export function getDevice() {
  return deviceInstance;
}

export async function setDevice(logger: Logger) {
  const adb = new AdbClient({
    bin: path.join(process.cwd(), PLATFORM_TOOLS_DIR, "adb.exe"),
    host: ADB_HOST,
    port: 5037,
  });

  const port = await getADBPort();
  const devices = await adb.map((device) => device);

  logger.info(
    `Devices found: ${devices.map((device) => device.id).join(", ")}`
  );

  const device = devices.find((device) => device.id === `localhost:${port}`);

  if (!device) {
    throw new Error("adb could not connect to a device.");
  }

  logger.info(`Connecting to device: ${device.id}`);

  deviceInstance = device;
}
