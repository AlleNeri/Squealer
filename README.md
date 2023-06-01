# Squealer
Progetto di tecnologie web A.A. 2023
## Docker
I tecnici di laboratorio hanno consigliato di utilizzare i Dockerfile contenuti in `Docker` in quanto sarebbero quelli utilizzati per lo spazio web delle macchine di laboratorio.
## Da fare
- dare un occhiata più nello specifico ai Dockerfile(quello di mongo pretende di runnare un suo script).
- aggiungere i volumi ai container nel Makefile.
- tutto il resto.
## Makefile
### Ragioni
Usare il più possibile il Makefile come un layer di astrazione per non doversi interfacciare direttamente com Docker. Vantaggi: astrazione, incapsulamento, etc...
### Quik start
Lanciare alla prima clone e ad ogni aggiornamento dei Dockerfile `make create-images`.
Lanciare `make start-mongo` per lanciare il container mongo; analogo per node.
Lanciare `make start-mongo-bg` per lanciare mongo il background il container mongo; analogo per node.
Lanciare `make remove-mongo` per stoppare e rimuover il container.
### Specifiche
Il Makefile contiene alcune entry utili per buildare le immagini docker, per runnarle e stopparle([vedere sezione su Docker](#-Docker)):
- `create-images`: crea le immagini a partire dai Dockerfile nelle cartelle specifiche.
- `start-mongo`: avvia il container di mongo.
- `start-mongo-bg`: avvia il container di mongo in background.
- `stop-mongo`: stoppa il container di mongo.
- `remove-mongo`: rimuove il container di mongo.
- `start-node`: avvia il container di mongo.
- `start-node-bg`: avvia il container di mongo in background.
- `stop-node`: stoppa il container di node.
- `remove-node`: rimuove il container di node.
### Problemi frequenti
PS: sulla mia macchina docker pretende di essere lanciato come amministratore di sistema; nel caso le entry del Makefile falliranno. Per risolvere lanciare direttamente `make ...` come root, quindi `sudo make ...`.
