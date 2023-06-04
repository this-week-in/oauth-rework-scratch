# Authorization 

WARNING: this will give you hemorrhoids if you don't pay attention! 

to see everyting in action, launch the html app (`serve.sh`), run the `authserver`, `authclient`, `resourceserver`, etc., with Spring Boot, as per usual. Then go to http://127.0.0.1:8082/ and you should be redirected to the OAuth Authorization Server on localhost:8080/ and prompted to confirm consent, login, and redirect you back. NB: I used `127.0.0.1`, _not_ `localhost`!  

Great, it works. But how?

OAuth, baby! 

The `authserver` is our authorative authentication service. I'm going to deploy just one of these and use it to manage authentication for all my various services. But we're starting with just the `twi-studio` at the moment. It's on port `8080`.


The `resourceserver` is our HTTP API. It's on port `8081`.

The `html` runs on port `8084`. It could be a simple `python` HTTP service or the result of `npm run serve` or some Docker container being served out of `nginx` in a Docker image built by buildpacks. It's just the HTML. No backend business logic whatsoever is to be found here.

The `authclient` is a proxy that forwards all requests to `/api/*` onward to our `resourceserver`, but only after it's checked for an OAuth token. If its not present, it'll bounce the request to the `authserver` which will authenticate the user and then redirect back to the `authclient`. Any _other_ requests, e.g., for `/index.html`, are forwarded to the service  serving the static site in `html` over on port `8084`. The `authclient` runs on port `8082` and it is _this_ service that should be any users entry point into the system. 

