import { mocked } from "jest-mock";
import { Printer } from "..";
import execAsync from "../utils/exec-file-async";
import getPrinters from "./get-printers";

jest.mock("../utils/throw-if-unsupported-os");
jest.mock("../utils/exec-file-async");
const mockedExecAsync = mocked(execAsync);

afterEach(() => {
  // restore the original implementation
  mockedExecAsync.mockRestore();
});

const mockPrintersData: any[] = [
  {
    DeviceID: "ZDesigner ZR668 Plus (ZPL) (已重定向 2)",
    Name: "ZDesigner ZR668 Plus (ZPL) (已重定向 2)",
    PrinterPaperNames: ["Custom"],
  },
  {
    DeviceID: "ZDesigner ZR668 (ZPL) (1) (已重定向 2)",
    Name: "ZDesigner ZR668 (ZPL) (1) (已重定向 2)",
    PrinterPaperNames: ["Custom"],
  },
  {
    DeviceID: "ZDesigner ZR668 (ZPL) (已重定向 2)",
    Name: "ZDesigner ZR668 (ZPL) (已重定向 2)",
    PrinterPaperNames: ["Custom"],
  },
  {
    DeviceID: "Microsoft Print to PDF (已重定向 2)",
    Name: "Microsoft Print to PDF (已重定向 2)",
    PrinterPaperNames: ["信纸", "Tabloid", "法律专用纸", "Statement"],
  },
  {
    DeviceID: "Microsoft XPS Document Writer",
    Name: "Microsoft XPS Document Writer",
    PrinterPaperNames: ["信纸", "小号信纸", "Tabloid", "Ledger"],
  },
  {
    DeviceID: "Microsoft Print to PDF",
    Name: "Microsoft Print to PDF",
    PrinterPaperNames: ["信纸", "Tabloid", "法律专用纸", "Statement"],
  },
  {
    DeviceID: "\\\\JR-PC-0006.jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
    Name: "\\\\JR-PC-0006.jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
    PrinterPaperNames: ["Custom"],
  },
  {
    DeviceID: "\\\\10.2.1.169\\ZDesigner ZD421CN-300dpi ZPL",
    Name: "\\\\10.2.1.169\\ZDesigner ZD421CN-300dpi ZPL",
    PrinterPaperNames: ["Custom"],
  },
  {
    DeviceID: "\\\\EWPD18.Jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
    Name: "\\\\EWPD18.Jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
    PrinterPaperNames: ["Custom"],
  },
  {
    DeviceID: "\\\\jr01171.jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
    Name: "\\\\jr01171.jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
    PrinterPaperNames: ["Custom"],
  },
];

const mockPrinterListStdout = JSON.stringify(mockPrintersData);

it("returns list of available printers", async () => {
  mockedExecAsync.mockResolvedValue({
    stdout: mockPrinterListStdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();

  expect(result).toStrictEqual([
    {
      deviceId: "ZDesigner ZR668 Plus (ZPL) (已重定向 2)",
      name: "ZDesigner ZR668 Plus (ZPL) (已重定向 2)",
      paperSizes: ["Custom"],
    },
    {
      deviceId: "ZDesigner ZR668 (ZPL) (1) (已重定向 2)",
      name: "ZDesigner ZR668 (ZPL) (1) (已重定向 2)",
      paperSizes: ["Custom"],
    },
    {
      deviceId: "ZDesigner ZR668 (ZPL) (已重定向 2)",
      name: "ZDesigner ZR668 (ZPL) (已重定向 2)",
      paperSizes: ["Custom"],
    },
    {
      deviceId: "Microsoft Print to PDF (已重定向 2)",
      name: "Microsoft Print to PDF (已重定向 2)",
      paperSizes: ["信纸", "Tabloid", "法律专用纸", "Statement"],
    },
    {
      deviceId: "Microsoft XPS Document Writer",
      name: "Microsoft XPS Document Writer",
      paperSizes: ["信纸", "小号信纸", "Tabloid", "Ledger"],
    },
    {
      deviceId: "Microsoft Print to PDF",
      name: "Microsoft Print to PDF",
      paperSizes: ["信纸", "Tabloid", "法律专用纸", "Statement"],
    },
    {
      deviceId: "\\\\JR-PC-0006.jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
      name: "\\\\JR-PC-0006.jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
      paperSizes: ["Custom"],
    },
    {
      deviceId: "\\\\10.2.1.169\\ZDesigner ZD421CN-300dpi ZPL",
      name: "\\\\10.2.1.169\\ZDesigner ZD421CN-300dpi ZPL",
      paperSizes: ["Custom"],
    },
    {
      deviceId: "\\\\EWPD18.Jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
      name: "\\\\EWPD18.Jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
      paperSizes: ["Custom"],
    },
    {
      deviceId: "\\\\jr01171.jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
      name: "\\\\jr01171.jinray.com\\ZDesigner ZD421CN-300dpi ZPL",
      paperSizes: ["Custom"],
    },
  ]);
});

it("when did not find any printer info", async () => {
  const stdout = "[]";
  mockedExecAsync.mockResolvedValue({ stdout, stderr: "" });

  const result = await getPrinters();

  return expect(result).toEqual([]);
});

it("fails with an error", () => {
  mockedExecAsync.mockRejectedValue("error");
  return expect(getPrinters()).rejects.toBe("error");
});

it("returns list of available printers with custom properties", async () => {
  const stdout = JSON.stringify([
    {
      DeviceID: "Canon-Printer",
      Name: "Canon Printer",
      PrinterPaperNames: ["A4", "144mm x 100mm", "2 x 4", "4 x 4"],
    },
  ]);

  mockedExecAsync.mockResolvedValue({
    stdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();

  expect(result).toStrictEqual([
    {
      deviceId: "Canon-Printer",
      name: "Canon Printer",
      paperSizes: ["A4", "144mm x 100mm", "2 x 4", "4 x 4"],
    },
  ]);
});
