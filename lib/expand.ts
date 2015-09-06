/// <reference path="../typings/tsd.d.ts" />
const DEFAULT_TAB_SIZE = 8

import {createReadStream} from 'fs'
import stream = require('stream')

/**
 * Expand tabs of a line
 */
export function expandLine(input: String, tabSize?: number): string {
  tabSize = tabSize || DEFAULT_TAB_SIZE

  var splitted = input.split('\t')
  var length = 0
  var resultChunks: Array<string> = []

  for (var i in splitted) {
    length += splitted[i].length
    resultChunks.push(splitted[i])

    if (i < splitted.length - 1) {
      do {
        resultChunks.push(' ')
        length++
      } while (length % tabSize)
    }
  }
  return resultChunks.join('')
}

interface expanderStreamOptions extends stream.TransformOptions {
  tabSize: number
}

export function expandString(input:String, tabSize?: number): string {
  var lines = input.split(/(?=\n)/g)
  return lines.map(line => expandLine(line, tabSize)).join('')
}

export class expanderStream extends stream.Transform {
  private _lastLineData: string

  constructor(private options?: expanderStreamOptions) {
    super(options)
  }

  _transform(chunk: Buffer|string, encoding: string, done: Function) {
    var data = chunk.toString()
    if (this._lastLineData) {
      data = this._lastLineData + data
    }
    
    // Positive lookahead regex delimiter to keep carriage return in line
    var lines = data.split(/(?=\n)/g)
    lines.forEach(line =>
      this.push(expandLine(line)))
    done()
  }

  _flush(done: Function) {
    if (this._lastLineData) {
      this.push(expandLine(this._lastLineData))
    }
    delete this._lastLineData
    done()
  }
}

/**
 * Returns a stream, expanding file line by line
 */
export function expandFile(filePath: string, tabSize?: number): expanderStream {
  var fileStream = createReadStream(filePath)
  var transformStream = new expanderStream()

  fileStream.pipe(transformStream)

  return transformStream
}
