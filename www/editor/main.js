var loadJsonText="";
loadJsonCore= function(loadJsonText) {
// loadJsonText is a javascript object after conevrsion from json

	w=loadJsonText.a[0].length;
	h=loadJsonText.a.length;

	if(app.mapWidth != w || app.mapHeight != h) {
		alert("map being loaded ("+w+","+h+") has different dimensions than initially stated ("+app.mapWidth+","+app.mapHeight+") ... treason!");
	} else {
		var backgroundMap = new Map(16, 16);
var game = enchant.Game.instance;
		backgroundMap.image = game.assets[loadJsonText.map];
		backgroundMap.loadData(loadJsonText.a,loadJsonText.b);
		backgroundMap.collisionData = loadJsonText.c;
		loadCore(backgroundMap);
	}
};

loadCore=function(backgroundMap) {
	app.mapWidth = backgroundMap._data[0][0].length;
	app.mapHeight = backgroundMap._data[0].length;
	app.maps.bgMap.loadData(backgroundMap.copyData(0),backgroundMap.copyData(1));
	app.maps.colMap.loadData(backgroundMap.collisionData);
	var length = backgroundMap._data.length;
	var tabs = document.getElementById('tabs');
	var num = tabs.childNodes.length - 2;
	if (length < num) {
		for (var i = num; i > length; i--) {
			x=tabs.childNodes[tabs.childNodes.length - 2];
			if(x.nodeType != 8) { // 8=Node.COMMENT_NODE
				tabs.removeChild(x);
			}
		}
	} else if (length > num) {
		for (var i = num; i < length; i++) {
angular.element(document.getElementById('Controller2_editorTabs')).scope().controller.addNewTab('bgtab' + i, 'layer' + i);
		}
	}
	app.frame.changeSize(app.mapWidth, app.mapHeight);
};


window.onload = function() {
    var parArr = window.location.search.split("?");
    if(parArr.length>1) {
        parArr=parArr[1].split("&")[0].split("=")[1];
        console.log("should load "+parArr);
        $.ajax({type:'GET',
            url: JOOWAR_SERVER_URL+'/api/loadMap.php?name='+parArr,
            dataType: 'json',
            success: function(rt) {
		console.log(rt);
                enchant();

		var w = rt.a[0].length;
		var h = rt.a.length;
                acceptCore(w,h,rt.map,false,function() { loadJsonCore(rt); });
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error loading map. "+textStatus+","+errorThrown);
            }
        });
    } else {
        enchant();
    }
}; // end window onload

acceptCore=function(wv,hv,iv,ev,callbackFun) {
	$("#edit").show();

	if(!callbackFun) callbackFun=function() { };

	app.extendMode = ev;
	app.imagePath = iv;
	if (!(isNaN(wv)) && !(isNaN(hv))) {
		var edit = document.getElementById('edit');
		app.image = document.createElement('img');
		app.image.src = iv;
		app.mapWidth = wv;
		app.mapHeight = hv;
		app.image.onload = function() {
			if (app.extendMode && this.width != 256 || this.height != 256) {
				alert('Please use a 256x256 tileset image');
				return;
			}

			start(wv, hv, iv, ev, callbackFun);

			// rectIcon
			var icons = document.getElementById('rectIcon');
			icons.draw();
			if (app.extendMode) {
				icons.updateStat(app.image, 0, 16, 48, 48);
			} else {
				icons.updateStat(app.image, 0, 0);
			}

			//
			var palette = document.getElementById('paletteCanvas');
			palette.loadImage(app.image);

		};
	} else {
		alert("input number");                                                  
	}                                                                          
}; // end acceptcore

