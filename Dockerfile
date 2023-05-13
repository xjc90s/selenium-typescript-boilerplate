FROM alpine:latest

RUN apk update && \
    apk --no-cache add zsh yarn

COPY . /testing/

RUN cd /testing && \
    yarn

WORKDIR /testing

ENTRYPOINT /bin/zsh

# IIRC has no editor preinstalled so if you want to edit the code, you'll have to install it on your own.
 
