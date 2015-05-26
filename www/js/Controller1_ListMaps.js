function Controller1_ListMaps($scope, $http) {

	$scope.maps={};
	listMaps = function() {
		$http({method:'GET',
			url: JOOWAR_SERVER_URL+'/api/listMaps.php'
			}).
			success( function(rt) {
				if(Object.keys(rt).length>0) {
					$scope.maps=rt;
				}
			}).
			error( function(et) {
				console.log("Error listing maps from server. "+et);
			})
		;
	};

	angular.element(document).ready(function () {
		listMaps();
	});

};
