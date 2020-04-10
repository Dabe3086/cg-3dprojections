var view;
var ctx;
var scene;
var start_time;

// Initialization function - called when web page loads
function Init() {
    var w = 800;
    var h = 600;
    view = document.getElementById('view');
    view.width = w;
    view.height = h;

    ctx = view.getContext('2d');

    // initial scene... feel free to change this
    scene = {
        view: {
            type: 'parallel',
            prp: Vector3(44, 20, -16),
            srp: Vector3(20, 20, -40),
            vup: Vector3(0, 1, 0),
            clip: [-19, 5, -10, 8, 12, 100]
        },
        models: [
            {
                type: 'generic',
                vertices: [
                    Vector4( 0,  0, -30, 1),
                    Vector4(20,  0, -30, 1),
                    Vector4(20, 12, -30, 1),
                    Vector4(10, 20, -30, 1),
                    Vector4( 0, 12, -30, 1),
                    Vector4( 0,  0, -60, 1),
                    Vector4(20,  0, -60, 1),
                    Vector4(20, 12, -60, 1),
                    Vector4(10, 20, -60, 1),
                    Vector4( 0, 12, -60, 1)
                ],
                edges: [
                    [0, 1, 2, 3, 4, 0],
                    [5, 6, 7, 8, 9, 5],
                    [0, 5],
                    [1, 6],
                    [2, 7],
                    [3, 8],
                    [4, 9]
                ],
                matrix: new Matrix(4, 4)
            }

            /*
            {
                type: "cube",
                center: [500, 500, -10],
                width: 30,
                height: 30,
                depth: 30,
                matrix: new Matrix(4, 4)
            },
            */
        ]
    };

    // event handler for pressing arrow keys
    document.addEventListener('keydown', OnKeyDown, false);
    
    // start animation loop
    start_time = performance.now(); // current timestamp in milliseconds
    window.requestAnimationFrame(Animate);
}

// Animation loop - repeatedly calls rendering code
function Animate(timestamp) {
    // step 1: calculate time (time since start) 
    // step 2: transform models based on time
    // step 3: draw scene
    // step 4: request next animation frame (recursively calling same function)


    var time = timestamp - start_time;

    // ... step 2
    if (scene.type = "parallel") {

        //var m = new Matrix(4, 4);
        console.log(scene.models[0].matrix);
        Mat4x4MPar(scene.models[0].matrix);
        console.log(scene.models[0].matrix);

        Mat4x4Parallel(scene.models[0].matrix, scene.view.prp, scene.view.srp, scene.view.vup, scene.view.clip);
        console.log(scene.models[0].matrix);

    }


    DrawScene();

    window.requestAnimationFrame(Animate);
}

// Main drawing code - use information contained in variable `scene`
function DrawScene() {
    //console.log(scene);
    
    if(scene.view.type == 'parallel') {

        for (var i = 0; i < scene.models.length; i++) {
            
            if (scene.models[i].type == "generic") {
                
                for (var j = 0; j < scene.models[i].vertices.length; j++) {
                    console.log("hello");
                    var length = scene.models[i].vertices.length;
                    DrawLine(scene.models[i].vertices[j%length].x, scene.models[i].vertices[j%length].y, scene.models[i].vertices[(j+1)%length].x, scene.models[i].vertices[(j+1)%length].y);
                }
            }

            else if (scene.models[i].type == "cube") {
                var x = scene.models[i].center[0] - (scene.models[i].width / 2);
                var y = scene.models[i].center[1] - (scene.models[i].height / 2);
                var z = scene.models[i].center[2] - (scene.models[i].depth / 2);
                var v1 = Vector4(x, y, z, 1);
                var v2 = Vector4(x + scene.models[i].width, y, z, 1);
                var v3 = Vector4(x + scene.models[i].width, y, z + scene.models[i].depth, 1);
                var v4 = Vector4(x, y, z + scene.models[i].depth, 1);
                var v5 = Vector4(x, y + scene.models[i].height, z + scene.models[i].depth, 1);
                var v6 = Vector4(x + scene.models[i].width, y + scene.models[i].height, z + scene.models[i].depth, 1);
                var v7 = Vector4(x + scene.models[i].width, y + scene.models[i].height, z, 1);
                var v8 = Vector4(x, y + scene.models[i].height, z, 1);
                DrawLine(v1.x, v1.y, v2.x, v2.y);
                DrawLine(v2.x, v2.y, v3.x, v3.y);
                DrawLine(v3.x, v3.y, v4.x, v4.y);
                DrawLine(v4.x, v4.y, v1.x, v1.y);
                DrawLine(v1 .x, v1.y, v8.x, v8.y);
                DrawLine(v8 .x, v8.y, v7.x, v7.y);
                DrawLine(v7 .x, v7.y, v6.x, v6.y);
                DrawLine(v6 .x, v6.y, v5.x, v5.y);
                DrawLine(v5 .x, v5.y, v8.x, v8.y);
                DrawLine(v5 .x, v5.y, v4.x, v4.y);
                DrawLine(v6 .x, v6.y, v3.x, v3.y);
                DrawLine(v7 .x, v7.y, v2.x, v2.y);
            }
          
        }
    }
}

// Called when user selects a new scene JSON file
function LoadNewScene() {
    var scene_file = document.getElementById('scene_file');

    console.log(scene_file.files[0]);

    var reader = new FileReader();
    reader.onload = (event) => {
        scene = JSON.parse(event.target.result);
        scene.view.prp = Vector3(scene.view.prp[0], scene.view.prp[1], scene.view.prp[2]);
        scene.view.srp = Vector3(scene.view.srp[0], scene.view.srp[1], scene.view.srp[2]);
        scene.view.vup = Vector3(scene.view.vup[0], scene.view.vup[1], scene.view.vup[2]);

        for (let i = 0; i < scene.models.length; i++) {
            if (scene.models[i].type === 'generic') {
                for (let j = 0; j < scene.models[i].vertices.length; j++) {
                    scene.models[i].vertices[j] = Vector4(scene.models[i].vertices[j][0],
                                                          scene.models[i].vertices[j][1],
                                                          scene.models[i].vertices[j][2],
                                                          1);
                }
            }
            else {
                scene.models[i].center = Vector4(scene.models[i].center[0],
                                                 scene.models[i].center[1],
                                                 scene.models[i].center[2],
                                                 1);
            }
            scene.models[i].matrix = new Matrix(4, 4);
        }
    };
    reader.readAsText(scene_file.files[0], "UTF-8");
}

// Called when user presses a key on the keyboard down 
function OnKeyDown(event) {
    switch (event.keyCode) {
        case 37: // LEFT Arrow
            console.log("left");
            scene.view.prp.x = scene.view.prp.x - 1;
            scene.view.srp.x = scene.view.srp.x - 1;
            DrawScene();
            break;
        case 38: // UP Arrow
            console.log("up");
            break;
        case 39: // RIGHT Arrow
            console.log("right");
            scene.view.prp.x = scene.view.prp.x + 1;
            scene.view.srp.x = scene.view.srp.x + 1;
            DrawScene();
            break;
        case 40: // DOWN Arrow
            console.log("down");
            break;
    }
}

// Draw black 2D line with red endpoints 
function DrawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x1 - 2, y1 - 2, 4, 4);
    ctx.fillRect(x2 - 2, y2 - 2, 4, 4);
}
