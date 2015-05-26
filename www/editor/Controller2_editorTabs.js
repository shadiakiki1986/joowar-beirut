function Controller2_editorTabs($scope) {

	$scope.tabs=[];
	$scope.tabNum = function(id) {
		i=$scope.tabs.map(function(x) { return x.id; });
		return i.indexOf(id);
	};
	$scope.mainTabHeight=function() {
		nh=20;
		for(var i=0;i<$scope.tabs.length;i++) {
			if(i % 4 == 2) nh = nh + 20;
		}
		return nh+'px';
	};

	$scope.changeActive= function(id) {
		var data = $scope.tabs;
		for (var i = 0, l = data.length; i < l; i++) {
			data[i].isActive = false;
		}
		data[$scope.tabNum(id)].isActive = true;
	};
	$scope.tabColor=function(id) {
		if ($scope.tabs[$scope.tabNum(id)].isActive) {
			return "background-color:rgb(51, 85, 119); color:rgb(0, 0, 0);";
		} else {
			return "background-color:rgb(85, 85, 85); color:rgb(119, 119, 119);";
		}
	};
	$scope.addNewTab=function(id,name,active) {
		$scope.tabs.push({"id":id,"name":name,"isActive":active});
	};
	$scope.addNewTabAuto=function() {
		$scope.tabs.push({"id":"bgtab"+$scope.tabs.length,"name":"layer"+$scope.tabs.length,"isActive":false});
	};

	angular.element(document).ready(function () {
	$scope.$apply(function() {
		$scope.addNewTab("coltab","impassable",false);
		$scope.addNewTab("bgtab1","layer1",true);
		$scope.addNewTab("bgtab2","layer2",false);
	});
	});

};
