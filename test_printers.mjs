/**
 * 纯 Node.js 打印机测试脚本（零依赖，无需网络）
 * 
 * 使用方法:
 *   1. 把这个文件复制到服务器上
 *   2. 确保服务器已安装 Node.js
 *   3. 运行: node test_printers.mjs
 * 
 * 这个脚本内联了 getPrinters() 的全部逻辑，
 * 只使用 child_process、util、os 等 Node.js 内置模块，
 * 完全不需要 npm install 或网络连接。
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';

const execFileAsync = promisify(execFile);

/* ================================================================
 * 以下代码和 src/get-printers/get-printers.ts 中的逻辑完全一致
 * ================================================================
 */

/** 获取系统上所有可用打印机的列表 */
async function getPrinters() {
  function stdoutHandler(stdout) {
    if (!stdout) return [];
    const items = JSON.parse(stdout);
    return items
      .filter(item => item.DeviceID && item.Name)
      .map(item => ({
        deviceId: item.DeviceID,
        name: item.Name,
        paperSizes: item.PrinterPaperNames || [],
      }));
  }

  // 检查操作系统（仅支持 Windows）
  if (os.platform() !== 'win32') {
    throw new Error('当前操作系统不支持，仅支持 Windows');
  }

  const { stdout } = await execFileAsync('Powershell.exe', [
    '-Command',
    `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Get-CimInstance Win32_Printer -Property DeviceID,Name,PrinterPaperNames | Select-Object DeviceID,Name,PrinterPaperNames | ConvertTo-Json -Compress`,
  ]);

  return stdoutHandler(stdout);
}

/* ================================================================
 * 测试代码
 * ================================================================
 */

async function main() {
  console.log('========== 打印机测试 ==========');
  console.log('正在获取打印机列表...\n');

  try {
    const printers = await getPrinters();

    console.log(`找到 ${printers.length} 台打印机:\n`);

    printers.forEach((printer, index) => {
      console.log(`\n--- 打印机 ${index + 1} ---`);
      console.log(`  deviceId  : ${printer.deviceId}`);
      console.log(`  name      : ${printer.name}`);
      console.log(`  paperSizes: ${printer.paperSizes.join(', ')}`);
    });

    // 额外输出原始 JSON（方便调试反斜杠和编码问题）
    console.log('\n\n========== 原始 JSON ==========');
    console.log(JSON.stringify(printers, null, 2));
  } catch (error) {
    console.error('\n获取打印机失败:', error.message || error);
    process.exit(1);
  }
}

main();
