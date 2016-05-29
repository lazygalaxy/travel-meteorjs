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
		var doc = {};
		processPage(doc, result);
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

		//categories
		assert.equal(doc.category.length, 2);
		assert.equal(doc.category[0], 'Cultural');
		assert.equal(doc.category[1], 'Sanctuary');

		//coords
		assert.equal(doc.coords.latd, '37');
		assert.equal(doc.coords.latm, '40');
		assert.equal(doc.coords.lats, '19');
		assert.equal(doc.coords.latns, 'N');
		assert.equal(doc.coords.longd, '26');
		assert.equal(doc.coords.longm, '53');
		assert.equal(doc.coords.longs, '08');
		assert.equal(doc.coords.longew, 'E');

		//images
		assert.equal(Object.keys(doc.images).length, 1);
		assert.equal(Object.keys(doc.images)[0], 'Heraion_i_samos.jpg');
	}), it('Pythagoreion', function () {
		var result = Assets.getText('test/wikipedia/Pythagoreion.json');
		var doc = {};
		processPage(doc, result);
		//console.info(doc);

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

		//categories
		assert.equal(doc.category.length, 1);
		assert.equal(doc.category[0], 'Cultural');

		//coords
		assert.equal(doc.coords.latd, '37');
		assert.equal(doc.coords.latm, '42');
		assert.equal(doc.coords.lats, '4.35');
		assert.equal(doc.coords.latns, 'N');
		assert.equal(doc.coords.longd, '26');
		assert.equal(doc.coords.longm, '52');
		assert.equal(doc.coords.longs, '7.62');
		assert.equal(doc.coords.longew, 'E');

		//images
		assert.equal(Object.keys(doc.images).length, 1);
		assert.equal(Object.keys(doc.images)[0], 'File:Samos_070_2009.JPG');
	});
});
