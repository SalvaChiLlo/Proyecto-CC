docker build -t salvachll/frontend-proyectocc ./frontend
docker build -t salvachll/worker-proyectocc ./worker
docker push salvachll/frontend-proyectocc
docker push salvachll/worker-proyectocc