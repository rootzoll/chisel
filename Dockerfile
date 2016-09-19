FROM node:4.5.0

# create a new user
RUN useradd --user-group --create-home --shell /bin/false app

#Create directory structure
ENV HOME=/home/app
ADD ./package.json $HOME/package.json
ADD ./public $HOME/public
ADD ./templates $HOME/templates
ADD ./src $HOME/src

ENV NODE_PATH=$HOME/node_modules

RUN chown -R app:app $HOME/*

#Change to the new user
USER app
WORKDIR $HOME
RUN npm install
CMD ["node", "./src/index.js"]
