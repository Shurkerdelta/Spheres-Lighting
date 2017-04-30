// mesh.js

var Mesh = function(gl) {    
this.gl = gl;
    this.loaded = true;

    this.vertices =
    {
        glBuffer: null,
        numItems: 0,
        itemSize: 3,
        format: this.gl.FLOAT
    };

    this.texcoords =
    {
        glBuffer: null,
        numItems: 0,
        itemSize: 2,
        format: this.gl.FLOAT
    };

    this.normals =
    {
        glBuffer: null,
        numItems: 0,
        itemSize: 3,
        format: this.gl.FLOAT
    };

    this.colours =
    {
        glBuffer: null,
        numItems: 0,
        itemSize: 4,
        format: this.gl.FLOAT
    };

    this.indices =
    {
        glBuffer: null,
        numItems: 0,
        itemSize: 3, // indices should specify triangles
        format: this.gl.UNSIGNED_SHORT
    };
}

// methods for setting and create the buffer objects
Mesh.prototype.setVertices = function(data) 
{
    this.setBuffer(data, this.gl.ARRAY_BUFFER, Float32Array, this.vertices);
}

Mesh.prototype.setTexCoords = function (data) {
    this.setBuffer(data, this.gl.ARRAY_BUFFER, Float32Array, this.texcoords);
}

Mesh.prototype.setNormals = function(data) {
    this.setBuffer(data, this.gl.ARRAY_BUFFER, Float32Array, this.normals);
}

Mesh.prototype.setColours = function(data) {
    this.setBuffer(data, this.gl.ARRAY_BUFFER, Float32Array, this.colours);
}

Mesh.prototype.setIndices = function(data) {
    this.setBuffer(data, this.gl.ELEMENT_ARRAY_BUFFER, Uint16Array, this.indices);
}

// bind methods for drawing
Mesh.prototype.bindVertices = function(attrib)
{
    this.bindArrayBuffer(attrib, this.vertices);
}

Mesh.prototype.bindTexCoords = function(attrib)
{
    this.bindArrayBuffer(attrib, this.texcoords);
}

Mesh.prototype.bindNormals = function(attrib)
{
    this.bindArrayBuffer(attrib, this.normals);
}

Mesh.prototype.bindColours = function(attrib)
{
    this.bindArrayBuffer(attrib, this.colours);
}


Mesh.prototype.bindIndices = function() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices.glBuffer);
}

Mesh.prototype.draw = function() {
    if (this.indices.glBuffer == null) {
        console.log('Cannot draw mesh with invalid index buffer');
    }
    else
    {
        this.bindIndices();
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.numItems * this.indices.itemSize, this.gl.UNSIGNED_SHORT, 0);
    }
}

Mesh.prototype.setBuffer = function(data, buffer_type, array_type, buffer) {
    var num_elements = data.length;

    if (num_elements % buffer.itemSize != 0) {
        console.log('vertex data is improperly formatted: total number of elements should be a multiple of ' + buffer.itemSize);
        num_elements = Math.floor(num_elements / buffer.itemSize) * buffer.itemSize;
    }

    if (buffer.glBuffer == null) {
        buffer.glBuffer = this.gl.createBuffer();
    }

    this.gl.bindBuffer(buffer_type, buffer.glBuffer);
    this.gl.bufferData(buffer_type, new array_type(data), this.gl.STATIC_DRAW);

    // store the number of items
    var num_elements = data.length;
    buffer.numItems = Math.floor(num_elements / buffer.itemSize);
}

Mesh.prototype.bindArrayBuffer = function(attrib, buffer) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.glBuffer);
    this.gl.vertexAttribPointer(attrib, buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(attrib);
}

Mesh.prototype.loadMesh = function (src) {
    var m = this;
    handle_complete = function (objDoc) {
        var draw_info = objDoc.getDrawingInfo();

        m.setVertices(draw_info.vertices);
        m.setNormals(draw_info.normals);
        m.setTexCoords(draw_info.texcoords);
        m.setColours(draw_info.colors);
        m.setIndices(draw_info.indices);

        m.loaded = true;
    }

    // Start reading the OBJ file
    this.loaded = false;
    readOBJFile(src, 1, true, handle_complete);
}
