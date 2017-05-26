# TunariWebClient
Tunari Web Client

To set up TunariWebClient you need to run:

- npm install
- bower install
- Copy your local.env.sample.js to create an local.env.js and 
  modify with your configs.
- If you do not have grunt installed globally run: npm install -g grunt-cli  
- grunt serve

# To deploy TunariWebClient

Repository on git is configured to deploy to heroku every merge to master.

Before merging to master you need to take care of a couple of things:

- If you add some style file or a javascript dependency you need to add it in the grunt file.
- After that run grunt tvsBuild.
- To test de builded project run npm start.

# About imgServer

- If for some reason you do't see images in tunariwebclient could be related
  to the browser trying to access to an insecure source. Try opening in a
  seperate tab the image in the browser and accept the resource.