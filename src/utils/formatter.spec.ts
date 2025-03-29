import { formatTime } from './formatter'
import { describe, expect, it } from "vitest";

describe('# Time format', () => {
  it('format to minute, second correctly', () => {
    expect(formatTime(245)).toBe('4m 5s')
  })

  it('format to hours, minute, second correctly', () => {
    expect(formatTime(3845)).toBe('1h 4m 5s')
  })
})