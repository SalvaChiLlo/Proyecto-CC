package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "mongo"

  description: {

    srv: {
      server: {
        mongoserver: { protocol: "tcp", port: 27017 }
      }
    }

    config: {
      resource: {
        mongo_username: k.#Secret
        mongo_password: k.#Secret
        mongo_database: k.#Secret
        mongo_vol: k.#Volume
      }
    }
    
    size: {
      bandwidth: { size: 15, unit: "M" }
    }

    code: mongo: {
      name: "mongo"
      image: {
        hub: { name: "", secret: "" }
        tag: "mongo"
      }      
      mapping: {
        env: {
          MONGO_INITDB_ROOT_USERNAME: secret: "mongo_username"
          MONGO_INITDB_ROOT_PASSWORD: secret: "mongo_password"
          MONGO_INITDB_DATABASE: secret: "mongo_database"
        }
        filesystem: {
          "/data/db": {
            volume: "mongo_vol"
          }
        }
      }
      size: {
        memory: { size: 100, unit: "M" }
        mincpu: 100
        cpu: { size: 200, unit: "m" }
      }
    }

  }
}
