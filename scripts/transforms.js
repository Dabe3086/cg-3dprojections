// set values of mat4x4 to the parallel projection / view matrix
function Mat4x4Parallel(mat4x4, prp, srp, vup, clip) {
    var transform = [];
    transform[5] = mat4x4;
    // 1. translate PRP to origin
    transform[4] = Mat4x4Translate(mat4x4, -prp.x, -prp.y, -prp.z);
    // 2. rotate VRC such that (u,v,n) align with (x,y,z)
    var n = (prp - srp).normalize;
    var u = (vup - n).normalize;
    var v = n.mult(v);
    var vrc = (n = n, u = u, v = v);
    var rotateMatrix = [[vrc.u[0], vrc.u[1], vrc.u[2], 0],
                        [vrc.v[0], vrc.v[1], vrc.v[2], 0],
                        [vrc.n[0], vrc.n[1], vrc.n[2], 0],
                        [       0,        0,        0, 1]];
    transform[3] = rotateMatrix;
    // 3. shear such that CW is on the z-axis
    var cw = (((clip[2] + clip[3])/2),((clip[0] + clip[1])/2));
    var dop = cw - prp;
    transform[2] = Mat4x4ShearXY(mat4x4, (-dop.x / dop.z), dop.y / dop.z);
    // 4. translate near clipping plane to origin
    transform[1] = Mat4x4Translate(mat4x4, tx, ty, clip[4]);
    // 5. scale such that view volume bounds are ([-1,1], [-1,1], [-1,0])
    var sparx = 2/(clip[1] -clip[0]);
    var spary = 2/(clip[3] -clip[2]);
    var sparz = 1/(clip[4] -clip[5]);
    transform[0] = mat4x4Scale(mat4x4, sparx, spary, sparz);
    transformation = Matrix.multiply(transform);
    mat4x4.values = transformation.values;
}

// set values of mat4x4 to the perspective projection / view matrix
function Mat4x4Projection(mat4x4, prp, srp, vup, clip) {
    var transform = [];
    transform[4] = mat4x4;
    // 1. translate PRP to origin
    transform[3] = Mat4x4Translate(mat4x4, -prp.x, -prp.y, -prp.z);
    // 2. rotate VRC such that (u,v,n) align with (x,y,z)
    var n = (prp - srp).normalize;
    var u = (vup - n).normalize;
    var v = n.mult(v);
    var vrc = (n = n, u = u, v = v);
    var rotateMatrix = [[vrc.u[0], vrc.u[1], vrc.u[2], 0],
                        [vrc.v[0], vrc.v[1], vrc.v[2], 0],
                        [vrc.n[0], vrc.n[1], vrc.n[2], 0],
                        [       0,        0,        0, 1]];
    transform[2] = rotateMatrix;
    // 3. shear such that CW is on the z-axis
    var cw = (((clip[2] + clip[3])/2),((clip[0] + clip[1])/2));
    var dop = cw - prp;
    transform[1] = Mat4x4ShearXY(mat4x4, (-dop.x / dop.z), dop.y / dop.z);
    // 4. scale such that view volume bounds are ([z,-z], [z,-z], [-1,zmin])
    var sperx = ((2 * clip[4])/((clip[1]-clip[0])* clip[5]));
    var spery = ((2 * clip[4])/((clip[3] -clip[2])* clip[5]));
    var sperz = 1/clip[5];
    transform[0] = mat4x4Scale(mat4x4, sperx, spery, sperz);
    transformation = Matrix.multiply(transform);
    mat4x4.values = transformation.values;
}

// set values of mat4x4 to project a parallel image on the z=0 plane
function Mat4x4MPar(mat4x4) {
    mat4x4.values = [[1, 0, 0, 0],
                     [0, 1, 0, 0],
                     [0, 0, 0, 0],
                     [0, 0, 0, 1]];
}

// set values of mat4x4 to project a perspective image on the z=-1 plane
function Mat4x4MPer(mat4x4) {
    // mat4x4.values = ...;
    mat4x4.values = [[1, 0, 0, 0],
                     [0, 1, 0, 0],
                     [0, 0, 1, 0],
                     [0, 0, -1, 1]];

}



///////////////////////////////////////////////////////////////////////////////////
// 4x4 Transform Matrices                                                         //
///////////////////////////////////////////////////////////////////////////////////

// set values of mat4x4 to the identity matrix
function Mat4x4Identity(mat4x4) {
    mat4x4.values = [[1, 0, 0, 0],
                     [0, 1, 0, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
}

// set values of mat4x4 to the translate matrix
function Mat4x4Translate(mat4x4, tx, ty, tz) {
    mat4x4.values = [[1, 0, 0, tx],
                     [0, 1, 0, ty],
                     [0, 0, 1, tz],
                     [0, 0, 0, 1]];
}

// set values of mat4x4 to the scale matrix
function Mat4x4Scale(mat4x4, sx, sy, sz) {
    mat4x4.values = [[sx,  0,  0, 0],
                     [ 0, sy,  0, 0],
                     [ 0,  0, sz, 0],
                     [ 0,  0,  0, 1]];
}

// set values of mat4x4 to the rotate about x-axis matrix
function Mat4x4RotateX(mat4x4, theta) {
    mat4x4.values = [[1,               0,                0, 0],
                     [0, Math.cos(theta), -Math.sin(theta), 0],
                     [0, Math.sin(theta),  Math.cos(theta), 0],
                     [0,               0,                0, 1]];
}

// set values of mat4x4 to the rotate about y-axis matrix
function Mat4x4RotateY(mat4x4, theta) {
    mat4x4.values = [[ Math.cos(theta), 0, Math.sin(theta), 0],
                     [               0, 1,               0, 0],
                     [-Math.sin(theta), 0, Math.cos(theta), 0],
                     [0, 0, 0, 1]];
}

// set values of mat4x4 to the rotate about z-axis matrix
function Mat4x4RotateZ(mat4x4, theta) {
    mat4x4.values = [[Math.cos(theta), -Math.sin(theta), 0, 0],
                     [Math.sin(theta),  Math.cos(theta), 0, 0],
                     [              0,                0, 1, 0],
                     [              0,                0, 0, 1]];
}

// set values of mat4x4 to the shear parallel to the xy-plane matrix
function Mat4x4ShearXY(mat4x4, shx, shy) {
    mat4x4.values = [[1, 0, shx, 0],
                     [0, 1, shy, 0],
                     [0, 0,   1, 0],
                     [0, 0,   0, 1]];
}

// create a new 3-component vector with values x,y,z
function Vector3(x, y, z) {
    let vec3 = new Vector(3);
    vec3.values = [x, y, z];
    return vec3;
}

// create a new 4-component vector with values x,y,z,w
function Vector4(x, y, z, w) {
    let vec4 = new Vector(4);
    vec4.values = [x, y, z, w];
    return vec4;
}
