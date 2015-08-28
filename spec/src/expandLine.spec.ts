/// <reference path="../../typings/tsd.d.ts" />

import mocha = require('mocha')
import {expect} from 'chai'
import {expandLine} from '../../lib/expand'

describe('expandLine', () => {

  describe('with simple tabs', () => {

    it('expands tabs at beginning of line', () => {
      let testLine = '\tHello'

      expect(expandLine(testLine, 8))
        .to.equal('        Hello')

      expect(expandLine(testLine, 4))
        .to.equal('    Hello')

      expect(expandLine(testLine, 3))
        .to.equal('   Hello')

      expect(expandLine(testLine, 2))
        .to.equal('  Hello')
    })

    it('expands tabs in middle of line', () => {
      let testLine = '\tHello\tWorld'

      expect(expandLine(testLine, 8))
        .to.equal('        Hello   World')

      expect(expandLine(testLine, 4))
        .to.equal('    Hello   World')

      expect(expandLine(testLine, 3))
        .to.equal('   Hello World')

      expect(expandLine(testLine, 2))
        .to.equal('  Hello World')
    })

    it('expands tabs at end of line', () => {
      let testLine = '\tHello\tWorld\t'

      expect(expandLine(testLine, 8))
        .to.equal('        Hello   World   ')

      expect(expandLine(testLine, 4))
        .to.equal('    Hello   World   ')

      expect(expandLine(testLine, 3))
        .to.equal('   Hello World ')

      expect(expandLine(testLine, 2))
        .to.equal('  Hello World ')
    })
  })

  describe('with multiple tabs', () => {

    it('expands tabs at beginning of line', () => {
      let testLine = '\t\tHello'

      expect(expandLine(testLine, 8))
        .to.equal('                Hello')

      expect(expandLine(testLine, 4))
        .to.equal('        Hello')

      expect(expandLine(testLine, 3))
        .to.equal('      Hello')

      expect(expandLine(testLine, 2))
        .to.equal('    Hello')
    })

    it('expands tabs in middle of line', () => {
      let testLine = '\t\tHello\t\tWorld'

      expect(expandLine(testLine, 8))
        .to.equal('                Hello           World')

      expect(expandLine(testLine, 4))
        .to.equal('        Hello       World')

      expect(expandLine(testLine, 3))
        .to.equal('      Hello    World')

      expect(expandLine(testLine, 2))
        .to.equal('    Hello   World')
    })

    it('expands tabs at end of line', () => {
      let testLine = '\t\tHello\t\tWorld\t\t'

      expect(expandLine(testLine, 8))
        .to.equal('                Hello           World           ')

      expect(expandLine(testLine, 4))
        .to.equal('        Hello       World       ')

      expect(expandLine(testLine, 3))
        .to.equal('      Hello    World    ')

      expect(expandLine(testLine, 2))
        .to.equal('    Hello   World   ')
    })
  })
})
