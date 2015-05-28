function mapLaMadonna3() {
// 
o={};
$.ajax({
	"method": "GET",
	"url": JOOWAR_SERVER_URL+'/api/loadMap.php?name=mapLaMadonna3.json',
	"async": false,
	dataType: 'json',
       success: function(text) {
	  o=text;
       },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error loading map. "+textStatus+","+errorThrown);
            }
	});
console.log(o);
return o;
}


