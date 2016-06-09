import {
	Meteor
}
from 'meteor/meteor';

import {
	HTTP
}
from 'meteor/http';

import {
	processPage
}
from '../imports/wikipediaUtils.js';

import {
	Locations
}
from '../imports/api/locations.js';

Meteor.startup(() => {
	//Assets.getText('test/wikipedia/Heraion_of_Samos.json', function (error, result) {
	HTTP.call("GET", "https://en.wikipedia.org/w/api.php?action=query&titles=Pythagoreion&prop=revisions&rvprop=content&format=json", function (error, result) {
		if (error) {
			console.log(error);
		} else {
			var doc = {};
			processPage(doc, result.content);
			console.info(doc);
			Locations.upsert({
				_id: doc.title
			}, {
				doc
			});
		}
	});
});
