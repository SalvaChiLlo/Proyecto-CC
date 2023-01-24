package service

import (
  k "kumori.systems/kumori:kumori"
  zk ".../zookeeper:component"
  kf ".../kafka:component"
  // ku ".../kafka_ui:component"
  mi ".../minio:component"
  mg ".../mongo:component"
  // me ".../mongo_express:component"
  wo ".../worker:component"
  fr ".../frontend:component"
  ob ".../observer:component"
)

#Artifact: {
  ref: name:  "service_system"

  description: {
    config: {
      resource: {
        zookeeper_client_port: k.#Secret
        zookeeper_tick_time: k.#Secret
        kafka_broker_id: k.#Secret
        kafka_zookeeper_connect: k.#Secret
        kafka_advertised_listeners: k.#Secret
        kafka_listener_security_protocol_map: k.#Secret
        kafka_inter_broker_listener_name: k.#Secret
        kafka_offsets_topic_replication_factor: k.#Secret
        kafka_clusters_0_name: k.#Secret
        kafka_clusters_0_bootstrapservers: k.#Secret
        kafka_clusters_0_metrics_port: k.#Secret
        minio_root_user: k.#Secret
        minio_root_password: k.#Secret
        minio_server_url: k.#Secret
        minio_port: k.#Secret
        minio_url: k.#Secret
        minio_bucket: k.#Secret
        pgdata: k.#Secret
        mongo_username: k.#Secret
        mongo_url: k.#Secret
        mongo_password: k.#Secret
        mongo_database: k.#Secret
        mongo_host: k.#Secret
        worker_node_env: k.#Secret
        worker_data_folder: k.#Secret
        partition_factor: k.#Secret
        frontend_node_env: k.#Secret
        frontend_production_port: k.#Secret
        frontend_production_ip: k.#Secret
        observer_node_env: k.#Secret
        refresh_rate: k.#Secret
        mongo_vol: k.#Volume
        minio_vol: k.#Volume
      }      
    }

    role: {
      zookeeper: {
        artifact: zk.#Artifact
        config: {
          resource: {
            zookeeper_client_port: description.config.resource.zookeeper_client_port
            zookeeper_tick_time: description.config.resource.zookeeper_tick_time
          }
          resilience: description.config.resilience
        }
      }

      kafka: {
        artifact: kf.#Artifact
        config: {
          resource: {
            kafka_broker_id: description.config.resource.kafka_broker_id
            kafka_zookeeper_connect: description.config.resource.kafka_zookeeper_connect
            kafka_advertised_listeners: description.config.resource.kafka_advertised_listeners
            kafka_listener_security_protocol_map: description.config.resource.kafka_listener_security_protocol_map
            kafka_inter_broker_listener_name: description.config.resource.kafka_inter_broker_listener_name
            kafka_offsets_topic_replication_factor: description.config.resource.kafka_offsets_topic_replication_factor
          }
          resilience: description.config.resilience
        }
      }

      // kafka_ui: {
      //   artifact: ku.#Artifact
      //   config: {
      //     resource: {
      //       kafka_clusters_0_name: description.config.resource.kafka_clusters_0_name
      //       kafka_clusters_0_bootstrapservers: description.config.resource.kafka_clusters_0_bootstrapservers
      //       kafka_clusters_0_metrics_port: description.config.resource.kafka_clusters_0_metrics_port
      //     }
      //     resilience: description.config.resilience
      //   }
      // }

      minio: {
        artifact: mi.#Artifact
        config: {
          resource: {
            minio_root_user: description.config.resource.minio_root_user
            minio_root_password: description.config.resource.minio_root_password
            minio_server_url: description.config.resource.minio_server_url
            minio_port: description.config.resource.minio_port
            minio_url: description.config.resource.minio_url
            minio_bucket: description.config.resource.minio_bucket
            minio_vol: description.config.resource.minio_vol
          }
          resilience: description.config.resilience
        }
      }

      mongo: {
        artifact: mg.#Artifact
        config: {
          resource: {
            mongo_username: description.config.resource.mongo_username
            mongo_password: description.config.resource.mongo_password
            mongo_database: description.config.resource.mongo_database
            mongo_vol: description.config.resource.mongo_vol
          }
          resilience: description.config.resilience
        }
      }

    //  mongo_express: {
    //     artifact: me.#Artifact
    //     config: {
    //       resource: {
    //         mongo_username: description.config.resource.mongo_username
    //         mongo_url: description.config.resource.mongo_url
    //         mongo_password: description.config.resource.mongo_password
    //       }
    //       resilience: description.config.resilience
    //     }
    //   }

      worker: {
        artifact: wo.#Artifact
        config: {
          resource: {
            worker_node_env: description.config.resource.worker_node_env
            kafka_clusters_0_bootstrapservers: description.config.resource.kafka_clusters_0_bootstrapservers
            worker_data_folder: description.config.resource.worker_data_folder
            minio_url: description.config.resource.minio_url
            minio_port: description.config.resource.minio_port
            minio_bucket: description.config.resource.minio_bucket
            minio_root_user: description.config.resource.minio_root_user
            minio_root_password: description.config.resource.minio_root_password
            partition_factor: description.config.resource.partition_factor
          }
          resilience: description.config.resilience
        }
      }

      frontend: {
        artifact: fr.#Artifact
        config: {
          resource: {
            frontend_node_env: description.config.resource.frontend_node_env
            frontend_production_port: description.config.resource.frontend_production_port
            frontend_production_ip: description.config.resource.frontend_production_ip
            kafka_clusters_0_bootstrapservers: description.config.resource.kafka_clusters_0_bootstrapservers
            minio_url: description.config.resource.minio_url
            minio_port: description.config.resource.minio_port
            minio_bucket: description.config.resource.minio_bucket
            minio_root_user: description.config.resource.minio_root_user
            minio_root_password: description.config.resource.minio_root_password
            mongo_database: description.config.resource.mongo_database
            mongo_host: description.config.resource.mongo_host
            mongo_username: description.config.resource.mongo_username
            mongo_password: description.config.resource.mongo_password
          }
          resilience: description.config.resilience
        }
      }

      observer: {
        artifact: ob.#Artifact
        config: {
          resource: {
            observer_node_env: description.config.resource.observer_node_env
            kafka_clusters_0_bootstrapservers: description.config.resource.kafka_clusters_0_bootstrapservers
            refresh_rate: description.config.resource.refresh_rate
          }
          resilience: description.config.resilience
        }
      }
    }

    srv: {
      server: {
        service: { protocol: "http", port: 80 }
      }
    }

    connect: {
      serviceconnector: {
        as: "lb"
			  from: self: "service"
        to: frontend: "entrypoint": _
      }
      // mongoconnector: {
      //   as: "lb"
      //   from: frontend: "mongoclient"
      //   to: mongo: "mongoserver": _
      // }
      // minioconnector: {
      //   as: "lb"
      //   from: worker: "minioclient"
      //   to: minio: "minioserver": _
      // }
      // frontendtokafka: {
      //   as: "lb"
      //   from: frontend: "kafkaclient"
      //   to: kafka: "kafkaserver": _
      // }
      // workertokafka: {
      //   as: "lb"
      //   from: frontend: "kafkaclient"
      //   to: kafka: "kafkaserver": _
      // }
      // observertokafka: {
      //   as: "lb"
      //   from: frontend: "kafkaclient"
      //   to: kafka: "kafkaserver": _
      // }
      // kafkazookeeperconnector: {
      //   as: "lb"
      //   from: kafka: "zkclient"
      //   to: zookeeper: "zkserver": _
      // }
    }
  }
}
