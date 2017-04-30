// Varying Variables
varying vec3 V_Normal_VCS;
varying vec3 V_ViewPosition_VCS;

void main() {

	// !!!!!!!!!!!!!!ADJUST THESE VARIABLES TO PASS PROPER DATA TO THE FRAGMENTS!!!!!!!!!!!!!!
	V_Normal_VCS = normalMatrix * normal;
	V_ViewPosition_VCS = vec3(modelViewMatrix * vec4(position, 1.0));
   
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}