import { config } from "../config.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import ini from "ini";

export async function getEmulatorInstanceName() {
  const blueStacksConfigText = await readFile(
    join("C:\\", "ProgramData", "BlueStacks_nxt", "bluestacks.conf"),
    "utf-8"
  );

  const blueStacksConfig = ini.parse(blueStacksConfigText);

  if (config.EMULATOR_INSTANCE_NAME) {
    return config.EMULATOR_INSTANCE_NAME;
  }

  const instanceName = Object.entries(blueStacksConfig)
    .find(([key]) => key.includes("display_name"))
    ?.at(1);

  return instanceName;
}
