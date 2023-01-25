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
    parameter: {
      postgres: {
        postgres_db: "keycloak"
        postgres_username: "postgres"
        postgres_password: "adminadmin"
      }
      keycloak: {
        keycloak_admin: "admin"
      }
    }
    resource: {
      postgres_vol: volume: { size: 5, unit: "G"}
      keycloak_admin_password: secret: "keycloak_admin_password"
      servercert: certificate: "cluster.core/wildcard-vera-kumori-cloud"
      domain: domain: "kc"
    }
    scale: detail: {
      keycloak: hsize: 1
      postgres: hsize: 1
    }
    resilience: 0
  }
}
