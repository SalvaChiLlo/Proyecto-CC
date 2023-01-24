package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "kafka"

  description: {

    srv: {
      server: {
        kafkaserver: { protocol: "tcp", port: 29092 }
      }
      client: {
        zkclient: { protocol: "tcp" }
      }
    }

    config: {
      resource: {
        kafka_broker_id: k.#Secret
        kafka_zookeeper_connect: k.#Secret
        kafka_advertised_listeners: k.#Secret
        kafka_listener_security_protocol_map: k.#Secret
        kafka_inter_broker_listener_name: k.#Secret
        kafka_offsets_topic_replication_factor: k.#Secret
      }
    }
    
    size: {
      bandwidth: { size: 15, unit: "M" }
    }

    code: kafka: {
      name: "kafka"
      image: {
        hub: { name: "", secret: "" }
        tag: "confluentinc/cp-kafka:latest"
      }      
      mapping: {
        env: {
          KAFKA_BROKER_ID: secret: "kafka_broker_id"
          KAFKA_ZOOKEEPER_CONNECT: secret: "kafka_zookeeper_connect"
          KAFKA_ADVERTISED_LISTENERS: secret: "kafka_advertised_listeners"
          KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: secret: "kafka_listener_security_protocol_map"
          KAFKA_INTER_BROKER_LISTENER_NAME: secret: "kafka_inter_broker_listener_name"
          KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: secret: "kafka_offsets_topic_replication_factor"
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
