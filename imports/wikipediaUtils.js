export function processPage(doc, content) {
	var json = JSON.parse(content);
	var pageKey = Object.keys(json.query.pages);
	var page = json.query.pages[pageKey];
	content = page.revisions[0]['*'];
	if (content) {
		setTitle(doc, page.title);

		doc.wikipedia = {}
		doc.wikipedia.content = content;

		processContent(doc);
		proccessInfobox(doc);

		processTitle(doc);
		processCategories(doc);
		processCoords(doc);
	}
	return doc;
}

function processContent(doc) {
	//remove all comments from the main content
	do {
		var match = extractContent(['<!--', '-->'], doc, true);
		if (match) {
			console.info('removed ' + match);
		}
	}
	while (match);

	do {
		var match = extractContent(['<', 'small>'], doc, true);
		if (match) {
			console.info('removed ' + match);
		}
	}
	while (match);
}

function proccessInfobox(doc) {
	// get the infobox content
	var content = extractContent(['{{Infobox', '}}'], doc, false);
	if (content) {
		doc.wikipedia.infobox = {};
		doc.wikipedia.infobox['content'] = content;
		do {
			// extract all key value pair
			var match = extractInfobox(['|', '=', '\n'], doc, true);
			if (match) {
				var keyValue = match.split('=');
				var key = normalizeKey(keyValue[0]);
				var value = keyValue[1].trim();
				if (value) {
					doc.wikipedia.infobox[key] = value;
				}
			}
		}
		while (match);

		if (doc.wikipedia.infobox.image) {
			//this should go into a wikipedia specific addImage method
			var image = doc.wikipedia.infobox.image.split('|')[0];
			image = image.split(' ').join('_');
			if (addImage(doc, image, doc.wikipedia.infobox.caption)) {
				delete doc.wikipedia.infobox.image;
				delete doc.wikipedia.infobox.caption;
			}
		}

		//process whs info from the infobox
		processInfoboxWHS(doc);
	}
}

function processInfoboxWHS(doc) {
	//process possible world heritage site information
	for (i = 1;; i++) {
		var designation = 'designation' + i;
		if (doc.wikipedia.infobox[designation] && doc.wikipedia.infobox[designation].toUpperCase() == 'WHS') {
			processInfoboxWHSKey(doc, designation + '_number', ['url', 'id']);
			processInfoboxWHSKey(doc, designation + '_date', ['year', 'session']);
			processInfoboxWHSKey(doc, designation + '_criteria', ['criteria']);
			processInfoboxWHSKey(doc, designation + '_offname', ['name']);
			processInfoboxWHSKey(doc, designation + '_type', ['type']);
			processInfoboxWHSKeyValues(doc, designation)
		} else {
			break;
		}
	}

	if (doc.wikipedia.infobox.whs && doc.wikipedia.infobox.id) {
		processInfoboxWHSKey(doc, 'id');
		processInfoboxWHSKey(doc, 'year');
		processInfoboxWHSKey(doc, 'session');
		processInfoboxWHSKey(doc, 'criteria');
		processInfoboxWHSKey(doc, 'link', ['url']);
		processInfoboxWHSKey(doc, 'state_party');
		processInfoboxWHSKey(doc, 'type');
		processInfoboxWHSKey(doc, 'whs', ['name']);
	}
}

function processInfoboxWHSKey(doc, key, cleanKeys = [key]) {
	if (doc.wikipedia.infobox[key]) {
		if (cleanKeys.length == 1) {
			setWHSValue(doc, cleanKeys[0], doc.wikipedia.infobox[key]);
		} else {
			var values = doc.wikipedia.infobox[key].split(' ');
			for (i = 0; i < cleanKeys.length; i++) {
				setWHSValue(doc, cleanKeys[i], values[i]);
			}
		}
		delete doc.wikipedia.infobox[key];
	}
}

function processInfoboxWHSKeyValues(doc, designation) {
	for (i = 1;; i++) {
		var freeName = designation + '_free' + i + 'name';
		var freeValue = designation + '_free' + i + 'value';
		if (doc.wikipedia.infobox[freeName] && doc.wikipedia.infobox[freeValue]) {
			setWHSValue(doc, normalizeKey(doc.wikipedia.infobox[freeName]), doc.wikipedia.infobox[freeValue]);
			delete doc.wikipedia.infobox[freeName];
			delete doc.wikipedia.infobox[freeValue];
		} else {
			break;
		}
	}
}

//extract category information
function processTitle(doc) {
	if (setTitle(doc, doc.wikipedia.infobox.name)) {
		delete doc.wikipedia.infobox.name;
	}
}

//extract category information
function processCategories(doc) {
	if (doc.whs) {
		addCategory(doc, doc.whs.type);
	}

	if (doc.wikipedia.infobox) {
		if (addCategory(doc, doc.wikipedia.infobox.type)) {
			delete doc.wikipedia.infobox.type;
		}
	}
}

