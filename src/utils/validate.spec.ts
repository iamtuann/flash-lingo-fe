import { describe, expect, it } from "vitest";
import {  hasValues } from "./validate";

describe('# Object has value', () => {
  it('should not null, undefine, empty string', () => {
    expect(hasValues({ 'key': null })).toBe(false)
    expect(hasValues({ 'key': undefined })).toBe(false)
    expect(hasValues({ 'key': '' })).toBe(false)
    expect(hasValues({key: 0})).toBe(true)
    expect(hasValues({key: "value"})).toBe(true)
  })
})