package component

#Artifact: {
  ref: name:  "cache"

  description: {

    srv: {
      server: {
        restapiserver: { protocol: "http", port: 8080 }
      }
      client: {
        restapiclient: { protocol: "http" }
      }
    }

    config: {
      parameter: {
        restapiclientPortEnv: string | *"80"
      }
      resource: {}
    }
    
    size: {
      bandwidth: { size: 15, unit: "M" }
    }

    probe: cache: {
      liveness: {
        protocol: http : { port: srv.server.restapiserver.port, path: "/health" }
        startupGraceWindow: {
          unit: "ms",
          duration: 20000,
          probe: true
        }
        frequency: "medium"
        timeout: 30000  // msec
      }
      readiness: {
        protocol: http : { port: srv.server.restapiserver.port, path: "/health" }
        frequency: "medium"
        timeout: 30000 // msec
      }
    }

    code: cache: {
      name: "cache"
      image: {
        hub: { name: "", secret: "" }
        tag: "kumoripublic/examples-calc-cache-cache:v3.0.8"
      }
      mapping: {
        filesystem: {}
        env: {
          RESTAPICLIENT_PORT_ENV: parameter: "restapiclientPortEnv"
          RESTAPISERVER_PORT_ENV: value: "\(srv.server.restapiserver.port)"
        }
      }
      // Applies to each containr
      size: {
        memory: { size: 100, unit: "M" }
        mincpu: 100
        cpu: { size: 200, unit: "m" }
      }
    }

  }
}
