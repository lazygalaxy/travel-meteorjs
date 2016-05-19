export function processPage(doc, page) {
	var content = page.revisions[0]['*'];
	if (content) {
		setTitle(doc, page.title);

		doc.wikipedia = {}
		doc.wikipedia.content = content;

		processContent(doc);
		proccessInfobox(doc);

		processCoords(doc);
	}
	return doc;
}

function processContent(doc) {
	//remove all comments from the main content
	do {
		var match = extractContent(['<!--', '-->'], doc, true);
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

		setTitle(doc, doc.wikipedia.infobox.name);
		delete doc.wikipedia.infobox.name;

		setImage(doc, doc.wikipedia.infobox.image, doc.wikipedia.infobox.caption);
		delete doc.wikipedia.infobox.image;
		delete doc.wikipedia.infobox.caption;

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
	if (title) {
		title = processValue(title);

		if (doc.title && doc.title != title) {
			throw new Meteor.Error(500, "doc.title conflict: " + doc.title + ' vs. ' + title);
		} else if (!doc.title) {
			doc.title = title;
		}
	}
}

function setImage(doc, image, caption) {
	if (image && caption) {
		image = processValue(image);
		caption = processValue(caption);

		if (!doc.images) {
			doc.images = {};
		}

		if (image && !(image in doc.images)) {
			doc.images[image] = {};
			doc.images[image].caption = caption;
		}
	}
}

function setWHSValue(doc, key, value) {
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
		return false;
	}
}

//removes garbage from a value
function processValue(value) {
	return value.trim();
}

//normalize a value into a key
function normalizeKey(value) {
	return processValue(value.toLowerCase());
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
