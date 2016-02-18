
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create,  preRender: preRender, render: render});

function preload() {

    
    game.load.audio('song', ['assets/song.mp3', 'assets/song.ogg']);
    game.load.image('gummi', 'wip/gummi.png');
    game.load.image('beer', 'assets/beer.png');
    game.load.image('hand', 'assets/hand.png');
    game.load.image('background', 'assets/background.jpg');
    game.load.image('division', 'assets/division.jpg');
    game.load.spritesheet('person', 'assets/person.png', 120, 182);

}

var beer;
var line;
var divison;
var mouseBody;
var mouseSpring;
var drawLine = false;

var score = 0;
var music;
var scoreText;

function create() {
        
    
    
     music = game.add.audio('song');

    music.play();

    game.add.sprite(0, 0, 'background');
    division = game.add.sprite(0, 300, 'division');
    division.scale.setTo(1, 0.5);
    
    scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    
    var person = game.add.sprite(0, 0, 'person');
    person.scale.setTo(0.5,0.5);
    
    
    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
    var walk = person.animations.add('walk');

    //  And this starts the animation playing by using its key ("walk")
    //  30 is the frame rate (30fps)
    //  true means it will loop when it finishes
    person.animations.play('walk', 3, true);

   
    game.add.tween(person).to({ x: 800 }, 5000, Phaser.Easing.Quadratic.InOut, true, 0, 3000, false);
    
    
    
    

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 100;
    game.physics.p2.restitution = 0.8;

    //  Create an object to pick-up

    beer = game.add.sprite(200, 200, 'beer');
    beer.scale.setTo(0.2, 0.2);
    // game.physics.p2.enable(beer, false);
    game.physics.p2.enable(beer, true);
    beer.body.setCircle(15);

    //  Create our Mouse hand / Spring

    mouseBody = game.add.sprite(100, 100, 'hand');
    mouseBody.scale.setTo(0.1, 0.1);
    mouseBody
    game.physics.p2.enable(mouseBody, true);
    mouseBody.body.static = true;
    mouseBody.body.setCircle(10);
    mouseBody.body.data.shapes[0].sensor = true;

    //  Debug spring line

    line = new Phaser.Line(beer.x, beer.y, mouseBody.x, mouseBody.y);

    game.input.onDown.add(click, this);
    game.input.onUp.add(release, this);
    game.input.addMoveCallback(move, this);

}

function beerHitPerson (obj1, obj2) 
{
    
    score += 1;

    scoreText.text = 'score: ' + score;

}

function click(pointer) {

    var bodies = game.physics.p2.hitTest(pointer.position, [ beer.body ]);
    
    if (bodies.length)
    {
        //  Attach to the first body the mouse hit
        mouseSpring = game.physics.p2.createSpring(mouseBody, bodies[0], 0, 30, 1);
        line.setTo(beer.x, beer.y, mouseBody.x, mouseBody.y);
        drawLine = true;
    }

}

function release() {

    game.physics.p2.removeSpring(mouseSpring);

    drawLine = false;

}

function move(pointer, x, y, isDown) {

    mouseBody.body.x = x;
    mouseBody.body.y = y;
    line.setTo(beer.x, beer.y, mouseBody.x, mouseBody.y);

}

function preRender() {

   
    if (line)
    {
        line.setTo(beer.x, beer.y, mouseBody.x, mouseBody.y);
    }

}

function render() {

    //game.physics.arcade.overlap(beer, person, beerHitPerson, null, this);
    if (drawLine)
    {
        game.debug.geom(line);
         
    }
    
}

