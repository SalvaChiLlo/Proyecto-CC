package component

import k "kumori.systems/kumori:kumori"

#Files: _

#Artifact: {
  ref: name:  "kafka"

  description: {

    srv: {
      server: kafkaserver: { protocol: "tcp", port: 9092 }
      duplex: internal: port: 29092
      client: zkclient: _
    }

    config: {
      parameter: {
        kafka_cfg_zookeeper_connect: string
        kafka_cfg_num_partitions: number
        allow_plaintext_listener: string
        kafka_cfg_listener: string
      }
      resource: {
        kafka_vol: k.#Volume
      }
    }
    
    size: {
      bandwidth: { size: 1000, unit: "M" }
    }

    code: kafka: {
      name: "kafka"
      image: {
        hub: { name: "", secret: "" }
        tag: "bitnami/kafka"
      }

      user: {
        userid: 0
        groupid: 0
      }

      entrypoint: ["/bin/cmd.sh"]

      mapping: {
        filesystem: {
          "/bitnami": volume: "kafka_vol"
          "/bin/cmd.sh": {
            data: value: #Files.cmd
            mode: 0o755
          }
        }
        env: {
          KAFKA_CFG_ZOOKEEPER_CONNECT: parameter: "kafka_cfg_zookeeper_connect"
          KAFKA_CFG_NUM_PARTITIONS: parameter: "kafka_cfg_num_partitions"
          ALLOW_PLAINTEXT_LISTENER: parameter: "allow_plaintext_listener"
          KAFKA_CFG_LISTENER: parameter: "kafka_cfg_listener"

          ENTRY_ORIGINAL: value: "/opt/bitnami/scripts/kafka/entrypoint.sh"
          CMD_ORIGINAL: value: "/opt/bitnami/scripts/kafka/run.sh"
        }
      }

      size: {
        memory: { size: 4, unit: "G" }
        mincpu: 4000
        cpu: { size: 4000, unit: "m" }
      }
    }

  }
}
