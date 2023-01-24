package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "postgres"

  description: {

    srv: {
      server: {
        dbserver: { protocol: "tcp", port: 5432 }
      }
    }

    config: {
      resource: {
        postgres_vol: k.#Volume
        postgres_db: k.#Secret
        postgres_password: k.#Secret
      }
    }
    
    size: {
      bandwidth: { size: 15, unit: "M" }
    }

    code: postgres: {
      name: "postgres"
      image: {
        hub: { name: "", secret: "" }
        tag: "postgres:15"
      }      
      mapping: {
        env: {
          POSTGRES_DB: secret: "postgres_db"
          POSTGRES_PASSWORD: secret: "postgres_password"
          PGDATA: value: "/var/lib/postgresql/data/pgdata"
        }
        filesystem: {
          "/var/lib/postgresql/data": {
            volume: "postgres_vol"
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
