function colorDist(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
) {
  const rm = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt((2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db);
}

function alphaRatio(data: Uint8ClampedArray) {
  let cut = 0;
  const n = data.length / 4;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 242) cut += 1;
  return cut / n;
}

function medianBorder(data: Uint8ClampedArray, w: number, h: number) {
  const rs: number[] = [];
  const gs: number[] = [];
  const bs: number[] = [];
  const take = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    rs.push(data[i]);
    gs.push(data[i + 1]);
    bs.push(data[i + 2]);
  };
  for (let x = 0; x < w; x += 1) {
    take(x, 0);
    take(x, h - 1);
  }
  for (let y = 0; y < h; y += 1) {
    take(0, y);
    take(w - 1, y);
  }
  const mid = (arr: number[]) => {
    arr.sort((a, b) => a - b);
    return arr[arr.length >> 1] ?? 255;
  };
  return { r: mid(rs), g: mid(gs), b: mid(bs) };
}

function floodBackground(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  bg: { r: number; g: number; b: number },
  thresh: number,
) {
  const visited = new Uint8Array(w * h);
  const q: number[] = [];
  const maybe = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const idx = y * w + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (colorDist(data[i], data[i + 1], data[i + 2], bg.r, bg.g, bg.b) <= thresh) {
      visited[idx] = 1;
      q.push(idx);
    }
  };
  for (let x = 0; x < w; x += 1) {
    maybe(x, 0);
    maybe(x, h - 1);
  }
  for (let y = 0; y < h; y += 1) {
    maybe(0, y);
    maybe(w - 1, y);
  }
  let head = 0;
  while (head < q.length) {
    const idx = q[head++];
    const x = idx % w;
    const y = (idx / w) | 0;
    maybe(x - 1, y);
    maybe(x + 1, y);
    maybe(x, y - 1);
    maybe(x, y + 1);
  }
  return visited;
}

function applyMask(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  visited: Uint8Array,
  bg: { r: number; g: number; b: number },
  thresh: number,
) {
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const idx = y * w + x;
      const i = idx * 4;
      if (visited[idx]) {
        data[i + 3] = 0;
        continue;
      }
      let near = false;
      for (let oy = -1; oy <= 1 && !near; oy += 1) {
        for (let ox = -1; ox <= 1; ox += 1) {
          const nx = x + ox;
          const ny = y + oy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (visited[ny * w + nx]) {
            near = true;
            break;
          }
        }
      }
      if (!near) continue;
      const d = colorDist(data[i], data[i + 1], data[i + 2], bg.r, bg.g, bg.b);
      const t0 = thresh * 0.35;
      const t1 = thresh * 1.05;
      const soft = d <= t0 ? 0 : d >= t1 ? 1 : (d - t0) / (t1 - t0);
      data[i + 3] = Math.round(data[i + 3] * soft);
    }
  }
}

function cropTransparent(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const { width: w, height: h } = canvas;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (d[(y * w + x) * 4 + 3] < 10) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX <= minX || maxY <= minY) return canvas;
  const pad = 6;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad);
  maxY = Math.min(h - 1, maxY + pad);
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const out = document.createElement("canvas");
  out.width = cw;
  out.height = ch;
  const octx = out.getContext("2d");
  if (!octx) return canvas;
  octx.drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);
  return out;
}

function loadSrc(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    img.src = src;
  });
}

export type PreparedArt = {
  src: string;
  removedBg: boolean;
  alreadyTransparent: boolean;
};

export async function prepareArtwork(src: string, keepBackground = false): Promise<PreparedArt> {
  const img = await loadSrc(src);
  const max = 1400;
  const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(2, Math.round(img.naturalWidth * scale));
  const h = Math.max(2, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { src, removedBg: false, alreadyTransparent: false };
  ctx.drawImage(img, 0, 0, w, h);
  const image = ctx.getImageData(0, 0, w, h);
  const alreadyTransparent = alphaRatio(image.data) > 0.04;

  if (keepBackground || alreadyTransparent) {
    const cropped = alreadyTransparent ? cropTransparent(canvas) : canvas;
    return {
      src: cropped.toDataURL("image/png"),
      removedBg: false,
      alreadyTransparent,
    };
  }

  const bg = medianBorder(image.data, w, h);
  let visited = floodBackground(image.data, w, h, bg, 38);
  let marked = 0;
  for (let i = 0; i < visited.length; i += 1) marked += visited[i];
  if (marked / visited.length < 0.04) {
    visited = floodBackground(image.data, w, h, bg, 68);
    marked = 0;
    for (let i = 0; i < visited.length; i += 1) marked += visited[i];
  }
  if (marked / visited.length < 0.02 || marked / visited.length > 0.97) {
    return { src: canvas.toDataURL("image/png"), removedBg: false, alreadyTransparent: false };
  }

  applyMask(image.data, w, h, visited, bg, marked / visited.length < 0.12 ? 68 : 42);
  ctx.putImageData(image, 0, 0);
  const cropped = cropTransparent(canvas);
  return { src: cropped.toDataURL("image/png"), removedBg: true, alreadyTransparent: false };
}

export function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Envie PNG, JPG, WEBP ou SVG."));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error("Arquivo acima de 8 MB."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Não foi possível ler o arquivo."));
    };
    reader.onerror = () => reject(new Error("Falha na leitura."));
    reader.readAsDataURL(file);
  });
}
