/**
 * 服务器测试脚本 - 直接调用 getPrinters() 查看真实打印机列表
 * 
 * 使用方法:
 *   npx tsx _test_server_printers.ts
 * 
 * 或先安装 tsx:
 *   npm install -g tsx
 *   tsx _test_server_printers.ts
 */

import getPrinters from "./src/get-printers/get-printers";

async function main() {
  console.log("正在获取打印机列表...\n");

  try {
    const printers = await getPrinters();

    console.log(`找到 ${printers.length} 台打印机:\n`);

    printers.forEach((printer, index) => {
      console.log(`--- 打印机 ${index + 1} ---`);
      console.log(`  deviceId  : ${printer.deviceId}`);
      console.log(`  name      : ${printer.name}`);
      console.log(`  paperSizes: ${printer.paperSizes.join(", ")}`);
      console.log("");
    });

    console.log("\n=== 原始 JSON ===");
    console.log(JSON.stringify(printers, null, 2));
  } catch (error) {
    console.error("获取打印机失败:", error);
    process.exit(1);
  }
}

main();
