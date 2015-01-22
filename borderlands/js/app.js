angular.module("Borderlands", ['ngMaterial'])
	.controller("TabbedPageController", ["$scope", function($scope) {
		$scope.selectedIndex=1;
	}])
	.controller("ItemChecklistController", function($scope, $mdBottomSheet, $http) {
		$scope.search = "";

		$scope.filterGames = false;
		$scope.filterRarity = false;
		$scope.filterType  = false;

		$scope.showFilterList = function($event) {
			$mdBottomSheet.show({
				templateUrl: 'filter-list-template.html',
				controller: 'FilterListController',
				targetEvent: $event,
			}).then(function($games, $rarities, $items) {
				alert("We closed and it's not implemented yet yo");
			});
		};

		$http.get("items.json").then(function(res) {
			$scope.items = res.data.map(function(item) {
				item.owned = false;
				return item;
			});
		});

		$scope.visibleItems = [
			{name: 'Bob', flair: 'Fwd: Fwd: Fwd: Lol look at this picture I found!', id:1},
			{name: 'Bob', flair: 'wtf', id:1},
			{name: 'Bob', flair: 'wtf', id:1},
			{name: 'Bob', flair: 'wtf', id:1},
			{name: 'Bob', flair: 'wtf', id:1},
			{name: 'Bob', flair: 'wtf', id:1},
			{name: 'Bob', flair: 'wtf', id:1},
			{name: 'Bob', flair: 'wtf', id:1},
			{name: 'Bob', flair: 'wtf', id:1}
		];

		$scope.getItem = function(item) {
			item.owned = !item.owned;
		}
	})
	.controller('FilterListController', function($scope, $mdBottomSheet) {
		$scope.games = [
			{ name:'Borderlands',			  	prop: 'filter_game_bdl'  , ticked:false},
			{ name:'Borderlands 2',			prop: 'filter_game_bdl2' , ticked:false},
			{ name:'Borderlands : The Pre-Sequel!',	prop: 'filter_game_tps', ticked:false}
		];

		$scope.rarities = [
			{ name: 'Uniques', 	prop: 'filter_rarity_uni', ticked:false},
			{ name: 'Legendaries', prop: 'filter_rarity_leg', ticked:false},
			{ name: 'Seraph', 	prop: 'filter_rarity_ser', ticked:false},
			{ name: 'Pearlescent', 	prop: 'filter_rarity_prl', ticked:false},
		];

		$scope.itemType = [
			{ name: 'Pistols',	 	prop: 'filter_item_pistol', ticked:false},
			{ name: 'SMGs', 		prop: 'filter_item_smg', ticked:false},
			{ name: 'Rifles', 		prop: 'filter_item_rarity', ticked:false},
			{ name: 'Shotguns', 		prop: 'filter_item_shotgun', ticked:false},
			{ name: 'Snipers', 		prop: 'filter_item_sniper', ticked:false},
			{ name: 'Rocket Launchers', 	prop: 'filter_item_rocket', ticked:false},
			{ name: 'Laser', 		prop: 'filter_item_laser', ticked:false},
			{ name: 'Eridian', 		prop: 'filter_item_eridian', ticked:false},
			{ name: 'Grenades', 		prop: 'filter_item_grenade', ticked:false},
			{ name: 'Stuff I\'ve missed', 	prop: 'filter_item_moar', ticked:false},
		];

		$scope.closeFilterList = function() {
			$mdBottomSheet.hide($scope.games, $scope.rarities, $scope.itemType);
		};

		$scope.clearAll = function() {

		};

		$scope.enableAll = function() {

		};
	});
;
