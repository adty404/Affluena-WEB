/**
 * Avatar photo helpers (mobile parity): mobile uploads profile photos as
 * base64 `data:image/...` URLs stored directly in `avatar_url` (~20–160KB).
 * Web mirrors that — pick a file, downscale client-side via canvas to
 * ≤256px JPEG, hard-cap the encoded size, and submit the data URL.
 *
 * The pure parts (validation, size math, dimension fitting) live here and are
 * unit-tested; the canvas/DOM encoding path is a thin untestable-in-jsdom
 * wrapper around them.
 */

/** Longest edge of the downscaled avatar, in px. */
export const AVATAR_MAX_DIMENSION = 256
/** Hard cap for the encoded data-URL payload (~120KB, mobile convention). */
export const AVATAR_MAX_BYTES = 120 * 1024
/** JPEG encode quality for the downscaled avatar. */
export const AVATAR_JPEG_QUALITY = 0.8

/** True for a base64 image data URL (`data:image/...`), the mobile upload format. */
export function isDataImageUrl(value: string): boolean {
  return /^data:image\//i.test(value)
}

/** True for an absolute http(s) URL (legacy manually-entered avatar links). */
export function isHttpUrl(value: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return false
  }
  return parsed.protocol === 'http:' || parsed.protocol === 'https:'
}

/**
 * Form-level `avatar_url` validation: empty (no photo), an uploaded
 * `data:image/...` URL, or a legacy http(s) URL. Everything else —
 * including `javascript:` and non-image data URLs — is rejected.
 */
export function isValidAvatarUrl(value: string): boolean {
  if (value === '') return true
  return isDataImageUrl(value) || isHttpUrl(value)
}

/** Decoded byte size of a base64 data URL's payload (0 when malformed). */
export function dataUrlByteSize(dataUrl: string): number {
  const comma = dataUrl.indexOf(',')
  if (comma < 0) return 0
  const base64 = dataUrl.slice(comma + 1)
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  return Math.max(Math.floor((base64.length * 3) / 4) - padding, 0)
}

/**
 * Proportionally fit `width`×`height` inside a `maxDimension` square without
 * upscaling. Always returns integers of at least 1px.
 */
export function fitWithin(width: number, height: number, maxDimension: number): { width: number; height: number } {
  const safeWidth = Math.max(width, 1)
  const safeHeight = Math.max(height, 1)
  const scale = Math.min(maxDimension / Math.max(safeWidth, safeHeight), 1)
  return {
    width: Math.max(Math.round(safeWidth * scale), 1),
    height: Math.max(Math.round(safeHeight * scale), 1),
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Gagal membaca gambar'))
    }
    image.src = objectUrl
  })
}

function encodeToJpegDataUrl(image: HTMLImageElement, maxDimension: number): string {
  const { width, height } = fitWithin(image.naturalWidth, image.naturalHeight, maxDimension)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas tidak tersedia')
  // Fill white first so transparent PNG regions become white, not black JPEG.
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', AVATAR_JPEG_QUALITY)
}

/**
 * Thin canvas wrapper (not unit-tested — jsdom has no real canvas/Image):
 * downscale the picked file to ≤{@link AVATAR_MAX_DIMENSION}px JPEG, then
 * re-downscale smaller until the encoded payload fits
 * {@link AVATAR_MAX_BYTES}. Rejects if even a tiny render stays oversized.
 */
export async function fileToAvatarDataUrl(file: File): Promise<string> {
  const image = await loadImage(file)
  let dimension = AVATAR_MAX_DIMENSION
  let dataUrl = encodeToJpegDataUrl(image, dimension)
  while (dataUrlByteSize(dataUrl) > AVATAR_MAX_BYTES && dimension > 64) {
    dimension = Math.round(dimension * 0.75)
    dataUrl = encodeToJpegDataUrl(image, dimension)
  }
  if (dataUrlByteSize(dataUrl) > AVATAR_MAX_BYTES) {
    throw new Error('Foto terlalu besar untuk diproses')
  }
  return dataUrl
}
