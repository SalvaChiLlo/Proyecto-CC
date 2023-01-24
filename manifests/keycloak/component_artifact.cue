package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "keycloak"

  description: {

    srv: {
      server: {
        entrypoint: { protocol: "http", port: 8080 }
      }
      client: {
        dbclient: { protocol: "tcp" }
      }
    }

    config: {
      resource: {
        keycloak_admin: k.#Secret
        keycloak_admin_password: k.#Secret
        postgres_db: k.#Secret
        postgres_db_url: k.#Secret
        postgres_username: k.#Secret
        postgres_password: k.#Secret
      }
    }
    
    size: {
      bandwidth: { size: 15, unit: "M" }
    }

    code: keycloak: {
      name: "keycloak"
      image: {
        hub: { name: "quay.io", secret: "" }
        tag: "keycloak/keycloak:20.0"
      }      
      cmd: ["start-dev --log-level=ALL"]
      mapping: {
        env: {
          KEYCLOAK_ADMIN: secret: "keycloak_admin"
          KEYCLOAK_ADMIN_PASSWORD: secret: "keycloak_admin_password"
          KC_PROXY: value: "edge"
          // DE AQUI HACIA ABAJO CAMBIAR VALUE POR SECRET
          KC_DB: secret: "postgres_db"
          KC_DB_URL: secret: "postgres_db_url"
          KC_DB_USERNAME: secret: "postgres_username"
          KC_DB_PASSWORD: secret: "postgres_password"
        }
      }
      size: {
        memory: { size: 1, unit: "G" }
        mincpu: 300
        cpu: { size: 1000, unit: "m" }
      }
    }

  }
}
