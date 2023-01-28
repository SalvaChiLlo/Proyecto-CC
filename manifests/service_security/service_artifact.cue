package service

import (
	k "kumori.systems/kumori:kumori"
	i "kumori.systems/builtins/inbound:service"
	kc ".../keycloak:component"
	pg ".../postgres:component"
)

#Artifact: {
	ref: name: "service_security"

	description: {
		config: {
			parameter: {
				postgres: {
					postgres_db:       string
					postgres_username: string
					postgres_password: string
				}
				keycloak: {
					keycloak_admin: string
				}
			}
			resource: {
				keycloak_admin_password: k.#Secret
				postgres_vol:            k.#Volume
				servercert:              k.#Certificate
				domain:                  k.#Domain
			}
		}

		let _postgrescfg = description.config.parameter.postgres
		let _keycloakcfg = description.config.parameter.keycloak
		let _resources = description.config.resource

		role: {
			kcinbound: {
				artifact: i.#Artifact
				config: {
					parameter: {
						type:      "https"
						websocket: true
					}
					resource: {
						servercert:   description.config.resource.servercert
						serverdomain: description.config.resource.domain
					}
				}
			}

			keycloak: {
				artifact: kc.#Artifact
				config: {
					parameter: {
						keycloak_admin:    _keycloakcfg.keycloak_admin
						postgres_db:       _postgrescfg.postgres_db
						postgres_username: _postgrescfg.postgres_username
						postgres_password: _postgrescfg.postgres_password
					}
					resource: {
						keycloak_admin_password: description.config.resource.keycloak_admin_password
					}
					resilience: description.config.resilience
				}
			}

			postgres: {
				artifact: pg.#Artifact
				config: {
					parameter: {
						postgres_db:       _postgrescfg.postgres_db
						postgres_username: _postgrescfg.postgres_username
						postgres_password: _postgrescfg.postgres_password
					}
					resource: {
						postgres_vol: _resources.postgres_vol
					}
					resilience: description.config.resilience
				}
			}
		}

		srv: {

		}

		connect: {
			serviceconnector: {
				as: "lb"
				// Pueden haber varios from
				from: kcinbound: "inbound"
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
