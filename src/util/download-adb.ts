import stream from "node:stream";
import unzip from "unzip-stream";

const PLATFORM_TOOLS_URL =
  "https://dl.google.com/android/repository/platform-tools_r31.0.3-windows.zip";

export async function downloadAdb() {
  const response = await fetch(PLATFORM_TOOLS_URL);

  if (!response.body) {
    throw new Error("No response body.");
  }

  await stream.promises.pipeline(
    stream.Readable.from(response.body),
    unzip.Extract({ path: process.cwd() })
  );
}
