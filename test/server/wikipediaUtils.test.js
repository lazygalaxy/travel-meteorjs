import {
	assert
}
from 'meteor/practicalmeteor:chai';

import {
	processPage
}
from '../../imports/wikipediaUtils.js';

describe('wikipedia parse', function () {
	it('Heraion of Samos', function () {
		var result = Assets.getText('test/wikipedia/Heraion_of_Samos.json');
		var json = JSON.parse(result);
		var pageKey = Object.keys(json.query.pages);
		var page = json.query.pages[pageKey];

		var doc = {};
		processPage(doc, page);
		//console.info(doc);

		//general
		assert.equal(doc.title, 'Heraion of Samos');

		//whs
		assert.equal(doc.whs.id, '595');
		assert.equal(doc.whs.year, '1992');
		assert.equal(doc.whs.session, '16th');
		assert.equal(doc.whs.criteria, 'ii, iii');
		assert.equal(doc.whs.url, 'http://whc.unesco.org/en/list/595');
		assert.equal(doc.whs.name, 'Pythagoreion and Heraion of Samos');
		assert.equal(doc.whs.type, 'Cultural');
		assert.equal(doc.whs.state_party, 'Greece');

		//coords
		assert.equal(doc.coords.latd, '37');
		assert.equal(doc.coords.latm, '40');
		assert.equal(doc.coords.lats, '19');
		assert.equal(doc.coords.latns, 'N');
		assert.equal(doc.coords.longd, '26');
		assert.equal(doc.coords.longm, '53');
		assert.equal(doc.coords.longs, '08');
		assert.equal(doc.coords.longew, 'E');
	}), it('Pythagoreion', function () {
		var result = Assets.getText('test/wikipedia/Pythagoreion.json');
		var json = JSON.parse(result);
		var pageKey = Object.keys(json.query.pages);
		var page = json.query.pages[pageKey];

		var doc = {};
		processPage(doc, page);
		console.info(doc);

		//general
		assert.equal(doc.title, 'Pythagoreion');

		//whs
		assert.equal(doc.whs.id, '595');
		assert.equal(doc.whs.year, '1992');
		assert.equal(doc.whs.session, '16th');
		assert.equal(doc.whs.criteria, 'ii, iii');
		assert.equal(doc.whs.url, 'http://whc.unesco.org/en/list/595');
		assert.equal(doc.whs.name, 'Pythagoreion and Heraion of Samos');
		assert.equal(doc.whs.type, 'Cultural');
		assert.equal(doc.whs.state_party, 'Greece');

		//coords
		assert.equal(doc.coords.latd, '37');
		assert.equal(doc.coords.latm, '42');
		assert.equal(doc.coords.lats, '4.35');
		assert.equal(doc.coords.latns, 'N');
		assert.equal(doc.coords.longd, '26');
		assert.equal(doc.coords.longm, '52');
		assert.equal(doc.coords.longs, '7.62');
		assert.equal(doc.coords.longew, 'E');
	});
});
