package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "worker"

  description: {

    srv: {
      client: {
        kafkaclient: { protocol: "tcp" }
        minioclient: { protocol: "tcp" }
      }
    }

    config: {
      resource: {
        worker_node_env: k.#Secret
        kafka_clusters_0_bootstrapservers: k.#Secret
        worker_data_folder: k.#Secret
        minio_url: k.#Secret
        minio_port: k.#Secret
        minio_bucket: k.#Secret
        minio_root_user: k.#Secret
        minio_root_password: k.#Secret
        partition_factor: k.#Secret
      }
    }
    
    size: {
      bandwidth: { size: 15, unit: "M" }
    }

    code: worker: {
      name: "worker"
      image: {
        hub: { name: "", secret: "" }
        tag: "salvachll/worker-proyectocc"
      }      
      mapping: {
        env: {
          NODE_ENV: secret: "worker_node_env"
          PRODUCTION_KAFKA_URL: secret: "kafka_clusters_0_bootstrapservers"
          WORKER_DATA_FOLDER: secret: "worker_data_folder"
          MINIO_URL: secret: "minio_url"
          MINIO_PORT: secret: "minio_port"
          MINIO_BUCKET: secret: "minio_bucket"
          MINIO_ACCESS_KEY: secret: "minio_root_user"
          MINIO_SECRET_KEY: secret: "minio_root_password"
          PARTITION_FACTOR: secret: "partition_factor"
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
