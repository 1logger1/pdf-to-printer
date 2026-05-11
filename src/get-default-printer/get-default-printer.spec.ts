import { mocked } from "jest-mock";
import getDefaultPrinter from "./get-default-printer";
import execAsync from "../utils/exec-file-async";
import { Printer } from "..";

jest.mock("../utils/throw-if-unsupported-os");
jest.mock("../utils/exec-file-async");
const mockedExecAsync = mocked(execAsync);

const mockDefaultPrinterData = [
  {
    DeviceID: "Microsoft Print to PDF",
    Name: "Microsoft Print to PDF",
    PrinterPaperNames: [],
  },
];
const mockDefaultPrinterStdout = JSON.stringify(mockDefaultPrinterData);

it("gets the default printer", async () => {
  mockedExecAsync.mockResolvedValue({
    stdout: mockDefaultPrinterStdout,
    stderr: "",
  });

  const result: Printer | null = await getDefaultPrinter();

  expect(result).toStrictEqual({
    deviceId: "Microsoft Print to PDF",
    name: "Microsoft Print to PDF",
    paperSizes: [],
  });
});

it("returns null when default printer is not defined", async () => {
  mockedExecAsync.mockResolvedValue({ stdout: "", stderr: "" });

  const result = await getDefaultPrinter();

  expect(result).toStrictEqual(null);
});

it("when did not find any printer info", async () => {
  const stdout = JSON.stringify([
    { DeviceID: "", Name: "", PrinterPaperNames: [] },
  ]);
  mockedExecAsync.mockResolvedValue({ stdout, stderr: "" });

  const result = await getDefaultPrinter();

  return expect(result).toBe(null);
});

it("throws when execAsync fails", () => {
  mockedExecAsync.mockRejectedValue("error");
  return expect(getDefaultPrinter()).rejects.toBe("error");
});

it("gets the default printer with custom and repeated properties", async () => {
  const stdout = JSON.stringify([
    {
      DeviceID: "Microsoft Print to PDF",
      Name: "Microsoft Print to PDF",
      PrinterPaperNames: ["A4", "144mm x 100mm"],
    },
  ]);

  mockedExecAsync.mockResolvedValue({
    stdout,
    stderr: "",
  });

  const result: Printer | null = await getDefaultPrinter();

  expect(result).toStrictEqual({
    deviceId: "Microsoft Print to PDF",
    name: "Microsoft Print to PDF",
    paperSizes: ["A4", "144mm x 100mm"],
  });
});
