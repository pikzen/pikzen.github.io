/*
* Represents the base type of a single item
*/
function ItemType() {
	this.Type = ko.observable("amulet");
}

/*
* Represents an additional filter
* An additional filter can be an ItemLevel, Rarity, etc... It may also
* hold other parameters such as value, comparison operator, etc.
* Gives info related to what data it needs to display the appropriate
* UI.
*/
function AdditionalFilter() {
	var self = this;
	this.FilterType = ko.observable("ilvl");
	this.NeedsComparator = ko.computed(function() {
		return 	self.FilterType() == "ilvl" ||
		self.FilterType() == "rarity";
	});
	this.NeedsValue = ko.computed(function() {
		return self.FilterType() == "ilvl";
	});
	this.NeedsRarity = ko.computed(function() {
		return self.FilterType() == "rarity";
	});


	this.FilterComparator = ko.observable("l");
	this.FilterValue = ko.observable("0");
	this.FilterRarity = ko.observable("normal");
}

/*
* Represents a single filter
* Hold info about showing or hiding it, a list of base types that it
* should apply to, as well as a list of additional filters.
*/
function FilterViewModel() {
	this.Show = ko.observable("show");
	this.ItemTypes = ko.observableArray([new ItemType()]);
	this.AdditionalFilters = ko.observableArray([new AdditionalFilter()]);
	this.AddFilter = function() {
		this.AdditionalFilters.push(new AdditionalFilter());
	}
	this.AddItemType = function() {
		this.ItemTypes.push(new ItemType());
	}
}

function AppViewModel() {
	this.translator = [];
	this.init = false;
	this.__init = function() {
		this.translator["item-type"] = [];
		this.translator["item-type"]['amulet'] = "Amulets";
		this.translator["item-type"]['gems']   = "Gems";
		this.translator["item-type"]['gavel']  = "Gavel";

		this.translator["comparators"] = [];
		this.translator["comparators"]['l']  = "<";
		this.translator["comparators"]['le'] = "<=";
		this.translator["comparators"]['e']  = "=";
		this.translator["comparators"]['ge'] = ">=";
		this.translator["comparators"]['g']  = ">";

		this.translator["additional-filter"] = [];
		this.translator["additional-filter"]['ilvl']   = "ItemLevel";
		this.translator["additional-filter"]['rarity'] = "Rarity";

		this.translator["rarity"] = [];
		this.translator["rarity"]["normal"] = "Normal";
		this.translator["rarity"]["magic"]  = "Magic";
		this.translator["rarity"]["rare"]   = "Rare";
		this.translator["rarity"]["unique"] = "Unique";



		this.init = true;
	};
	this.filters = ko.observableArray([
		new FilterViewModel()
		]);

// ================================================================

this.addNewFilter = function() {
	if (!this.init) this.__init();

	this.filters.push(new FilterViewModel());
};

this.ValueForKey = function(category, item) {
	if (!this.init) this.__init();

	return this.translator[category][item];
}
this.ValueForKeys = function(category, list) {
	if (!this.init) this.__init();

	var str = "";
	var self = this;

	str += list.map(function(item) {
		return '"' + self.ValueForKey(category, item.Type()) + '"';
	}).join(" ");

	return str;
};
this.RenderFilterFile = ko.computed(function() {
	if (!this.init) this.__init();

	var str = "";

	for (var i = 0; i < this.filters().length; i++){
		var filter = this.filters()[i];
		if (filter.Show() == "show") str += "Show\n";
		else                         str += "Hide\n";

		str += "	";
		str += this.ValueForKeys("item-type", filter.ItemTypes());
		str += "\n";

		for (var j = 0; j < filter.AdditionalFilters().length; j++) {

			var add = filter.AdditionalFilters()[j];
			str += "	";
			str += this.ValueForKey("additional-filter", add.FilterType());

			if (add.NeedsComparator())
				str += " " + this.ValueForKey("comparators", add.FilterComparator());

			if (add.NeedsValue())
				str += " " + add.FilterValue();

			if (add.NeedsRarity())
				str += " " + this.ValueForKey("rarity", add.FilterRarity());

			str += "\n";
		}
	}

	return str;
}, this);
};

var model = new AppViewModel();
for (var i = model.filters.length - 1; i >= 0; i--) {
	ko.applyBindings(model.filters[i]);
};


ko.applyBindings(AppViewModel);