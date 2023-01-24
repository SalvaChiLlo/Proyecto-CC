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
        kafkaclient: { protocol: "tcp" }
      }
    }

    config: {
      resource: {
        frontend_node_env: k.#Secret
        frontend_production_port: k.#Secret
        frontend_production_ip: k.#Secret
        kafka_clusters_0_bootstrapservers: k.#Secret
        minio_url: k.#Secret
        minio_port: k.#Secret
        minio_bucket: k.#Secret
        minio_root_user: k.#Secret
        minio_root_password: k.#Secret
        mongo_database: k.#Secret
        mongo_host: k.#Secret
        mongo_username: k.#Secret
        mongo_password: k.#Secret
      }
    }
    
    size: {
      bandwidth: { size: 15, unit: "M" }
    }

    code: frontend: {
      name: "frontend"
      image: {
        hub: { name: "", secret: "" }
        tag: "salvachll/frontend-proyectocc"
      }      
      mapping: {
        env: {
          NODE_ENV: secret: "frontend_node_env"
          PRODUCTION_PORT: secret: "frontend_production_port"
          PRODUCTION_IP: secret: "frontend_production_ip"
          PRODUCTION_KAFKA_URL: secret: "kafka_clusters_0_bootstrapservers"
          MINIO_URL: secret: "minio_url"
          MINIO_PORT: secret: "minio_port"
          MINIO_BUCKET: secret: "minio_bucket"
          MINIO_ACCESS_KEY: secret: "minio_root_user"
          MINIO_SECRET_KEY: secret: "minio_root_password"
          MONGO_DATABASE: secret: "mongo_database"
          MONGO_HOST: secret: "mongo_host"
          MONGO_USERNAME: secret: "mongo_username"
          MONGO_PASSWORD: secret: "mongo_password"
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
