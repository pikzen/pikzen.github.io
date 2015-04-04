function WeaponsViewModel() {
	var self = this;
	self.search_is_expanded = ko.observable(false);
	self.rules_search = ko.observable('');
	self.rules_hide_owned = ko.observable(false);
	self.rules_tags = ko.observableArray('');
	self.weapons = self.load();

	self.weapons_visible = ko.pureComputed(function() {
		console.log("Rules : " + self.rules_search() + " and " + self.rules_hide_owned());

		return self.weapons().filter(function(item) {
			return (self.rules_search() != "" ? item.name.toLowerCase().indexOf(self.rules_search().toLowerCase()) != -1  : true) &&
			       (self.rules_hide_owned()   ? (item.owned() == false) : true) &&
			       (self.rules_tags() != ""   ? (self.rules_tags().any(item.tags)) : true);
		}).sort(function(first, second) {
			return first.name.localeCompare(second.name);
		});
	});

	self.searchbox_classes = ko.pureComputed(function() {
		var css = "search_expanded";
		css += self.search_is_expanded() ? " search_expanded_display" : "";

		return css;
	});

	self.toggle_weapon = function(id) {
		return ko.computed({
			write: function() {
				self.weapons()[id].owned(!self.weapons()[id].owned());
				self.save();
			},
			read: function() {
				return null;
			}
		}, this);
	}.bind(self.weapons);	

	self.no_results = ko.pureComputed(function() {
		return self.weapons_visible().length == 0 ? "container" : "hidden";
	});

	self.toggle_expanded_search = function() {
		self.search_is_expanded(!self.search_is_expanded());
	};
}

// Take it out because it breaks otherwise. Don't ask why.
WeaponsViewModel.prototype.load = function() {
	wep = ko.observableArray([]);
	var items = [];

	if (localStorage.getItem('data') != null) {
		items = JSON.parse(localStorage.getItem('data'));
	
		if (localStorage.getItem('version') < _version) {
			console.log("Version differs, merging");
			items = merge(items);
			window.item = this;
			this.save();
		}
	}
	else {
		items = _base;
		var id = 0;
		items.forEach(function(item) {
			item.owned = false;
			item.id = id++;
		});
	}

	items.forEach(function(item) {
		wep.push(new Weapon(item.tags, item.name, item.flavor, item.image_src, item.owned, item.id));
	});

	return wep;
}

WeaponsViewModel.prototype.save = function() {
	localStorage.setItem('data', ko.toJSON(this.weapons));
	localStorage.setItem('version', _version);
};

function merge(items) {
	// Stuff should have the same ordering.
	new_items = [];

	for (var i = 0; i < _base.length; i++) {
		if (i < items.length) {
			items[i].name = _base[i].name;
			items[i].tags = _base[i].tags;
			items[i].flavor = _base[i].flavor;
			items[i].image_src = _base[i].image_src;
			new_items[i] = items[i];
		}
		else {
			_base[i].id = i;
			_base[i].owned = false;
			new_items[i] = _base[i];
		}
	}

	return new_items;
}

var viewModel = new WeaponsViewModel();
ko.applyBindings(viewModel);