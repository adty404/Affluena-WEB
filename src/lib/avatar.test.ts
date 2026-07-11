import { describe, it, expect } from 'vitest'
import {
  AVATAR_MAX_BYTES,
  AVATAR_MAX_DIMENSION,
  dataUrlByteSize,
  fitWithin,
  isDataImageUrl,
  isHttpUrl,
  isValidAvatarUrl,
} from './avatar'

describe('avatar_url validation', () => {
  it('accepts empty (no photo)', () => {
    expect(isValidAvatarUrl('')).toBe(true)
  })

  it('accepts base64 image data URLs (the mobile upload format)', () => {
    expect(isValidAvatarUrl('data:image/jpeg;base64,/9j/4AAQSkZJRg==')).toBe(true)
    expect(isValidAvatarUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(true)
    expect(isDataImageUrl('DATA:IMAGE/WEBP;base64,AAAA')).toBe(true)
  })

  it('accepts legacy http(s) URLs', () => {
    expect(isValidAvatarUrl('https://example.com/avatar.png')).toBe(true)
    expect(isValidAvatarUrl('http://example.com/a.jpg')).toBe(true)
  })

  it('rejects non-image data URLs and unsafe schemes', () => {
    expect(isValidAvatarUrl('data:text/html;base64,PHNjcmlwdD4=')).toBe(false)
    expect(isValidAvatarUrl('javascript:alert(1)')).toBe(false)
    expect(isValidAvatarUrl('ftp://example.com/a.png')).toBe(false)
    expect(isHttpUrl('javascript:alert(1)')).toBe(false)
  })

  it('rejects plain strings that are not URLs', () => {
    expect(isValidAvatarUrl('foto-saya')).toBe(false)
    expect(isValidAvatarUrl('   ')).toBe(false)
  })
})

describe('dataUrlByteSize', () => {
  it('computes decoded base64 payload size with padding', () => {
    // 'aaaa' -> 3 bytes, 'aaa=' -> 2 bytes, 'aa==' -> 1 byte
    expect(dataUrlByteSize('data:image/jpeg;base64,aaaa')).toBe(3)
    expect(dataUrlByteSize('data:image/jpeg;base64,aaa=')).toBe(2)
    expect(dataUrlByteSize('data:image/jpeg;base64,aa==')).toBe(1)
  })

  it('returns 0 for malformed data URLs', () => {
    expect(dataUrlByteSize('not-a-data-url')).toBe(0)
    expect(dataUrlByteSize('')).toBe(0)
  })

  it('flags payloads above the avatar hard cap', () => {
    const oversized = `data:image/jpeg;base64,${'a'.repeat(Math.ceil((AVATAR_MAX_BYTES + 1024) / 3) * 4)}`
    expect(dataUrlByteSize(oversized)).toBeGreaterThan(AVATAR_MAX_BYTES)
  })
})

describe('fitWithin', () => {
  it('downscales the longest edge to the max dimension, keeping aspect', () => {
    expect(fitWithin(1024, 512, AVATAR_MAX_DIMENSION)).toEqual({ width: 256, height: 128 })
    expect(fitWithin(512, 1024, 256)).toEqual({ width: 128, height: 256 })
  })

  it('never upscales small images', () => {
    expect(fitWithin(100, 80, 256)).toEqual({ width: 100, height: 80 })
  })

  it('never returns dimensions below 1px', () => {
    expect(fitWithin(10000, 1, 256)).toEqual({ width: 256, height: 1 })
    expect(fitWithin(0, 0, 256)).toEqual({ width: 1, height: 1 })
  })
})
