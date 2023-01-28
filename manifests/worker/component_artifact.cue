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
      parameter: {
        worker_node_env: string
        worker_data_folder: string
        kafka_url: string
        minio_url: string
        minio_port: number
        minio_bucket: string
        partition_factor: number
      }
      resource: {
        worker_vol: k.#Volume
        default_user: k.#Secret
        default_password: k.#Secret
      }
    }
    
    size: {
      bandwidth: { size: 100, unit: "M" }
    }

    code: worker: {
      name: "worker"
      image: {
        hub: { name: "", secret: "" }
        tag: "salvachll/worker-proyectocc:latest"
      }    

      user: {
        userid: 0
        groupid: 0
      }

      mapping: {
        filesystem: {
          "/jobexecutor": volume: "worker_vol"
        }
        env: {
          NODE_ENV: parameter: "worker_node_env"
          WORKER_DATA_FOLDER: parameter: "worker_data_folder"
          PRODUCTION_KAFKA_URL: parameter: "kafka_url"
          MINIO_URL: parameter: "minio_url"
          MINIO_PORT: parameter: "minio_port"
          MINIO_BUCKET: parameter: "minio_bucket"
          MINIO_ACCESS_KEY: secret: "default_user"
          MINIO_SECRET_KEY: secret: "default_password"
          PARTITION_FACTOR: parameter: "partition_factor"
        }
      }
      size: {
        memory: { size: 4, unit: "G" }
        mincpu: 2000
        cpu: { size: 4000, unit: "m" }
      }
    }

  }
}
