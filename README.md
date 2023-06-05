# Authorization 

WARNING: this will give you hemorrhoids if you don't pay attention! 

to see everyting in action, launch the html node app (`studio`, there's a file called `/bin/dev.sh` that'll launch the application on port `5763`), run the `authorization-api` (ideally this will be already deployed somewhere...), `gateway` (this is an OAuth client), `bookmarks-api` (this is an OAuth resource server), etc., with Spring Boot, as per usual. Then go to http://127.0.0.1:8082/ and you should be redirected to the OAuth Authorization Server on localhost:8080/ and prompted to confirm consent, login, and redirect you back. NB: I used `127.0.0.1:8082`, _not_ `localhost:8082`!  

Great, it works. But how?

OAuth, baby! 

The `authserver` is our authorative authentication service. I'm going to deploy just one of these and use it to manage authentication for all my various services. But we're starting with just the `studio` at the moment. It's on port `8080`.

The `bookmarks-api` is our HTTP API. It's on port `8081`.

The `studio` runs on port `8084`. It could be a simple `python` HTTP service or the result of `npm run dev` or some Docker container being served out of `nginx` in a Docker image built by buildpacks. It's just the HTML. No backend business logic whatsoever is there. This is to be anonymous. No client should ever find this. It'll have public DNS but be worthless to anyone not connecting via the `gateway`.

The `gateway` is a Spring Cloud Gateway proxy that forwards all requests to `gateway:/api/*` onward to our `bookmarks-api/*`, but only after it's checked for an OAuth token. If its not present, it'll bounce the request to the `authorization-api` which will authenticate the user and then redirect back to the `gateway`. Any _other_ requests, e.g., for `gateway/index.html`, are forwarded to the `studio` endpoint that's serving the static site in `html` over on port `8084`. 

The `gateway` (an OAuth client) runs on port `8082` and it is _this_ service that should be any users entry point into the system. 

