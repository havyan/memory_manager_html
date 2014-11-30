(function() {
	var parseElement = function(e) {
		var $e = $(e);
		if ($e.children().length > 0 || (e.attributes && e.attributes.length > 0)) {
			var json = {};
			json['#text'] = $e.text();
			if ($e.children().length > 0) {
				$.each($e.children(), function(index, child) {
					var attrName = child.nodeName;
					var value = parseElement(child);
					if (json[attrName]) {
						if ($.isArray(json[attrName])) {
							json[attrName].push(value);
						} else {
							var currentValue = json[attrName];
							json[attrName] = [];
							json[attrName].push(currentValue);
							json[attrName].push(value);
						}
					} else {
						json[attrName] = value;
					}
				});
			}

			if (e.attributes && e.attributes.length > 0) {
				$.each(e.attributes, function(index, attribute) {
					var attrName = '@' + attribute.nodeName.toLowerCase();
					json[attrName] = $e.attr(attribute.nodeName);
				});
			}
			return json;
		} else {
			return $e.text();
		}
	};

	$.xml2json = function(xml) {
		return parseElement($(xml));
	};
})();