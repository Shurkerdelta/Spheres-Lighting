// camera.js
var Camera = function()
{
}

Camera.PERSPECTIVE = 0;
Camera.ORTHOGONAL = 1;

Camera.prototype.buildPerspectiveCam = function(fovy, aspect, near, far,
                                               eyeX, eyeY, eyeZ,
                                               centerX, centerY, centerZ,
                                               upX, upY, upZ)
{
    this.projType = Camera.PERSPECTIVE;
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;

    this.eye = new Vector4([eyeX, eyeY, eyeZ, 1]);
    this.center = new Vector4([centerX, centerY, centerZ, 1]);
    this.up = new Vector4([upX, upY, upZ, 1]);
}

Camera.prototype.buildOrthogonalCam = function(left, right, bottom, top, near, far,
                                               eyeX, eyeY, eyeZ,
                                               centerX, centerY, centerZ,
                                               upX, upY, upZ)
{
    this.projType = Camera.ORTHOGONAL;
    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.top = top;
    this.near = near;
    this.far = far;

    this.eye = new Vector4([eyeX, eyeY, eyeZ, 1]);
    this.center = new Vector4([centerX, centerY, centerZ, 1]);
    this.up = new Vector4([upX, upY, upZ, 1]);
}

Camera.prototype.getViewMatrix = function()
{
    var view_mat = new Matrix4();
    view_mat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
                       this.center.elements[0], this.center.elements[1], this.center.elements[2],
                       this.up.elements[0], this.up.elements[1], this.up.elements[2]);

    return view_mat;
}

Camera.prototype.getInvViewMatrix = function()
{
    // computes the inverse view matrix
    var inv_view_mat = new Matrix4();
    inv_view_mat.setLookAt(0, 0, 0,
                       this.center.elements[0] - this.eye.elements[0],
                       this.center.elements[1] - this.eye.elements[1],
                       this.center.elements[2] - this.eye.elements[2],
                       this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    inv_view_mat = inv_view_mat.transpose();

    inv_view_mat.elements[12] = this.eye.elements[0];
    inv_view_mat.elements[13] = this.eye.elements[1];
    inv_view_mat.elements[14] = this.eye.elements[2];
    
    return inv_view_mat;
}


Camera.prototype.getProjectionMatrix = function () {
    var proj_mat = new Matrix4();

    switch(this.projType)
    {
        case Camera.PERSPECTIVE:
            proj_mat.setPerspective(this.fovy, this.aspect, this.near, this.far);
            break;
        case Camera.ORTHOGONAL:
            proj_mat.setOrtho(this.left, this.right, this.bottom, this.top, this.near, this.far);
            break;
        default:
            throw 'Invalid Camera Type';
            break;
    }

    return proj_mat;
}

Camera.prototype.rotate = function (angle, x, y, z) {
    var rot_mat = new Matrix4();
    rot_mat.setRotate(angle, x, y, z);

    var delta = new Vector3([this.eye.elements[0] - this.center.elements[0],
                            this.eye.elements[1] - this.center.elements[1],
                            this.eye.elements[2] - this.center.elements[2]]);
    delta = rot_mat.multiplyVector3(delta);

    this.eye.elements[0] = this.center.elements[0] + delta.elements[0];
    this.eye.elements[1] = this.center.elements[1] + delta.elements[1];
    this.eye.elements[2] = this.center.elements[2] + delta.elements[2];
}

Camera.prototype.translate = function (x, y, z) {
    this.eye.elements[0] = this.eye.elements[0] + x;
    this.eye.elements[1] = this.eye.elements[1] + y;
    this.eye.elements[2] = this.eye.elements[2] + z;

    this.center.elements[0] = this.center.elements[0] + x;
    this.center.elements[1] = this.center.elements[1] + y;
    this.center.elements[2] = this.center.elements[2] + z;
}