$( document ).ready(function() {

	$("#edit").hide();
	$("#acceptButton").click(function() {

		var w = document.getElementById('widthBox');
		var h = document.getElementById('heightBox');                               
		var img = document.getElementById('select');
		var ex = document.getElementById('checkbox');
		var wv = parseInt(w.value, 10);                                             
		var hv = parseInt(h.value, 10);
		var iv = img.options[img.selectedIndex].value;
		var ev = ex.checked;
		acceptCore(wv,hv,iv,ev);
	});

	$("#coltab").click(function() {
		app.selectedLayer = 0;
	});
	$("#bgtab1").click(function() {
		app.selectedLayer = 1;
	});
	$("#bgtab2").click(function() {
		app.selectedLayer = 2;
	});

	$('#geneButton').click( function() {
		var txt = '';
		//var w = window.open('about:blank', '_blank');
w=window;
		var output = document.createElement('textarea');
		app.maps.bgMap.collisionData = app.maps.colMap._data[0];
		output.rows = 30;
		output.cols = 120;
		txt += app.maps.bgMap.getDataCode('backgroundMap', app.imagePath);
		output.value = txt;
		w.document.body.appendChild(output);
	});

	$('#loadJsonButton').change(function() {
	    var file = this.files[0];

	    var reader = new window.FileReader();
	    reader.onload = function(event) {
		if (event) {
			loadJsonCore(JSON.parse(reader.result));
		}
	    }
	    reader.readAsText(file);
	});

	$('#geneButton2').click(function() {
		app.maps.bgMap.collisionData = app.maps.colMap._data[0];
		txt = app.maps.bgMap.getDataJson(app.imagePath);
		var blob = new Blob([txt], {type: "application/json"});
		saveAs(blob, "map.json");
	});

	// icons part of window
	var icons = document.getElementById('rectIcon');
	icons.draw = function() {
		var ctx = this.getContext('2d');
		//
		ctx.clearRect(48, 0, this.width - 48, this.height);
		ctx.font = '20px helvetica';
		ctx.fillText('-1', 48*1 + 8, 32); 
		//
		ctx.fillText('pen', 48*2 + 8, 32); 
		//
		ctx.fillText('fill', 48*3 + 8, 32); 
		//
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'Black';
		ctx.beginPath();
		ctx.moveTo(48*4 +  5, 10);
		ctx.lineTo(48*4 + 43, 38);
		ctx.stroke();

		ctx.fillRect(48*5 +  8, 12, 36, 24);
		//
		ctx.fillRect(48*6 +  8, 8, 32, 10);
		ctx.fillRect(48*6 + 30, 18, 10, 22);
		ctx.fillRect(48*6 + 24, 30, 16, 10);
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(48*6 + 24, 25);
		ctx.lineTo(48*6 + 24, 45);
		ctx.lineTo(48*6 + 14, 35);
		ctx.lineTo(48*6 + 24, 25);
		ctx.fill();
	};
	icons.drawFrame = function(num) {
		var ctx = this.getContext('2d');
		ctx.strokeStyle = 'Red';
		ctx.strokeRect(num * 48, 0, 48, 48);
	};
	icons.onclick = function(e) {
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		var i = Math.floor(x / 48);
		if (i > 1 && i < 6) {
			this.draw();
			this.drawFrame(i);
		}
		this.func[i]();
	};
	icons.updateStat = function(image, x, y, width, height) {
		var ctx = this.getContext('2d');
		ctx.clearRect(0, 0, 48, 48);
		ctx.drawImage(image, x, y, width|16, height|16, 0, 0, 48, 48);
	};
	icons.clearMode = function() {
		var ctx = this.getContext('2d');
		ctx.clearRect(0, 0, 48, 48);
		ctx.lineWidth = 1; 
		ctx.strokeStyle = 'Red';
		ctx.strokeRect(1, 1, 46, 46);
		ctx.beginPath();
		ctx.moveTo(2, 2);
		ctx.lineTo(46, 46);
		ctx.stroke();
	};
	icons.func = {};

	// palette canvas
	var element = document.getElementById('paletteCanvas');
	element.loadImage = function(image) {
		if (image.width > this.width) {
			this.width = image.width;
		} 
		if (image.height > this.height) {
			this.height = image.height;
		}
		var ctx = this.getContext('2d');
		ctx.drawImage(image, 0, 0, this.width, this.height);
	};
	element.onclick = function(e) {
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		var cols = Math.floor(this.width / 16);
		x = Math.floor(x / 16) | 0;
		y = Math.floor(y / 16) | 0;

		var icons = document.getElementById('rectIcon');
		if (app.extendMode) {
			if (x < 6) {
				app.selectedType = Math.floor(x / 3) + Math.floor(y / 4) * 2;
				app.typeEdit = true;
				x = Math.floor(x / 3) * 3;
				y = Math.floor(y / 4) * 4 + 1;
				icons.updateStat(app.image, x*16, y*16, 48, 48);
			} else if (x < 11) {
				app.selectedData = x - 6 + 12 + y * 17;
				app.typeEdit = false;
				icons.updateStat(app.image, x*16, y*16);
			} else {
				app.selectedData = x - 11 + 12 + 272 + y * 17;
				app.typeEdit = false;
				icons.updateStat(app.image, x*16, y*16);
			}

		}
		else {
			app.selectedData = x + y * cols;
			icons.updateStat(app.image, x*16, y*16);
		}
	};

	$('#loadButton').click( function() {
//		var w = window.open('about:blank', '_blank');
w=window;
		var input = document.createElement('textarea');
		input.id = 'load';
		input.rows = 30;
		input.cols = 120;
		var accept = document.createElement('input');
		accept.type = 'button';
		accept.value = 'Import';
		accept.type = 'button';
		accept.onclick = function() {
			try {
				eval(w.document.getElementById('load').value);
			} catch (e) {
				console.log(e);
				alert(e);
			}
			loadCore(backgroundMap);
	//		w.close();
		};
		w.document.body.appendChild(input);
		w.document.body.innerHTML += '<br />';
		w.document.body.appendChild(accept);
		w.document.getElementById('load').value += '// example \n// backGround.loadData([[0, 1, 2], [3, 4, 5], [6, 7, 8]]);';
	});

}); // end document ready

var app = {};
app.maps= {};
app.imagePath = '';
app.typeEdit = true;
app.extendMode = false;
app.editFunc = 'change';
app.selectedLayer = 0;
app.selectedType = 0;
app.selectedData = 0;
app.mapWidth = 0;
app.mapHeight = 0;





