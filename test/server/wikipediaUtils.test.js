import {
	Chai
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
		Chai.assert.equal(doc.title, 'bye');
	}), it('Pythagoreion', function () {
		var result = Assets.getText('test/wikipedia/Pythagoreion.json');
		var json = JSON.parse(result);
		var pageKey = Object.keys(json.query.pages);
		var page = json.query.pages[pageKey];

		var doc = {};
		processPage(doc, page);
		Chai.assert.equal(doc.title, 'bye');
	});
});
