Physics(function (world) {
  // bounds of the window
  var viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight),
      edgeBounce,
      renderer;
  // create and add a renderer
  renderer = Physics.renderer('canvas', {
      el: 'viewport'
  });
  world.add(renderer);
  // render on each step
  world.on('step', function () {
      world.render();
  });
  // constrain objects to these bounds
  edgeBounce = Physics.behavior('edge-collision-detection', {
      aabb: viewportBounds,
      restitution: 0.5,
      cof: 0.3
  });
  // resize events, when the window size changes 
  window.addEventListener('resize', function () {
      // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
      viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
      // update the boundaries
      edgeBounce.setAABB(viewportBounds);
  }, true);
  // create some bodies
  var smallBall = Physics.body('circle', {
      x: renderer.width / 2,
      y: renderer.height / 2 - 140,
      vx: -0.15,
      mass: 0.4,
      radius: 20,
      styles: {
          fillStyle: '#cb4b16',
          angleIndicator: '#72240d'
      }
  });
  world.add(smallBall);

  var bigBall = Physics.body('circle', {
      x: renderer.width / 2,
      y: renderer.height / 2,
      radius: 50,
      mass: 4,
      friction: 1,
      vx: 0.007,
      vy: 0,
      styles: {
          fillStyle: '#6c71c4',
          angleIndicator: '#3b3e6b'
      }
  });
  world.add(bigBall);

  // add some fun interaction
  var attractor = Physics.behavior('attractor', {
    order: 1,
    strength: 1,
    //max: 200
  });
  world.on({
    'interact:poke': function( pos ){
        world.wakeUpAll();
        attractor.position( pos );
        world.add( attractor );
    },
    'interact:move': function( pos ){
        attractor.position( pos );
    },
    'interact:release': function(){
        world.wakeUpAll();
        world.remove( attractor );
    }
  });
  // add things to the world
  world.add([
      Physics.behavior('interactive', { 
        el: renderer.container
      }),
      Physics.behavior('newtonian', {
        strength: 1 
      }),
      Physics.behavior('body-impulse-response'),
      //Physics.behavior('constant-acceleration', {
      //  acc: { x : 0, y: -0.000 } }),
      edgeBounce
  ]);

  // subscribe to ticker to advance the simulation
  Physics.util.ticker.on(function( time ) {
      world.step( time ); 
      // update xy coords of the smallBall
      var xBall = smallBall._sleepPosMean.x;
      var yBall = smallBall._sleepPosMean.y;
      var line = Physics.body('point', {
        x: xBall,
        y: yBall,
        mass: 0.00000000000000001,
        treatment: 'static',
        radius: 2,
        styles: {
          fillStyle: 'white',
        }
      });
      world.add(line);   
    });

});
