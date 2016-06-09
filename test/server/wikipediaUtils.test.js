import {
	assert
}
from 'meteor/practicalmeteor:chai'

import {
	expect
}
from 'meteor/practicalmeteor:chai'

import {
	processPage
}
from '../../imports/wikipediaUtils.js'

import {
	processListWHS
}
from '../../imports/wikipediaUtils.js'

describe('wikipedia parse page', function () {
	it('Heraion of Samos', function () {
		var content = Assets.getText('test/wikipedia/Heraion_of_Samos.json')
		var doc = {}
		processPage(doc, content)

		//general
		assert.equal(doc.title, 'Heraion of Samos')

		//whs
		assert.equal(doc.whs.id, '595')
		assert.equal(doc.whs.year, '1992')
		assert.equal(doc.whs.session, '16th')
		assert.equal(doc.whs.criteria, 'ii, iii')
		assert.equal(doc.whs.url, 'http://whc.unesco.org/en/list/595')
		assert.equal(doc.whs.name, 'Pythagoreion and Heraion of Samos')
		assert.equal(doc.whs.type, 'Cultural')
		assert.equal(doc.whs.state_party, 'Greece')

		//categories
		assert.equal(doc.category.length, 2)
		assert.equal(doc.category[0], 'Cultural')
		assert.equal(doc.category[1], 'Sanctuary')

		//coords
		assert.equal(doc.coords.latd, '37')
		assert.equal(doc.coords.latm, '40')
		assert.equal(doc.coords.lats, '19')
		assert.equal(doc.coords.latns, 'N')
		assert.equal(doc.coords.longd, '26')
		assert.equal(doc.coords.longm, '53')
		assert.equal(doc.coords.longs, '08')
		assert.equal(doc.coords.longew, 'E')

		//images
		assert.equal(Object.keys(doc.images).length, 1)
		assert.equal(Object.keys(doc.images)[0], 'Heraion_i_samos<dot>jpg')
		assert.equal(doc.images['Heraion_i_samos<dot>jpg'].url, 'Heraion_i_samos.jpg')
		assert.equal(doc.images['Heraion_i_samos<dot>jpg'].caption, 'Heraion in Samos, Greece.')

		//links
		assert.equal(doc.wikipedia.links.length, 50)
	}), it('Pythagoreion', function () {
		var content = Assets.getText('test/wikipedia/Pythagoreion.json')
		var doc = {}
		processPage(doc, content)

		//general
		assert.equal(doc.title, 'Pythagoreion')

		//whs
		assert.equal(doc.whs.id, '595')
		assert.equal(doc.whs.year, '1992')
		assert.equal(doc.whs.session, '16th')
		assert.equal(doc.whs.criteria, 'ii, iii')
		assert.equal(doc.whs.url, 'http://whc.unesco.org/en/list/595')
		assert.equal(doc.whs.name, 'Pythagoreion and Heraion of Samos')
		assert.equal(doc.whs.type, 'Cultural')
		assert.equal(doc.whs.state_party, 'Greece')

		//categories
		assert.equal(doc.category.length, 1)
		assert.equal(doc.category[0], 'Cultural')

		//coords
		assert.equal(doc.coords.latd, '37')
		assert.equal(doc.coords.latm, '42')
		assert.equal(doc.coords.lats, '4.35')
		assert.equal(doc.coords.latns, 'N')
		assert.equal(doc.coords.longd, '26')
		assert.equal(doc.coords.longm, '52')
		assert.equal(doc.coords.longs, '7.62')
		assert.equal(doc.coords.longew, 'E')

		//images
		assert.equal(Object.keys(doc.images).length, 1)
		assert.equal(Object.keys(doc.images)[0], 'File:Samos_070_2009<dot>JPG')
		assert.equal(doc.images['File:Samos_070_2009<dot>JPG'].url, 'File:Samos_070_2009.JPG')

		//links
		assert.equal(doc.wikipedia.links.length, 19)
	}), it('List_of_World_Heritage_Sites_by_year_of_inscription', function () {
		var content = Assets.getText('test/wikipedia/List_of_World_Heritage_Sites_by_year_of_inscription.json')
		var doc = {}
		processPage(doc, content)

		//general
		assert.equal(doc.title, 'List of World Heritage Sites by year of inscription')

		//whs
		expect(doc.whs).to.be.undefined

		//categories
		expect(doc.category).to.be.undefined

		//coords
		expect(doc.coords).to.be.undefined

		//images
		expect(doc.images).to.be.undefined

		//links
		assert.equal(doc.wikipedia.links.length, 314)
	})
})

//describe('wikipedia parse list', function () {
//	it('List_of_World_Heritage_Sites_by_year_of_inscription', function () {
//		var content = Assets.getText('test/wikipedia/List_of_World_Heritage_Sites_by_year_of_inscription.json')
//		var doc = {}
//		processListWHS(doc, content)
//
//		//general
//		assert.equal(doc.title, 'List of World Heritage Sites by year of inscription')
//	})
//})
