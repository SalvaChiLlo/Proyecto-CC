package service

import (
  k "kumori.systems/kumori:kumori"
  kc ".../keycloak:component"
  pg ".../postgres:component"
)

#Artifact: {
  ref: name:  "service_security"

  description: {
    config: {
      resource: {
        postgres_vol: k.#Volume
        postgres_db: k.#Secret
        postgres_username: k.#Secret
        postgres_password: k.#Secret
        keycloak_admin: k.#Secret
        keycloak_admin_password: k.#Secret
      }      
    }

    role: {
      keycloak: {
        artifact: kc.#Artifact
        config: {
          resource: {
            postgres_db: description.config.resource.postgres_db
            postgres_db_url: description.config.resource.postgres_db_url
            postgres_username: description.config.resource.postgres_username
            postgres_password: description.config.resource.postgres_password
            keycloak_admin: description.config.resource.keycloak_admin
            keycloak_admin_password: description.config.resource.keycloak_admin_password
          }
          resilience: description.config.resilience
        }
      }
      postgres: {
        artifact: pg.#Artifact
        config: {
          resource: {
            postgres_db: description.config.resource.postgres_db
            postgres_vol: description.config.resource.postgres_vol
            postgres_password: description.config.resource.postgres_password
          }
          resilience: description.config.resilience
        }
      }
    }

    srv: {
      server: {
        service: { protocol: "http", port: 80 }
      }
    }

    connect: {
      serviceconnector: {
        as: "lb"
			  from: self: "service"
        to: keycloak: "entrypoint": _
      }
      dbconnector: {
        as: "lb"
        from: keycloak: "dbclient"
        to: postgres: "dbserver": _
      }
    }
  }
}
