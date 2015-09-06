/// <reference path="../../typings/tsd.d.ts" />

import mocha = require('mocha')
import path = require('path')
import async = require('async')
import {readFile} from 'fs'
import {expect} from 'chai'
import {expandFile} from '../../lib/expand'

describe('expandFile', () => {

	it('should stream file with expanded content', done => {

		var expandedStream = expandFile(path.join(__dirname, '../testFiles/test1.txt'))

		expandedStream.on('data', (data: Buffer) => {
			var line = data.toString()
			expect(line.match(/\n/g) || []).length.to.be.at.most(1)
		})

		expandedStream.on('end', done);
	})

	it('should restitute big files without tabs', done => {

		var output = []

		var filePath = path.join(__dirname, '../testFiles/lipsum.txt')
		var expandedStream = expandFile(filePath)

		expandedStream.on('data', (data: Buffer) => {
			var line = data.toString()
			output.push(line)
		})

		var result
		var original

		async.parallel([
			next => {
				expandedStream.on('end', () => next(null))
			},
			next => {
				readFile(filePath, (err, data: Buffer) => {
					original = data.toString()
					result = output.join('')
					next(null)
				})
			}
		], () => {
			expect(result).to.equal(original)
			done()
		});

	})
})
