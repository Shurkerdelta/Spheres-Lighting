Thomas Coleman
27963140


Leaving what I was doing to find the type face till I noticed where it specified what it should be in the notes

float cos45 = sqrt(2.0)/R);

	
	
vec3 yLine = vec3(0.0,1.0,0.0);

	
float lenR = length(R);
float angleR = dot(yLine,R) / lenR;
	

if(R.y > 0.0 && angleR > cos45)

yeah spent about 5 hours wasting time trying to caluclate and figure out what it should be... well I got close so I I guess learning so not waste... though less time for creative stuff



Investigating how to colour the sphere differently: Project Sapphire
From the uniform values it seems that we can only affect the colour of the light... so the shaders seem to be resonsible for some of the chractersitics of the sphere's material 
Maybe there is a way to change the colour of the material without changing the shader
Will try to see if there is some function that I am missing

Going to have to try and alter shaders, was basing this one of phong so I can just use that VS, to min cluster

ambient seems like it is the colour of the object?
ambient is for default so incorrect about that.
Whole system seems based on what the material relflects... 
ie. Can't make it blue have to make it so the light coming from it is more blue

And blue!!



Floating Spheres: Project Ruby
Goal is to have the spheres floating around and readusting the lightDirection based on where they are currently

Trying to base off of animation for horse, but running into trouble....
Somthing is breaking in the CheckKeyboard() function
seems to be the switch (mode) part..... it was never created..... arghhh so much wasted time on... 

Spheres all moving


4/7/2016
(-150,249.249) rough location of light if 1 = 500, so sphere moving 50 will change light by 0.1 at most

Have to look carefully to actually notice the adjustment, as it might just work too well. :P

Moons around the Ruby: Project Emerald
Don't seem to change as they move around, but I am happy with it for now.

Commands
"1" - all spheres orbit
"2" - just emerald obrit
"3" - just ruby gem orbits