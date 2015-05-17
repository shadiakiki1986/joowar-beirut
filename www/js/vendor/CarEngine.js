// http://stackoverflow.com/questions/7106282/making-a-simple-car-game-with-html5-canvas

    // Car object and properties
    function CarEngine(x, y){        
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
    
        this.topSpeed = 15;
        this.acceleration = 0.3;
        this.reverse = 0.2;
        this.brakes = 0.3;
        this.friction = 0.05;
        this.handeling = 15;
        this.grip = 22;
        this.minGrip = 5;
        this.speed = 0;
        this.drift = 0;
    
        this.left = false;
        this.forward = false;
        this.right = false;
        this.backward = false;
	this.checkCanMove=function() { return true; };

	this.move=function(){
		car=this;
		
		// Faster the car is going, the worse it handels
		if(car.handeling > car.minGrip){
		    car.handeling = car.grip - car.speed;
		}
		else{
		    car.handeling = car.minGrip + 1;
		}
		
		
		// Car acceleration to top speed
		if(car.forward){
		    if(car.speed < car.topSpeed){
			car.speed = car.speed + car.acceleration;
		    }            
		}        
		else if(car.backward){
		    if(car.speed < 1){
			car.speed = car.speed - car.reverse;    
		    }
		    else if(car.speed > 1){
			car.speed = car.speed - car.brakes;
		    }
		}
		
		
		// Car drifting logic (it's crap, needs work)
		if(car.forward && car.left){
		    if(car.drift > -35){
			car.drift = car.drift - 3;    
		    }
		}
		else if(car.forward && car.right){
		    if(car.drift < 35){
			car.drift = car.drift + 3;    
		    }
		}
		else if(car.forward && !car.left && car.drift > -40 && car.drift < -3){
		    car.drift = car.drift + 3;
		}
		else if(car.forward && !car.right && car.drift < 40 && car.drift > 3){
		    car.drift = car.drift - 3;
		}
		
		if(car.drift > 3){
		    if(!car.forward && !car.left){
			car.drift = car.drift - 4;
		    }
		}

		else if(car.drift > -40 && car.drift < -3){
		    if(!car.forward && !car.right){
			car.drift = car.drift + 4;
		    }
		}
		

		// General car handeling when turning    
		if(car.left){
		    car.angle = car.angle - (car.handeling * car.speed/car.topSpeed);

		} else if(car.right){
		    car.angle = car.angle + (car.handeling * car.speed/car.topSpeed);    

		}
		
		
		// Use this div to display any info I need to see visually
		//$('#stats').html(car.drift+", "+car.x+", "+car.vx+", "+canvasWidth+", "+car.y+", "+car.vy+", "+canvasHeight);
		    
		
		// Constant application of friction / air resistance
		if(car.speed > 0){
		    car.speed = car.speed - car.friction;
		} else if(car.speed < 0) {
		    car.speed = car.speed + car.friction;
		}
		

		// Update car velocity (speed + direction)
		car.vy = -Math.cos(car.angle * Math.PI / 180) * car.speed;
		car.vx = Math.sin(car.angle * Math.PI / 180) * car.speed;    
		
		if(car.checkCanMove()) {
			// Plot the new velocity into x and y cords
			car.y = car.y + car.vy;
			car.x = car.x + car.vx;
		} else {
			car.speed=0;
			car.vx=0;
			car.vy=0;
		}
		
/*		car.x=Math.max(0,Math.min(car.x,canvasWidth));
		car.y=Math.max(0,Math.min(car.y,canvasHeight));
		if(car.x==0) { car.x=1; car.vx=0; car.vy=0; }
		if(car.y==0) { car.y=1; car.vx=0; car.vy=0; }
		if(car.x==canvasWidth) { car.x=canvasWidth-1; car.vx=0; car.vy=0; }
		if(car.y==canvasHeight) { car.y=canvasHeight-1; car.vx=0; car.vy=0; }
*/		
	    }

	this.corners=function() {

			// transformation matrix
			cornerCurvature=0.95;
			tm={
				base: { x: Math.sqrt(Math.pow(8,2)+Math.pow(16,2))*Math.cos(Math.atan(8/16)+Math.PI/2+this.angle*Math.PI/180),
					y: Math.sqrt(Math.pow(8,2)+Math.pow(16,2))*Math.sin(Math.atan(8/16)+Math.PI/2+this.angle*Math.PI/180) },
				d1: {   x: cornerCurvature*32*Math.cos(Math.PI/2-this.angle*Math.PI/180),
					y: cornerCurvature*32*Math.sin(Math.PI/2-this.angle*Math.PI/180)},
				d2: {   x: cornerCurvature*16*Math.cos(this.angle*Math.PI/180),
					y: cornerCurvature*16*Math.sin(this.angle*Math.PI/180)}
			};

			o=[
				// lower left
				{x: this.x+ 8+tm.base.x,
				 y: this.y+16+tm.base.y},
				// upper left
				{x: this.x+ 8+tm.base.x+tm.d1.x,
				 y: this.y+16+tm.base.y-tm.d1.y},
				// lower right
				{x: this.x+ 8+tm.base.x        +tm.d2.x,
				 y: this.y+16+tm.base.y        +tm.d2.y},
				// upper right
				{x: this.x+ 8+tm.base.x+tm.d1.x+tm.d2.x,
				 y: this.y+16+tm.base.y-tm.d1.y+tm.d2.y}
			];

			// include side midpoints to avoid getting stuck
			o.push({x:(o[0].x+o[1].x)/2,y:(o[0].y+o[1].y)/2});
			o.push({x:(o[3].x+o[1].x)/2,y:(o[3].y+o[1].y)/2});
			o.push({x:(o[2].x+o[3].x)/2,y:(o[2].y+o[3].y)/2});
			o.push({x:(o[0].x+o[2].x)/2,y:(o[0].y+o[2].y)/2});

			// return
			return o;
	}


    }
            

