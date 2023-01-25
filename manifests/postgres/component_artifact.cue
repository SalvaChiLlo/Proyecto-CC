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
      parameter: {
        postgres_db: string
        postgres_username: string
        postgres_password: string
        pgdata: "/var/lib/postgresql/data/pgdata"
      }
      resource: { 
        postgres_vol: k.#Volume
      }
    }

    size: {
      bandwidth: { size: 1000, unit: "M" }
    }

    code: postgres: {
      name: "postgres"
      image: {
        hub: { name: "", secret: "" }
        tag: "postgres:15"
      }     

      user: {
        userid: 0
        groupid: 0
      }

      mapping: {
        env: {
          POSTGRES_DB: parameter: "postgres_db"
          POSTGRES_PASSWORD: parameter: "postgres_password"
          PGDATA: parameter: "pgdata"
        }
        filesystem: {
          "/var/lib/postgresql/data": {
            volume: "postgres_vol"
          }
        }

      }
      size: {
        memory: { size: 4, unit: "G" }
        mincpu: 1000
        cpu: { size: 2000, unit: "m" }
      }
    }

  }
}
