package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "minio"

  description: {

    srv: {
      server: {
        minioserver: { protocol: "tcp", port: 9000 }
      }
    }

    config: {
      parameter: {
        minio_server_url: string
        minio_bucket: string
      }
      resource: {
        default_user: k.#Secret
        default_password: k.#Secret
        minio_vol: k.#Volume
      }
    }
    
    size: {
      bandwidth: { size: 1000, unit: "M" }
    }

    code: minio: {
      name: "minio"
      image: {
        hub: { name: "", secret: "" }
        tag: "minio/minio:latest"
      }    
      entrypoint: ["/bin/bash", "-c"]
      cmd: ["mkdir -p /data/proyecto-cc && echo /data/proyecto-cc && echo $MINIO_BUCKET && minio server /data --console-address \":9090\""]  
      mapping: {
        env: {
          MINIO_ROOT_USER: secret: "default_user"
          MINIO_ROOT_PASSWORD: secret: "default_password"
          MINIO_SERVER_URL: parameter: "minio_server_url"
          MINIO_BUCKET: parameter: "minio_bucket"
        }
        filesystem: {
          "/data": {
            volume: "minio_vol"
          }
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
