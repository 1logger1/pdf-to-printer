import execFileAsync from "../utils/exec-file-async";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import { Printer } from "..";

/**
 * Gets the default printer information
 *
 * @returns Promise that resolves to the default printer object, or null if no default printer is set
 * @throws {Error} If the operating system is not supported or if the command fails
 *
 * @example
 * ```typescript
 * const defaultPrinter = await getDefaultPrinter();
 * if (defaultPrinter) {
 *   console.log(`Default printer: ${defaultPrinter.name}`);
 *   console.log(`Device ID: ${defaultPrinter.deviceId}`);
 *   console.log(`Paper sizes: ${defaultPrinter.paperSizes.join(", ")}`);
 * } else {
 *   console.log("No default printer set");
 * }
 * ```
 */
async function getDefaultPrinter(): Promise<Printer | null> {
  try {
    throwIfUnsupportedOperatingSystem();

    const { stdout } = await execFileAsync("Powershell.exe", [
      "-Command",
      `Get-CimInstance Win32_Printer -Property DeviceID,Name,PrinterPaperNames -Filter Default=true | Select-Object DeviceID,Name,PrinterPaperNames | ConvertTo-Json -Compress`,
    ]);

    if (!stdout || !stdout.trim()) return null;
    const items = JSON.parse(stdout);
    if (!items || items.length === 0) return null;

    const item = items[0];
    if (!item.DeviceID || !item.Name) return null;

    return {
      deviceId: item.DeviceID,
      name: item.Name,
      paperSizes: item.PrinterPaperNames || [],
    };
  } catch (error) {
    throw error;
  }
}

export default getDefaultPrinter;
