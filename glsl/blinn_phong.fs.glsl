// Varying Variables
varying vec3 V_Normal_VCS;
varying vec3 V_ViewPosition_VCS;

// Uniform Variables
uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform vec3 lightDirectionUniform;

uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;

uniform float shininessUniform;

void main() {

	// Pre-Calculations: Normal Vector, Light Direction, View Direction & Halfway Vector
	vec3 N = normalize(V_Normal_VCS);
	vec3 L = normalize(vec3(viewMatrix * vec4(lightDirectionUniform, 0.0)));
	vec3 V = normalize(vec3(0.0) - V_ViewPosition_VCS);
	vec3 H = normalize((V + L) * 0.5);

	// Ambient Component
	vec3 light_AMB = ambientColorUniform * kAmbientUniform;

	// Diffuse Component
	vec3 diffuse = kDiffuseUniform * lightColorUniform;
	vec3 light_DFF = diffuse * max(0.0, dot(N, L));

	// Specular Component
	vec3 specular = kSpecularUniform * lightColorUniform;
	vec3 light_SPC = specular * pow(max(0.0, dot(H, N)), shininessUniform);

	// Total Lighting
	vec3 TOTAL = light_AMB + light_DFF + light_SPC;
	gl_FragColor = vec4(TOTAL, 0.0);
	}