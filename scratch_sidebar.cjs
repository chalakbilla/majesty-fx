const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const http = require('http');
const fs = require('fs');

async function testMobileSidebar() {
  const tmpDir = path.join(os.tmpdir(), 'msedge_sidebar_test_' + Date.now());
  const p = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=9230',
    '--user-data-dir=' + tmpDir,
    '--window-size=390,844',
    'http://localhost:5173/admin/demo'
  ]);

  await new Promise(r => setTimeout(r, 2500));
  const tabs = await new Promise((res, rej) => {
    http.get('http://localhost:9230/json', resp => {
      let d = '';
      resp.on('data', chunk => d += chunk);
      resp.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });

  const appTab = tabs.find(t => t.url && t.url.includes('localhost')) || tabs[0];
  const ws = new WebSocket(appTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  function send(method, params = {}) {
    return new Promise(res => {
      const curId = id++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === curId) {
          ws.removeEventListener('message', handler);
          res(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  // Set device emulation to mobile 390x844
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await new Promise(r => setTimeout(r, 600));

  // Click hamburger button to open sidebar
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.admin-toggle-btn');
      if (btn) btn.click();
    })()`
  });

  await new Promise(r => setTimeout(r, 500));

  const screenshot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });

  const outPath = 'C:\\Users\\Ankit Raj\\.gemini\\antigravity\\brain\\1bc63a66-c5fd-4519-b8b0-9c386eb1faaa\\mobile_sidebar_fixed.png';
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log('Saved screenshot to:', outPath);

  ws.close();
  p.kill();
}

testMobileSidebar().catch(console.error);
