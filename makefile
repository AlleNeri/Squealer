# directories
BASE-DIR = ./Docker
MONGO-DIR = $(BASE-DIR)/mongo
NODE-DIR = $(BASE-DIR)/node

# names
MONGO-DOCKER-IMG = mongo-img	# mongo docker image
MONGO-DOCKER-NAME = mongo-container	# mongo docker name
NODE-DOCKER-IMG = node-img	# mongo docker image
NODE-DOCKER-NAME = node-container	# mongo docker name

# creating an image
IMAGE-CREATE = docker build -t

# starting a docker container
STARTING-CONTAINER = docker run -p 80:80

# stopping a container
STOPPING-CONTAINER = docker stop

# removing a container
REMOVING-CONTAINER = docker stop

# creating the docker images
create-images: $(MONGO-DIR)/Dockerfile $(NODE-DIR)/Dockerfile
	$(IMAGE-CREATE) $(MONGO-DOCKER-IMG) $(MONGO-DIR)
	$(IMAGE-CREATE) $(NODE-DOCKER-IMG) $(NODE-DIR)

# running mongo
start-mongo:
	$(STARTING-CONTAINER) --name $(MONGO-DOCKER-NAME) $(MONGO-DOCKER-IMG)

# running mongo in background
start-mongo-bg:
	$(STARTING-CONTAINER) -d --name $(MONGO-DOCKER-NAME) $(MONGO-DOCKER-IMG)

# stoping mongo
stop-mongo:
	$(STOPPING-CONTAINER) $(MONGO-DOCKER-NAME)

# removing mongo
remove-mongo: stop-mongo
	$(REMOVING-CONTAINER) $(MONGO-DOCKER-NAME)

# running node
start-node:
	$(STARTING-CONTAINER) --name $(NODE-DOCKER-NAME) $(NODE-DOCKER-IMG)

# running node in background
start-node-bg:
	$(STARTING-CONTAINER) -d --name $(NODE-DOCKER-NAME) $(NODE-DOCKER-IMG)

# stoping node
stop-node:
	$(STOPPING-CONTAINER) $(NODE-DOCKER-NAME)

# removing node
remove-node: stop-node
	$(REMOVING-CONTAINER) $(NODE-DOCKER-NAME)
