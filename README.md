# Proyecto Cloud Computing
Para probar el proyecto importa este [workspace](https://drive.google.com/file/d/1v40CR2Zep56AS6RJgTOrSt_NRk_AAE9I/view?usp=share_link) en [Postman](https://www.postman.com/).

## Frontend
Resumen de funcionalidad disponible:
* /health
  * / -> Indica si el servidor está en funcionamiento
  * /load -> Indica la carga del servidor
* /api
  * /addJob -> Añadir nuevo trabajo
  * /status -> Obtener estado de todos los trabajos del usuario
    * /status/:id -> Obtener estado del trabajo `id` del usuario
  * /results/:id/:file -> Obtener archivo `file` del trabajo `id`
  * /deleteJob/:id -> Eliminar trabajo de la cola de trabajos
* /auth
  * /:user/:password -> Inicio de sesión con usuario y contraseña, devuelve un bearer token
# /health
#### GET /
##### Response
```
response: <h1>Server is Running</h1>
```
#### GET /load
Devuelve la carga del sistema durante los últimos 10 periodos (20 segundos). Lista ordenada en orden inverso según timestamp
* avgRateOfArrival -> Devuelve la cantidad de trabajos que se han añadido en el periodo.
* avgRateOfService -> Devuelve la cantidad de trabajos que han pasado de estado *En espera* a *Lanzado*
* avgRateOfFinished -> Devuelve la cantidad de trabajos que han pasado a estado *Finalizado*
* avgResponseTime --> Devuelve el tiempo medio de los trabajos terminados en el periodo.
##### Request
```
headers:
  Authorization: Bearer yourBearerToken
```
##### Response
```
response: [
            {
              "avgRateOfArrival": number,
              "avgRateOfService": number,
              "avgRateOfFinished": number,
              "avgResponseTime": number,
              "timestamp": number
            },
            ...
          ]
```

# /api
#### POST /addJob
##### Request
```
headers:
  Authorization: Bearer yourBearerToken
body: {
        "url": "https://username:password@github.com/SalvaChiLlo/jobCC.git",
        "args": "Arguments for your executable ## This string will be appended to your executable",
        "config": "Your custom config in JSON ## This content will be written to your root project folder on config.json"
      }
```
##### Response
```
response: {
            "jobId": "yourJobId"
          }
```

#### GET /status
##### Request
```
headers:
  Authorization: Bearer yourBearerToken
```
##### Response
```
response: [
            {
              "id": string,
              "status": string,
              "outputFiles": ["url://file1", "url://file2"]
            },
            {
              "id": string,
              "status": string,
              "outputFiles": ["url://file1", "url://file2"]
            },
            ...
          ]
```

#### GET /status/{jobId}
##### Request
```
headers:
  Authorization: Bearer yourBearerToken
```
##### Response
```
response: {
            "id": string,
            "status": string,
            "outputFiles": ["url://file1", "url://file2"]
          }
```

#### GET /results/{jobId}/{filename}
##### Request
```
headers:
  Authorization: Bearer yourBearerToken
```
##### Response
```
response: File Download
```

#### GET /deleteJob/{id}
##### Request
```
headers:
  Authorization: Bearer yourBearerToken
```
##### Response
```
response: 
  `El trabajo ${jobId} ha sido eliminado.`
  o
  `El trabajo ${jobId} no existe o no te pertenece.`
```

# /auth
#### GET /{username}/{password}
##### Response
```
response: {
            "token": "yourBearerToken"
          }
```

## Job definition standard
Cada trabajo necesita inicializar un proyecto npm porque necesitamos el archivo *package.json* para lanzarlo con `npm run start`.
Esto no nos limita a solo lanzar proyectos Javascript/Typescript. Dentro del *package.json*, puedes definir cualquier comando a ejecutar. Por ejemplo:
``` json
# For a JS project you could start it as follows:
...
"scripts": {
  "start": "node src/index.js",
  ...
}
...

# For a Rust project you could start it as follows:
...
"scripts": {
  "start": "rustc main.rs && ./main.rs",
  ...
}
...
```

Como se explica en la definición de la API, si se pasa una configuración en la llamada a la API, esta, se escribirá en la carpeta raíz del proyecto como *config.json*.

Si el proyecto produce cualquier archivo de salida, tiene que ser escrito en el directorio de salida *output* en la raíz de tu proyecto. Todo lo que se guarde en esta carpeta será guardado en Minio para que así después se puedan obtener los resultados del trabajo.
