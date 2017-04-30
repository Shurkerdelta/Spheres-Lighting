// Varying Variables
varying vec3 V_Normal_WCS;
varying vec3 V_Position_WCS;

// Uniform Variables
uniform samplerCube cubemapUniform;
uniform sampler2D textureUniform;

void main() {
	
	// Calculate view ray direction, reflected view ray direction, and grab appropriate texel reflected view ray points to
	// NOTE: cameraPosition is available to all fragment shaders by default, value is camera position in WCS
	vec3 I = normalize(V_Position_WCS - cameraPosition);
	vec3 R = reflect(I, normalize(V_Normal_WCS));

	float cos45 = sqrt(2.0)/2.0;

	vec3 yLine = vec3(0.0,1.0,0.0);

	float Bx = abs(R.x);
	float By = abs(R.y);
	float Bz = abs(R.z);

	float Px = R.x/R.y;
	float Pz = R.z/R.y;

	vec4 fragColor = vec4(1.0,0.0,0.0,1.0);

	if(R.y > 0.0 && By > Bz && By > Bx ) { 
		
		float u = 0.5*(Px + 1.0);
		float v = 1.0 - 0.5*(Pz + 1.0);
		vec2 pos = vec2(u,v);
		
		fragColor = texture2D(textureUniform, pos);
		}
	else{
		fragColor = textureCube(cubemapUniform, R);
		}
	
	

	// !!!!!!!!!!!!!!COMPUTE AND OVERRIDE gl_fragColor(s) FOR TOP CUBE FACE USING CORRECT UV FROM PLANET TEXTURE!!!!!!!!!!!!!!
	// NOTE: You will know you have the correct results when you see a planet on the top of your sphere

    gl_FragColor = fragColor;
	}