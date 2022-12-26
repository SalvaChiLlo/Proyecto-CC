# Proyecto Cloud Computing

## Frontend
### /health
#### GET /
##### Response
```
response: <h1>Server is Running</h1>
```

### /api
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

### /auth
#### GET /{username}/{password}
##### Response
```
response: {
            "token": "yourBearerToken"
          }
```

## Job definition standard
Every project needs to initialize a npm project because we need package.json for launching with `npm run start`.
This does not restric to just launch Javascript/Typescript projects. Inside your package.json, you can define any command to execute. For example:
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

As explained in API definition, if you pass a config in the API call it will be written in your project root folder as *config.json*.

If your project produces any output file, it has to be written in the output directory in the root directory of your project. This folder will be persisted so you can get back your results. 