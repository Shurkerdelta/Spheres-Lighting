// Varying Variables
varying vec3 V_Normal_WCS;
varying vec3 V_Position_WCS;

void main() {

	// Calculate Normal and Vertex Position in world coordinates
	V_Normal_WCS = vec3(modelMatrix * vec4(normal, 0.0));
   	V_Position_WCS = vec3(modelMatrix * vec4(position, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}