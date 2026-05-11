import execFileAsync from "../utils/exec-file-async";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import { Printer } from "..";

/**
 * Gets a list of all available printers on the system
 *
 * @returns Promise that resolves to an array of printer objects
 * @throws {Error} If the operating system is not supported or if the command fails
 *
 * @example
 * ```typescript
 * const printers = await getPrinters();
 * console.log(printers);
 * // [
 * //   { deviceId: "HP_LaserJet", name: "HP LaserJet Pro", paperSizes: ["A4", "Letter"] },
 * //   { deviceId: "Canon_Pixma", name: "Canon PIXMA", paperSizes: ["A4", "A3"] }
 * // ]
 * ```
 */
async function getPrinters(): Promise<Printer[]> {
  function stdoutHandler(stdout: string): Printer[] {
    if (!stdout) return [];
    const items = JSON.parse(stdout);
    return items
      .filter((item: any) => item.DeviceID && item.Name)
      .map((item: any) => ({
        deviceId: item.DeviceID,
        name: item.Name,
        paperSizes: item.PrinterPaperNames || [],
      }));
  }

  try {
    throwIfUnsupportedOperatingSystem();
    const { stdout } = await execFileAsync("Powershell.exe", [
      "-Command",
      `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Get-CimInstance Win32_Printer -Property DeviceID,Name,PrinterPaperNames | Select-Object DeviceID,Name,PrinterPaperNames | ConvertTo-Json -Compress`,
    ]);
    return stdoutHandler(stdout);
  } catch (error) {
    throw error;
  }
}

export default getPrinters;
