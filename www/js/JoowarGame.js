function JoowarGame(mo1) {
	this.start=function() {
	    enchant(); // initialize
	    var game = new Core(320, 320);
	    game.preload('img/vendor/car.png', 'img/'+mo1.map, 'img/vendor/car2.png'); // preload image
	    game.fps = 20;
	    game.score=0;

	    game.onload = function(){
		var map = new Map(16, 16);
		map.image = game.assets['img/'+mo1.map];


		map.loadData(mo1.a,mo1.b);
		map.collisionData = mo1.c;

		var car = new Sprite(16, 32);
		car.image = game.assets['img/vendor/car.png'];
		car.frame = 5;
		car.motor=new CarEngine(0,0);
		car.width=16;
		car.height=32;

		switch("loc3") {
		case "loc1":
			car.motor.x=280;
			car.motor.y=340;
			car.motor.angle=90;
			break;
		case "loc2":
			car.motor.x=16*26;
			car.motor.y=16*10;
			car.motor.angle=0;
			break;
		default:
			car.motor.x=40;
			car.motor.y=30;
			car.motor.angle=180;
		}

		car.motor.checkCanMove=function() {

			if (this.vx || this.vy) {
			    corners=car.motor.corners();
			    return corners.length==corners.filter(function(c) {
				    x=c.x+car.motor.vx;
				    y=c.y+car.motor.vy;
				    return(0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y));
			    }).length;
			} else {
				return true;
			}
		};

		var carSpeed = new Label();
		var carDamage = new Label();
		var carDamageBgd = new Sprite(100, 15);
		var surface3 = new Surface(100, 15);
		surface3.context.beginPath();                          
		surface3.context.rect(0, 0, 100, 15);  
		surface3.context.fillStyle = 'yellow';
		surface3.context.fill();                               
		carDamageBgd.image = surface3;

		var quit = new Label();
		quit.text="Quit";

		// manual hole
		var hole = new Sprite(8, 8);
		hole.width=8;
		hole.height=8;
		var surface = new Surface(8, 8);
		surface.context.beginPath();                          
		surface.context.arc(4, 4, 4, 0, Math.PI*2, true);  
		surface.context.fill();                               
		hole.image = surface;                                 
		hole.x=40;
		hole.y=160;
		//hole.tl.hide();

		// regart
		regars=[];
		mo1.a.filter(function(x,i) {
			x.filter(function(y,j) {
				if(y==12) {
					var hole = new Sprite(8, 8);
					var surface = new Surface(8, 8);
					surface.context.beginPath();                          
					surface.context.arc(4, 4, 4, 0, Math.PI*2, true);  
					surface.context.fill();                               
					hole.image = surface;                                 
					hole.x=j*16;
					hole.y=i*16;
					hole.tl.hide();

					regars.push(hole);
				}
			});
		});


		// uphills
		uphills=[];
		mo1.a.filter(function(x,i) {
			x.filter(function(y,j) {
				if(y==145||y==146) {
					var z = new Sprite(16,16);

					var surface = new Surface(16,16);
					surface.context.beginPath();                          
					surface.context.rect(0, 0,16,16);  
					surface.context.fill();                               
					z.image=surface;

					z.x=j*16;
					z.y=i*16;
					z.width=16;
					z.height=16;
					if(y==145) z.angle=180; else if(y==146) z.angle=90;
					z.tl.hide();

					uphills.push(z);
				}
			});
		});

		game.rootScene.on(enchant.Event.DOWN_BUTTON_DOWN, function(evt){		car.motor.backward=true;	});
		game.rootScene.on(enchant.Event.UP_BUTTON_DOWN, function(evt){		car.motor.forward=true;	});
		game.rootScene.on(enchant.Event.RIGHT_BUTTON_DOWN, function(evt){		car.motor.right=true;	});
		game.rootScene.on(enchant.Event.LEFT_BUTTON_DOWN, function(evt){		car.motor.left=true;	});
		game.rootScene.on(enchant.Event.DOWN_BUTTON_UP, function(evt){		car.motor.backward=false;	});
		game.rootScene.on(enchant.Event.UP_BUTTON_UP, function(evt){		car.motor.forward=false;	});
		game.rootScene.on(enchant.Event.RIGHT_BUTTON_UP, function(evt){		car.motor.right=false;	});
		game.rootScene.on(enchant.Event.LEFT_BUTTON_UP, function(evt){		car.motor.left=false;	});
		
		car.addEventListener(Event.ENTER_FRAME, function() {

			car.motor.move();
			car.x = car.motor.x;
			car.y = car.motor.y;
			car.rotation=car.motor.angle;

			//Collision with the hole
			if (car.intersect(hole)) {
	//			car.motor.vx=0; car.motor.vy=0;
				if(Math.abs(car.motor.speed)>=3) {
					game.score+=Math.round(Math.pow(car.motor.speed-3,2));
				}
			}
		 
			//Collision with regars 
			regars.map(function(hole) {
				if (car.intersect(hole)) {
		//			car.motor.vx=0; car.motor.vy=0;
					if(Math.abs(car.motor.speed)>=3) {
						game.score+=Math.round(Math.pow(car.motor.speed-3,2));
					}
				}
			});

			// on uphills
			uphills.map(function(x) {
				if (car.intersect(x)) {
					car.motor.speed-=0.02*Math.cos((car.motor.angle-x.angle)/180*Math.PI);
				}
			});

			carSpeed.x=car.x+30;
			carSpeed.y=car.y+30;
			carSpeed.text=Math.round(Math.abs(car.motor.speed*10))+"<br>km/h";

		});

		var stage = new Group();
		stage.addChild(map);
		stage.addChild(hole);
		regars.map(function(x) { stage.addChild(x) ; });
		uphills.map(function(x) { stage.addChild(x) ; });
		stage.addChild(carSpeed);
		stage.addChild(carDamageBgd);
		stage.addChild(carDamage);
		stage.addChild(car);
		stage.addChild(quit);
		game.rootScene.addChild(stage);

		game.rootScene.addEventListener('enterframe', function(e) {
		    var x = Math.min((game.width  - 16) / 2 - car.x, 0);
		    var y = Math.min((game.height - 16) / 2 - car.y, 0);
		    x = Math.max(game.width,  x + map.width)  - map.width;
		    y = Math.max(game.height, y + map.height) - map.height;
		    stage.x = x;
		    stage.y = y;

			carDamageBgd.x=5-stage.x;
			carDamageBgd.y=5-stage.y;

			carDamage.x=5-stage.x;
			carDamage.y=5-stage.y;
			carDamage.text=Math.round(game.score/1000*100)+"% damage";//+", "+Math.round(car.x)+", "+Math.round(car.y);

			quit.x=285-stage.x;
			quit.y=5-stage.y;

		});


		quit.addEventListener(Event.TOUCH_START, function(e){
			location.replace("index.html");
		});


	    };

	    game.start(); // start your game!
	}; // end this.start
}
