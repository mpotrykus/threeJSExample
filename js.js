var renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myCanvas'), antialias:true, alpha: true});
renderer.setClearColor(0x999999, 0.0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//CAMERA
camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, .1, 100000 );
camera.position.z = -150;
camera.position.y = 50;

//CONTROLS
var controls = new THREE.TrackballControls(camera);
controls.rotateSpeed = 5.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = .1;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
//controls.dynamicDampingFactor = 0.3;
controls.keys = [ 65, 83, 68 ];
controls.addEventListener('change', render);
controls.target.set(0, 0, 0);

//SCENE
var scene = new THREE.Scene();
//scene.background = new THREE.Color( 0xcccccc );
scene.fog = new THREE.FogExp2( 0x4676c1, .009 );

//GLITCH FUNCTION
var glitchPass;
function updateOptions() {
	


}

//LIGHTS
 var lights = [];
lights[0] = new THREE.DirectionalLight( 0xffffff, 1 );
lights[0].position.set( 1, 0, 0 );
lights[1] = new THREE.DirectionalLight( 0x11E8BB, 2 );
lights[1].position.set( 0.75, 1, 0.5 );
lights[2] = new THREE.DirectionalLight( 0x8200C9, 2 );
lights[2].position.set( -0.75, -1, 0.5 );
lights[3] = new THREE.AmbientLight( 0x8200C9, 1 );
lights[3].position.set( -0.75, -.5, 0.5 );
scene.add( lights[0] );
scene.add( lights[1] );
scene.add( lights[2] );
scene.add( lights[3] );

//MATERIAL
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });
  
 var material1 = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true,side: THREE.DoubleSide } );

var geometry = new THREE.CubeGeometry(1.25, 1.25, 1.25);
var geometry1 = new THREE.IcosahedronGeometry(25, 1);
var geometry2 = new THREE.IcosahedronGeometry(30, 1);
var mesh = new THREE.Mesh(geometry, material);
var mesh1 = new THREE.Mesh(geometry1, material);
var mesh2 = new THREE.Mesh(geometry2, material1);
var cube = new THREE.Object3D();
var center = new THREE.Object3D();
var ring = new THREE.Object3D();
mesh.position.set(0, 0, 0);

scene.add(center);
scene.add(ring);
scene.add(cube);

center.add(mesh1);
ring.add(mesh2);

//FIND OBJECT POSITION
/*
scene.updateMatrixWorld(true);
var position = new THREE.Vector3();
position.getPositionFromMatrix( mesh.matrixWorld );
alert(position.x + ',' + position.y + ',' + position.z);
*/

//MULTI-MESH
for ( var i = 0; i < 6000; i ++ ) {
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.x = (Math.random() - 0.5) * 1000;
	mesh.position.y = (Math.random() - 0.5) * 1000;
	mesh.position.z = (Math.random() - 0.5) * 1000;
	mesh.rotation.x = (Math.random() - 0.5) * 1000;
	mesh.rotation.y = (Math.random() - 0.5) * 1000;
	mesh.updateMatrix();
	mesh.matrixAutoUpdate = false;
	cube.add(mesh);
}


controls = new THREE.TrackballControls( camera );
controls.target.set( 0, 0, 0 );
controls.minDistance = 35;
controls.maxDistance = 500;

//POST-PROCESSING
composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );
glitchPass = new THREE.GlitchPass();
glitchPass.renderToScreen = true;
composer.addPass( glitchPass );

updateOptions();

//WINDOW RESIZE
$(window).resize(function() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	controls.handleResize();
	render();
});

//ANIMATE LOOP

var delta = 0;
function animate() {
	
	requestAnimationFrame(animate);

	cube.rotation.x += .001;
	cube.rotation.y += .01;
	
	center.rotation.x += .005;
	center.rotation.y += .005;
	
	ring.rotation.x -= .005;
	ring.rotation.y += .005;
	
	/*
	delta += 0.1;
	geometry.vertices[0].x = Math.sin(delta) * 50;
	geometry.vertices[3].x = Math.sin(delta) * 50;
	geometry.vertices[5].x = Math.sin(delta) * 50;
	geometry.vertices[7].x = Math.sin(delta) * 50;
	geometry.verticesNeedUpdate = true;
	*/
	
	var time = Date.now();
	composer.render();
	
	//renderer.render(scene,camera);
	controls.update();
}

//RENDER LOOP
render();
animate();

function render() {
	
	requestAnimationFrame(render);

	renderer.render(scene, camera);
	
}