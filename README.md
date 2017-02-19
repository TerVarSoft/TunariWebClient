# TunariWebClient
Tunari Web Client

To set up TunariWebClient you need to run:

- npm install
- bower install
- Copy your local.env.sample.js to create an local.env.js and 
  modify with your configs.
- grunt serve

# To deploy TunariWebClient

Repository on git is configured to deploy to heroku every merge to master.

Before merging to master you need to take care of a couple of things:

- If you add some style file or a javascript dependency you need to add it in the grunt file.
- After that run grunt tvsBuild.
- To test de builded project run npm start.