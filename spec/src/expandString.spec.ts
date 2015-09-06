/// <reference path="../../typings/tsd.d.ts" />

import path = require('path')
import mocha = require('mocha')
import {expect} from 'chai'
import {expandString} from '../../lib/expand'
import {readFile} from 'fs'

describe('expandString', () => {

  it('works with single line', () => {
    let testString = '\tHello'

    expect(expandString(testString, 8))
      .to.equal('        Hello')

    expect(expandString(testString, 4))
      .to.equal('    Hello')

    expect(expandString(testString, 3))
      .to.equal('   Hello')

    expect(expandString(testString, 2))
      .to.equal('  Hello')
  })

  it('works with file content', done => {

    readFile(path.join(__dirname, '../testFiles/test1.txt'),
      (err, data: Buffer) => {
        var content = data.toString()
        
        var expandedString = expandString(content)
        
        expandedString.split('\n')
          .forEach(line => {
            if (line.length > 0) {
              expect(line.charAt(0)).to.equal(' ')
            }
      			expect(line.match(/\n/g) || []).length.to.be.at.most(1)
          })
          done()
      })
  })

})