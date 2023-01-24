package deployment
// If a package name other than "deployment" is used, then the
// "kumorictl register deployment" operation must include the "--package" flag.

import (
  s ".../service_security:service"
)

#Deployment: {
  name: "security_depl"
  artifact: s.#Artifact
  config: {
    resource: {
      postgres_vol: volume: "postgres_vol"
      postgres_db: secret: "postgres_db"
      postgres_db_url: secret: "postgres_db_url"
      postgres_username: secret: "postgres_username"
      postgres_password: secret: "postgres_password"
      keycloak_admin: secret: "keycloak_admin"
      keycloak_admin_password: secret: "keycloak_admin_password"
    }
    scale: detail: {
      keycloak: hsize: 1
      postgres: hsize: 1
    }
    resilience: 0
  }
}
