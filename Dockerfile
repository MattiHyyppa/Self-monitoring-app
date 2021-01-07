FROM hayd/alpine-deno:1.5.2

EXPOSE 7777
WORKDIR /app

USER deno
ENV DOCKER_ENV=TRUE

# Cache the dependencies as a layer
COPY deps.js .
RUN deno cache deps.js

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache app.js

CMD [ "run", "--unstable", "--watch", "--allow-net", "--allow-env", "--allow-read", "app.js" ]