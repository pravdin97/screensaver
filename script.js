
var
    canvas,
    width,
    height,
    ctx;

var bgImage;

var doneLoading = false;

var pSystem;


function init(){

    canvas = document.getElementById("myCanvas");
    canvas.width = width = 1280;
    canvas.height = height = 720;

    ctx = canvas.getContext('2d');

    bgImage = new Image();
    bgImage.src = "bg.jpg";
    bgImage.onload = function(){
        doneLoading = true;
    };

    pSystem = new ParticleSystem(300);
    pSystem.init();

    setInterval(function(){
        update(0.01);
        draw();
    },10);

}


function update(dt){
    pSystem.update(dt);
}

function draw(){

    if(!doneLoading) return;

    ctx.drawImage(bgImage,
        0,0,width,height,
        0,0,width,height);

    pSystem.draw();
}



function Particle(x,y,z,vx,vy,radius,color){
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;

    this.update = function(dt,projection){
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        var scale = projection/(projection + this.z);
        var screenMaxY = height/2 + ((this.y + this.radius) * scale);
        return screenMaxY < 0;
    };


}

function ParticleSystem(num){

    this.particles = [];
    this.projection = 100;

    this.createRandomParticles = function(){

        var z = 50 + Math.random() * 100;
        if(Math.random() < 0.8)
            z = 100 + Math.random() * 900;

        var size = 100;
        var vy = -100;
        var scale = this.projection/(this.projection + z);
        var dx = width/ (2 * scale);
        var y = height/(2 * scale) + size;

        return new Particle((Math.random() * 2 * dx) - dx,y,z,0,vy,size,getColor(Math.random(),Math.random(),Math.random()));
    };

    this.init = function(){
        for(var i = 0;i < num;i++)
            this.particles.push(this.createRandomParticles());
    };

    this.update = function(dt){
        for(var i = 0;i < this.particles.length;i++)
            if(this.particles[i].update(dt,this.projection))
                this.particles[i] = this.createRandomParticles();
    };
    this.draw = function(){
        ctx.globalCompositeOperation = "lighter";
        for(var i = 0;i < this.particles.length;i++){
            var p = this.particles[i];
            var scale = this.projection/(p.z + this.projection);

            var size = p.radius * scale;
            var screenX = (p.x*scale) + width/2;
            var screenY = (p.y*scale) + height/2;

            ctx.globalAlpha = Math.min(scale,1);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(screenX,screenY,size,0,6.28);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
    };


}

function getColor(r,g,b){
    return "rgb("+Math.floor(255 * r)+","+Math.floor(255 * g)+","+Math.floor(255 * b)+")";
}
