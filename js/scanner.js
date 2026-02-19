import { parseQrPayload } from "./store.js";

// js/scanner.js
// Camera-based QR/Barcode scanning for MD Tracer.
// Works on HTTPS (GitHub Pages). Uses native BarcodeDetector if available,
// and falls back to ZXing for broader support (e.g., iOS Safari).

const video = document.getElementById("video");
const statusEl = document.getElementById("status");
const lastEl = document.getElementById("last");
const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const btnUseSupplies = document.getElementById("btnUseSupplies");
const btnUseBatches = document.getElementById("btnUseBatches");

let stream = null;
let rafId = null;
let detector = null;
let zxingReader = null;

const STORAGE_KEY_LAST_SCAN = "mdt_last_scan_value";

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

function saveScan(value, format = "") {

  const payload = { value, format, ts: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY_LAST_SCAN, JSON.stringify(payload));
  if (lastEl) lastEl.textContent = `${payload.value}${decoded ? ` [${decoded.t}]` : ""}${format ? ` (${format})` : ""}`;
  try { navigator.vibrate?.(120); } catch {}
  try { maybeReturn(); } catch {}
}



function maybeReturn(){
  try{
    const sp=new URLSearchParams(window.location.search);
    const ret=sp.get('return');
    const tgt=sp.get('target');
    if(ret && tgt){
      // go back with scan info
      const joiner = ret.includes('?') ? '&' : '?';
      window.location.href = ret + joiner + 'scan=1&scan_target=' + encodeURIComponent(tgt);
    }
  }catch(_){/* ignore */}
}

async function requestCamera() {
  const constraints = {
    audio: false,
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  };
  return await navigator.mediaDevices.getUserMedia(constraints);
}

async function ensureDetector() {
  if ("BarcodeDetector" in window) {
    const formats = [
      "qr_code",
      "code_128",
      "code_39",
      "ean_13",
      "ean_8",
      "upc_a",
      "upc_e",
      "itf",
      "data_matrix",
      "pdf417",
      "aztec"
    ];
    detector = new window.BarcodeDetector({ formats });
    return "native";
  }

  if (!zxingReader) {
    setStatus("loading scanner…");
    const mod = await import("https://cdn.jsdelivr.net/npm/@zxing/browser@0.1.5/+esm");
    zxingReader = new mod.BrowserMultiFormatReader();
  }
  return "zxing";
}

async function start() {
  if (!navigator.mediaDevices?.getUserMedia) {
    setStatus("Camera not supported in this browser.");
    return;
  }

  try {
    setStatus("requesting permission…");
    stream = await requestCamera();
    video.srcObject = stream;
    await video.play();

    const mode = await ensureDetector();
    setStatus(`scanning (${mode})…`);

    if (mode === "native") scanLoopNative();
    else scanLoopZXing();

  } catch (err) {
    console.error(err);
    const msg =
      err?.name === "NotAllowedError"
        ? "Permission denied. Allow camera access in browser settings."
        : err?.name === "NotFoundError"
        ? "No camera found on this device."
        : "Could not start camera.";
    setStatus(msg);
  }
}

function stop() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  try { if (zxingReader) zxingReader.reset(); } catch {}

  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  if (video) {
    video.pause?.();
    video.srcObject = null;
  }
  setStatus("stopped");
}

async function scanLoopNative() {
  if (!detector || !video || video.readyState < 2) {
    rafId = requestAnimationFrame(scanLoopNative);
    return;
  }

  try {
    const barcodes = await detector.detect(video);
    if (barcodes && barcodes.length) {
      const b = barcodes[0];
      saveScan(b.rawValue, b.format || "");
      setStatus("scanned ✓");
      setTimeout(() => setStatus("scanning…"), 800);
    }
  } catch {
    // ignore per-frame errors
  }

  rafId = requestAnimationFrame(scanLoopNative);
}

async function scanLoopZXing() {
  if (!zxingReader || !video) return;

  try {
    await zxingReader.decodeFromVideoElementContinuously(video, (result) => {
      if (result) {
        const fmt = typeof result.getBarcodeFormat === "function" ? String(result.getBarcodeFormat()) : "";
        saveScan(result.getText(), fmt);
        setStatus("scanned ✓");
        setTimeout(() => setStatus("scanning…"), 800);
      }
    });
  } catch (e) {
    console.error(e);
    setStatus("scanner error");
  }
}

btnStart?.addEventListener("click", start);
btnStop?.addEventListener("click", stop);

window.addEventListener("beforeunload", stop);

// Show last scan if exists
try {
  const last = JSON.parse(localStorage.getItem(STORAGE_KEY_LAST_SCAN) || "null");
  if (last?.value) {
    if (lastEl) lastEl.textContent = `${last.value}${last.format ? ` (${last.format})` : ""}`;
  }
} catch {}


if(btnUseSupplies){
  btnUseSupplies.addEventListener('click', ()=>{
    const last = JSON.parse(localStorage.getItem('mdt_last_scan_value')||'null');
    const q = last?.value ? encodeURIComponent(last.value) : '';
    window.location.href = 'warehouse/supplies/inventory.html?q=' + q;
  });
}
if(btnUseBatches){
  btnUseBatches.addEventListener('click', ()=>{
    const last = JSON.parse(localStorage.getItem('mdt_last_scan_value')||'null');
    const q = last?.value ? encodeURIComponent(last.value) : '';
    window.location.href = 'production/batches.html?q=' + q;
  });
}
