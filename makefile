# directories
BASE-DIR = ./Docker
MONGO-DIR = $(BASE-DIR)/mongo
NODE-DIR = $(BASE-DIR)/node

# names
MONGO-DOCKER-IMG = mongo-img	# mongo docker image
MONGO-DOCKER-CONTAINER = mongo-container	# mongo docker name
NODE-DOCKER-IMG = node-img	# mongo docker image
NODE-DOCKER-CONTAINER = node-container	# mongo docker name

# creating an image
IMAGE-CREATE = docker build -t

#running a docker container
RUNNING-CONTAINER = docker run

# starting a docker container
STARTING-CONTAINER = docker start

# stopping a container
STOPPING-CONTAINER = docker stop

# removing a container
REMOVING-CONTAINER = docker rm

# docker log
LOG-FILE =  docker.log
LOG = >> $(LOG-FILE)
PRINT-LOG-END = tail -n2 $(LOG-FILE)

# creating the docker images
create-images: $(MONGO-DIR)/Dockerfile $(NODE-DIR)/Dockerfile
	$(info See $(LOG-FILE) for more info)
	echo "$(IMAGE-CREATE) $(MONGO-DOCKER-IMG) $(MONGO-DIR):" $(LOG)
	$(IMAGE-CREATE) $(MONGO-DOCKER-IMG) $(MONGO-DIR) $(LOG)
	$(RUNNING-CONTAINER) -p 8080:80 -d --name $(MONGO-DOCKER-CONTAINER) $(MONGO-DOCKER-IMG)
	$(PRINT-LOG-END)
	echo "$(IMAGE-CREATE) $(NODE-DOCKER-IMG) $(NODE-DIR):" $(LOG)
	$(IMAGE-CREATE) $(NODE-DOCKER-IMG) $(NODE-DIR) $(LOG)
	$(RUNNING-CONTAINER) -p 8081:80 -d --name $(NODE-DOCKER-CONTAINER) $(NODE-DOCKER-IMG)
	$(PRINT-LOG-END)

# running mongo
start-mongo:
	$(STARTING-CONTAINER) $(MONGO-DOCKER-CONTAINER)

# stoping mongo
stop-mongo:
	$(STOPPING-CONTAINER) $(MONGO-DOCKER-CONTAINER)

# removing mongo
remove-mongo: stop-mongo
	$(REMOVING-CONTAINER) $(MONGO-DOCKER-CONTAINER)

# running node
start-node:
	$(STARTING-CONTAINER) $(NODE-DOCKER-CONTAINER)

# stoping node
stop-node:
	$(STOPPING-CONTAINER) $(NODE-DOCKER-CONTAINER)

# removing node
remove-node: stop-node
	$(REMOVING-CONTAINER) $(NODE-DOCKER-CONTAINER)

# phony target
.PHONY: clean
clean: clear

# clear all
clear:
	rm -f $(LOG-FILE)
