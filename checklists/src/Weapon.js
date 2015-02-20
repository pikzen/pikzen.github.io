function Weapon(tags, name, flavor, image_src, owned, id) {
	var self = this;

	this.tags = tags || [];
	this.name = name;
	this.flavor = flavor;
	this.image_src = image_src;
	this.owned = ko.observable(owned);
	this.id = id;

	this.display_box = ko.computed(function() {
		var str = "";
		if (self.owned()) str += "weapon_display_owned ";
		if (self.tags.indexOf("legendary") != -1) str += "legendary ";
		str += "row weapon_display";

		return str;
	});
}

// ============================================================================
// Related to owned

Weapon.prototype.is_owned = ko.observable(function() {
	return this.owned();
});
Weapon.prototype.toggle_owned = function() {
	this.owned = !this.owned;
}

// ============================================================================
// Tags
Weapon.prototype.has_tag = function(tag) {
	for (var i = 0; i < tags.length; i++) {
		if (tags[i] === tag)
			return true;
	}

	return false;
}



