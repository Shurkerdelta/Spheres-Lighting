// ShaderProgram.js
var ShaderProgram = function () {
    this.program = null;
    this.gl = null;
    this.uniforms = {};
    this.attributes = {};
    this.loaded = false;
}

ShaderProgram.invalidShaderHandle = -1;

ShaderProgram.prototype.loadShaderSource = function(fileName, src_buffer, load_callback) {
    var request = new XMLHttpRequest();
    var s = this;

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status !== 404) {
            src_buffer.str = request.responseText;
            s.handleLoadedShader(load_callback);
        }
    }
    request.open('GET', fileName, true); // Create a request to acquire the file
    request.overrideMimeType("text/plain");
    request.send();                      // Send the request
}

ShaderProgram.prototype.handleLoadedShader = function (load_callback) {
    complete = true;
    complete &= ((this.vs_source != undefined) && (this.vs_source.str != null));
    complete &= ((this.fs_source != undefined) && (this.fs_source.str != null));

    if (complete)
    {
        this.program = createProgram(this.gl, this.vs_source.str, this.fs_source.str);
        if (!this.program) {
            console.log('Failed to create program');
        }
        else
        {
            this.loaded = true;
            load_callback();
        }
    }
}

ShaderProgram.prototype.Build = function (gl, vs_file, fs_file, load_callback) {
    this.gl = gl;

    // read in shaders with async calls
    this.vs_source = {str: null};
    this.fs_source = {str: null};
    this.loadShaderSource(vs_file, this.vs_source, load_callback);
    this.loadShaderSource(fs_file, this.fs_source, load_callback);
}

ShaderProgram.prototype.SetupUniform = function(uni_name)
{
    this.Bind();
    var handle = gl.getUniformLocation(gl.program, uni_name);
    if (!handle) {
        console.log('Failed to get the storage location of uniform: ' + uni_name);
        return;
    }

    this.uniforms[uni_name] = handle;
}

ShaderProgram.prototype.SetupAttribute = function (atr_name)
{
    this.Bind();
    var handle = gl.getAttribLocation(gl.program, atr_name);
    if (handle == ShaderProgram.invalidShaderHandle) {
        console.log('Failed to get the storage location of attribute: ' + atr_name);
        return;
    }

    this.attributes[atr_name] = handle;
}

ShaderProgram.prototype.Bind = function()
{
    if (!this.program)
    {
        console.log('Trying to bind an invalid shader');
        this.gl.useProgram(null);
    }
    else
    {
        this.gl.useProgram(this.program);
        this.gl.program = this.program;
    }
}

ShaderProgram.prototype.getViewMatrix = function()
{
}