package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "frontend"

  description: {

    srv: {
      server: {
        entrypoint: { protocol: "tcp", port: 80 }
      }
      client: {
        mongoclient: { protocol: "tcp" }
        minioclient: { protocol: "tcp" }
        kafkaclient: { protocol: "tcp" }
      }
    }

    config: {
      parameter: {
        frontend_node_env: string
        frontend_production_port: number
        frontend_prodution_ip: string
        kafka_url: string
        minio_url: string
        minio_port: number
        minio_bucket: string
        mongo_db: string
        mongo_host: string
      }
      resource: {
        default_user: k.#Secret
        default_password: k.#Secret
        keycloak_client: k.#Secret
        keycloak_realm: k.#Secret
        keycloak_url: k.#Secret
        keycloak_secret: k.#Secret
      }
    }
    
    size: {
      bandwidth: { size: 1000, unit: "M" }
    }

    code: frontend: {
      name: "frontend"
      image: {
        hub: { name: "", secret: "" }
        tag: "salvachll/frontend-proyectocc:latest"
      }      
      mapping: {
        env: {
          NODE_ENV: parameter: "frontend_node_env"
          PRODUCTION_PORT: parameter: "frontend_production_port"
          PRODUCTION_IP: parameter: "frontend_prodution_ip"
          PRODUCTION_KAFKA_URL: parameter: "kafka_url"
          MINIO_URL: parameter: "minio_url"
          MINIO_PORT: parameter: "minio_port"
          MINIO_BUCKET: parameter: "minio_bucket"
          MINIO_ACCESS_KEY: secret: "default_user"
          MINIO_SECRET_KEY: secret: "default_password"
          MONGO_DATABASE: parameter: "mongo_db"
          MONGO_HOST: parameter: "mongo_host"
          MONGO_USERNAME: secret: "default_user"
          MONGO_PASSWORD: secret: "default_password"
          KEYCLOAK_CLIENT: secret: "keycloak_client"
          KEYCLOAK_REALM: secret: "keycloak_realm"
          KEYCLOAK_URL: secret: "keycloak_url"
          KEYCLOAK_SECRET: secret: "keycloak_secret"
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
