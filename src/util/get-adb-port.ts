import { config } from "../config.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import ini from "ini";

export async function getADBPort() {
  const blueStacksConfigText = await readFile(
    join("C:\\", "ProgramData", "BlueStacks_nxt", "bluestacks.conf"),
    "utf-8"
  );

  const blueStacksConfig = ini.parse(blueStacksConfigText);

  if (config.EMULATOR_INSTANCE_NAME) {
    const displayNameKey = Object.entries(blueStacksConfig)
      .find(([, value]) => value.includes(config.EMULATOR_INSTANCE_NAME))
      ?.at(0);

    if (!displayNameKey) {
      throw new Error(
        "Emulator instance name was set, but config could not be found."
      );
    }

    const keyPrefix = displayNameKey.split(".").slice(0, -1).join(".");

    return Number(blueStacksConfig[`${keyPrefix}.status.adb_port`]);
  }

  const bluestacksAdbPort = blueStacksConfigText
    .split("\n")
    .find(
      (key) => key.startsWith("bst.instance") && key.includes("status.adb_port")
    )
    ?.split("=")
    .at(1)
    ?.replaceAll('"', "");

  return Number(bluestacksAdbPort);
}
