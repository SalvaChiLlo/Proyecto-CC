# Proyecto Cloud Computing

## Frontend - API
```
  POST | /getToken
    body: {
            "username": "myUsername",
            "password": "myPassword"
          }
    response: {
                "token": "yourBearerToken"
              }
```

```
  POST | /addJob
    headers:
      authentication: Bearer yourBearerToken
    body: {
            "url": "https://username:password@github.com/SalvaChiLlo/jobCC.git",
            "args": "Arguments for your executable ## This string will be appended to your executable",
            "config": "Your custom config in JSON ## This content will be written to your root project folder on config.json"
          }
    response: {
                "jobId": "yourJobId"
              }
```

```
  GET | /status/{jobId}
    headers:
      authentication: Bearer yourBearerToken
    response: {
                "status": "Pendiente" | "Finalizado"
              }
```

## Job definition standard
Every project needs to initialize a npm project because we need package.json for launching with `npm run start`.
This does not restric to just launch Javascript/Typescript projects. Inside your package.json, you can define any command to execute. For example:
``` json
  # For a JS project you could start it as follows:
  ...
  "start": "node src/index.js"
  ...
  
  # For a Rust project you could start it as follows:
  ...
  "start": "rustup main.rs && ./main.rs"
  ...
```

As explained in API definition, if you pass a config in the API call it will be written in your project root folder as *config.json*.

If your project produces any output file, it has to be written in the output directory in the root directory of your project. This folder will be persisted so you can get back your results. 