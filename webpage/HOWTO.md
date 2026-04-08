# How to Deploy to Prod: for IDG2671 2026

## Docker and Docker Hub
- Create a profile on Docker Hub
- Create a repository on Docker Hub for your project (it can be several repositories, e.g. one for backend and one for frontend)
- Once you have a repository, you can publish your Docker images there, and these images can be deployed on Prod

## Setting up the Environment on Prod
- Obtain login credential for Prod (your NTNU credentials should work - if not, contact Aliaksei)
- SSH into [your-ntnu-username]@ai-research.it.ntnu.no
- You should have received the login credentials for your team user as an announcement on Canvas
The message contains 4 pieces of info:
    - **username** (should be somethine like team[N])
    - **pwd** (4 characters) <-- You can change it if you want, but let the rest of the team know
    - **port** number that your application (frontend) should run on
    - **another port number** (e.g. for backend) for the 2nd piece of your application to run on
- Switch to the team user with the `su teamName` command (you'll be prompted for pwd after this)
    - The team user is necessary for you to have access right to the home folder
    - Check if your team's docker instance is running with `docker info` and with `docker run hello-world`
- Set up the deployment directory for your application
    - Create a directory (something like, "~/app") with `mkdir [directory-name]`
    - Upload in that directory your secrets (a file with all the pwds and auth tokens/keys and so on) <-- You should do this manually, so all these secret details are not passing through anything that's published, i.e. they are not on github, nor in dockerhub. These details may also be different for your local VS prod environment.
        - Add in directory: secrets
        - ls to see all files
        - create new file example: nano db.secret.env
    - Create a deployment script (e.g. deploy.sh) that contains bash to pull the images from DockerHub adn start the project

## Create a remote-compose.yaml file
This file contains instructions to Docker Compose to be run on the server - it's different from what you had in your local compose.yaml

Copy/paste and modify your compose.yaml into remote-compose.yaml
- Remove all `build` instructions so that the images are pulled from DockerHub (instead of Docker trying to build local images - the ones based on the code)
- Link the right "secrets" files (with environment variables - representing pws/unames/auth-tokens etc) with your applications
- Modify the ports that your application runs on. You had two ports assigned to your team, one for your backend and one for frontend
    - Make sure that your backend application is accessible on http://localhost:backendport/
    - Make sure that your frontend application is accessible on http://localhost:frontendport/
    - This is something necessary



Seperate repositories from seperate parts of application (one for backend and one for frontend)
- Not on github, there you can have one