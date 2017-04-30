// Texture.js

var TextureParams = function(gl)
{
    this.gl = gl;
    this.width = 128;
    this.height = 128;
    this.wrapS = gl.REPEAT;
    this.wrapT = gl.REPEAT;

//    this.magFilter = gl.LINEAR;
    this.magFilter = gl.NEAREST;

    this.minFilter = gl.NEAREST;
//    this.minFilter = gl.LINEAR;
//    this.minFilter = gl.NEAREST_MIPMAP_LINEAR;
//    this.minFilter = gl.LINEAR_MIPMAP_LINEAR;

    this.format = gl.RGBA;
    this.type = gl.UNSIGNED_BYTE;
}

var Texture = function(src, params)
{
    this.params = params;
    
    this.image = new Image();
    this.image.src = src;

    if (src != "")
    {
        this.buildTexFromSource(src);  
    }
    else
    {
        this.buildTex(src);
    }
}

Texture.prototype.bind = function(tex_slot)
{
    gl.activeTexture(tex_slot);
    gl.bindTexture(gl.TEXTURE_2D, this.glTex);
}

Texture.prototype.buildTex = function () {
    this.glTex = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, this.glTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.params.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.params.wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.params.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.params.minFilter);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.params.format, this.params.width, this.params.height,
                  0, this.params.format, this.params.type, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

Texture.prototype.buildTexFromSource = function ()
{
    var tex_obj = this;
    this.image.onload = function() {
        tex_obj.handleLoadedTexture();
    }
}

Texture.prototype.handleLoadedTexture = function ()
{
    this.glTex = gl.createTexture();

    this.params.width = this.image.width;
    this.params.height = this.image.height;

    gl.bindTexture(gl.TEXTURE_2D, this.glTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.params.format, this.params.format,
                    this.params.type, this.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.params.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.params.wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.params.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.params.minFilter);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}
