// mesh fragment shader
#ifdef GL_ES
	precision mediump float;
#endif

uniform vec4 u_FragColor;
uniform sampler2D u_AlbedoTex;

varying vec4 v_ViewPosition;
varying vec4 v_ViewNormal;
varying vec2 v_TexCoord;

void main() {
       float r = 0.8;
       vec2 iResolution = vec2(800,600);
       vec2 uv = gl_FragCoord.xy / iResolution.xy;    // compute fragment coords, in [0,1]
       vec2 p = uv * 2.0 - 1.0;                       // compute NDCS coords

       vec4 black = vec4(0,0,0,1);
       vec4 white = vec4(1,1,1,1);
       vec4 colour = black;        // default colour, for fragments outside the ellipse

         // TODO:  compute f as an implicit equation, such that f(p.x, p.y) > 0 for
         //   fragments that are inside the ellipse.
       float f = 0.9 - (p.x)*(p.x) - (p.y)*(p.y);

       if (f>0.0) {        // inside?
         vec4 texColour = texture2D(u_AlbedoTex, v_TexCoord);    // retrieve the texture map colour

         // TODO:  multiply the texture colour by the default colour to obtain a colour-tinted version of the texture
         //     The default colour is given by   u_FragColor.
         //     Assign the output to tempColour, which will then later be used to add a fog effect (see below)

         vec4 tempColour = texColour;

         // OPTIONAL: computing Fog
         // compute the "fogAmount", in the range [0,1], based on the viewing distance, 
         //       as given by v_ViewPosition.z
         // The bunny is located approximately 35 units away from the eye, i.e., at z_vcs = -35.
         // I suggest implementing fogAmount as a linear function of the viewing distance, with
         // clamping in order to stay in the range [0,1].  See   http://www.shaderific.com/glsl-functions/
         // for a built-in "clamp" function.  -- Michiel

         float fogAmount = 0.0;
         colour = fogAmount*white + (1.0-fogAmount)*tempColour;
       }

         //gl_FragColor = colour;     // make final colour assignment to pixel
		 gl_FragColor = u_FragColor * colour;
}


