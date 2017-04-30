// mesh vertex shader
attribute vec4 a_Position;
attribute vec4 a_Normal;
attribute vec2 a_TexCoord;

uniform mat4 u_ModelViewMatrix;
uniform mat4 u_ProjectionMatrix;
uniform float u_DistortionTime;
uniform float u_DistortionAmp;
        
varying vec4 v_ViewPosition;
varying vec4 v_ViewNormal;
varying vec2 v_TexCoord;

void main() {
    // most vector info will be converted to view space

    //  TODO:  modify the following assignment to newPosition
    //    to produce a distorted version of the geometry
    //    The amount of distortion is given by   u_DistortionAmp.
    //    The distortion should be a function of position as well as time, i.e., u_DistortionTime.
    //    Trigonometric functions are a simple way of accomlishing this.

   

   float yoffset = 0.0;
   float xoffset = 0.0;
   if (a_Position.y>0.14){
		yoffset = u_DistortionAmp*0.2*(1.0+sin(3.0*u_DistortionTime));
   }
   if (a_Position.x<0.0){
		xoffset = u_DistortionAmp*0.2*(-1.0-sin(5.0*u_DistortionTime + 1.0));
   }

   vec4 newPosition = vec4(a_Position.x + xoffset, a_Position.y + yoffset, a_Position.z, 1.0);

   vec4 view_pos = u_ModelViewMatrix * newPosition;
   vec4 proj_pos = u_ProjectionMatrix * view_pos;
 
     // variable attributes, to be interpolated across triangle, used by fragment shader
   v_ViewPosition = vec4(view_pos.xyz, 1);    // vertex location in VCS
   v_TexCoord = a_TexCoord;                   // u,v texture coordinates
            
   gl_Position = proj_pos;     // final assigned vertex position (in CCS)
}
