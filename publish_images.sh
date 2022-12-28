docker build -t salvachll/frontend-proyectocc ./frontend
docker build -t salvachll/worker-proyectocc ./worker
docker build -t salvachll/observer-proyectocc ./worker
docker push salvachll/frontend-proyectocc
docker push salvachll/worker-proyectocc
docker push salvachll/observer-proyectocc