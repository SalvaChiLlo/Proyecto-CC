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
      parameter: {
        mongo_db: string
      }
      resource: {
        default_user: k.#Secret
        default_password: k.#Secret
        mongo_vol: k.#Volume
      }
    }
    
    size: {
      bandwidth: { size: 100, unit: "M" }
    }

    code: mongo: {
      name: "mongo"
      image: {
        hub: { name: "", secret: "" }
        tag: "mongo"
      }      
      mapping: {
        env: {
          MONGO_INITDB_ROOT_USERNAME: secret: "default_user"
          MONGO_INITDB_ROOT_PASSWORD: secret: "default_password"
          MONGO_INITDB_DATABASE: parameter: "mongo_db"
        }
        filesystem: {
          "/data/db": {
            volume: "mongo_vol"
          }
        }
      }
      size: {
        memory: { size: 6, unit: "G" }
        mincpu: 2000
        cpu: { size: 4000, unit: "m" }
      }
    }

  }
}
