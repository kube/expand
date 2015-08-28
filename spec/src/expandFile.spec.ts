/// <reference path="../../typings/tsd.d.ts" />

import mocha = require('mocha')
import path = require('path')
import {expect} from 'chai'
import {expandFile} from '../../lib/expand'

describe('expandFile', () => {

	it('should stream file with expanded content', next => {

		var expandedStream = expandFile(path.join(__dirname, '../testFiles/test1.txt'))

		expandedStream.on('data', (data: Buffer) => {
			var line = data.toString()
			expect(line.indexOf('\n')).to.equal(-1)
		})

		expandedStream.on('end', next);
	});
})