//extract coordinate information
function processCoords(doc) {
	var coords = extractContent(['{{coord|', '}}'], doc, true);
	if (coords) {
		coords = coords.split('|');
		setCoords(doc, coords[0], coords[1], coords[2], coords[3], coords[4], coords[5], coords[6], coords[7]);
	}

	if (setCoordsByMap(doc, doc.wikipedia.infobox, ['latd', 'latm', 'lats', 'latns', 'longd', 'longm', 'longs', 'longew'])) {
		delete doc.wikipedia.infobox.latd;
		delete doc.wikipedia.infobox.latm;
		delete doc.wikipedia.infobox.lats;
		delete doc.wikipedia.infobox.latns;
		delete doc.wikipedia.infobox.longd;
		delete doc.wikipedia.infobox.longm;
		delete doc.wikipedia.infobox.longs;
		delete doc.wikipedia.infobox.longew;
	}
}

// extract information from the main conent
function extractContent(tokens, doc, mustRemoveTokens) {
	var match = extract(tokens, doc.wikipedia.content);
	doc.wikipedia.content = doc.wikipedia.content.replace(match, '');
	if (mustRemoveTokens) {
		match = match.substring(tokens[0].length, match.length - tokens[tokens.length - 1].length);
	}
	return match.trim();
}

//extract informaiton from the infobox
function extractInfobox(tokens, doc, mustRemoveTokens) {
	var match = extract(tokens, doc.wikipedia.infobox['content']);
	doc.wikipedia.infobox['content'] = doc.wikipedia.infobox['content'].replace(match, '');
	if (mustRemoveTokens) {
		match = match.substring(tokens[0].length, match.length - tokens[tokens.length - 1].length);
	}
	return match.trim();
}



// ------------------------------- General Utils -------------------------------
function setTitle(doc, title) {
	title = processValue(title);
	if (title) {
		if (doc.title && doc.title != title) {
			throw new Meteor.Error(500, "doc.title conflict: " + doc.title + ' vs. ' + title);
		} else if (!doc.title) {
			doc.title = title;
		}
		return true;
	}
	return false;
}

function addImage(doc, url, caption) {
	url = processValue(url);
	caption = processValue(caption);

	if (url) {
		if (!doc.images) {
			doc.images = {};
		}

		var key = url.split('.').join('<dot>');

		if (!(key in doc.images)) {
			doc.images[key] = {};
			doc.images[key].url = url;
			if (caption) {
				doc.images[key].caption = caption;
			}
		}
		return true;
	}
	return false;
}

function addCategory(doc, category) {
	category = processValue(category);

	if (category) {
		if (!doc.category) {
			doc.category = [];
		}

		if (!(category in doc.category)) {
			doc.category.push(category);
		}
		return true;
	}
	return false;
}

function setWHSValue(doc, key, value) {
	value = processValue(value);

	if (key && value) {
		if (!doc.whs) {
			doc.whs = {};
		}

		if (!doc.whs[key]) {
			doc.whs[key] = value;
			return true;
		} else {
			throw new Meteor.Error(500, "duplicate doc.whs." + key);
		}
	}
	return false;
}

function setCoordsByMap(doc, map, keys) {
	return setCoords(doc, map[keys[0]], map[keys[1]], map[keys[2]], map[keys[3]], map[keys[4]], map[keys[5]], map[keys[6]], map[keys[7]]);
}

function setCoords(doc, latd, latm, lats, latns, longd, longm, longs, longew) {
	latd = processValue(latd);
	latm = processValue(latm);
	lats = processValue(lats);
	latns = processValue(latns);
	longd = processValue(longd);
	longm = processValue(longm);
	longs = processValue(longs);
	longew = processValue(longew);

	if (latd && latm && lats && latns && longd && longm && longs && longew) {
		if (!doc.coords) {
			doc.coords = {};
			doc.coords.latd = processValue(latd);
			doc.coords.latm = processValue(latm);
			doc.coords.lats = processValue(lats);
			doc.coords.latns = processValue(latns);
			doc.coords.longd = processValue(longd);
			doc.coords.longm = processValue(longm);
			doc.coords.longs = processValue(longs);
			doc.coords.longew = processValue(longew);
			return true
		} else {
			throw new Meteor.Error(500, "duplicate doc.coords");
		}
	}
	return false;
}

//removes garbage from a value
function processValue(value) {
	if (value) {
		value = value.split('[').join('');
		value = value.split(']').join('');
		value = value.split('(').join('');
		value = value.split(')').join('');
		value = value.split('\'').join('');

		return value.trim();
	}
	return '';
}

//normalize a value into a key
function normalizeKey(value) {
	value = processValue(value.toLowerCase());
	value = value.split(' ').join('_');
	return value;
}

//normalize a value into a regular expression
function normalizeRegExp(value) {
	return value.replace('|', '\\|');
}

//general regexp extract helper
function extract(tokens, text) {
	var regExpStr = normalizeRegExp(tokens[0]);
	for (i = 1; i < tokens.length; i++) {
		regExpStr += '(.|\n)*?' + normalizeRegExp(tokens[i]);
	}
	var regExp = new RegExp(regExpStr, 'i');

	var match = regExp.exec(text);
	if (!match) {
		return '';
	}
	return match[0];
}
