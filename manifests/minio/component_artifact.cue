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
      resource: {
        minio_root_user: k.#Secret
        minio_root_password: k.#Secret
        minio_server_url: k.#Secret
        minio_bucket: k.#Secret
        minio_vol: k.#Volume
      }
    }
    
    size: {
      bandwidth: { size: 15, unit: "M" }
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
          MINIO_ROOT_USER: secret: "minio_root_user"
          MINIO_ROOT_PASSWORD: secret: "minio_root_password"
          MINIO_SERVER_URL: secret: "minio_server_url"
          MINIO_BUCKET: secret: "minio_bucket"
        }
        filesystem: {
          "/data": {
            volume: "minio_vol"
          }
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
