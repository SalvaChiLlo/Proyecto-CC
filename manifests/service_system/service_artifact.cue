package service

import (
  k "kumori.systems/kumori:kumori"
  i "kumori.systems/builtins/inbound/@1.1.0/inbound:service"
  zk ".../zookeeper:component"
  kf ".../kafka:component"
  mi ".../minio:component"
  mg ".../mongo:component"
  wo ".../worker:component"
  fr ".../frontend:component"
  ob ".../observer:component"
)

#Artifact: {
  ref: name:  "service_system"

  description: {
    config: {
      parameter: {
        type: "https"
        websocket: true
        frontend_node_env: string
        frontend_production_port: number
        frontend_prodution_ip: string
        mongo_host: string
        kafka_cfg_zookeeper_connect: string
        kafka_cfg_num_partitions: number
        allow_plaintext_listener: string
        kafka_cfg_listener: string
        minio_server_url: string
        mongo_db: string
        observer_node_env: string
        refresh_rate: number
        worker_node_env: string
        worker_data_folder: string
        kafka_url: string
        minio_url: string
        minio_port: number
        minio_bucket: string
        partition_factor: number
        zookeeper_client_port: number
        zookeeper_tick_time: number
      }
      resource: {
        default_user: k.#Secret
        default_password: k.#Secret
        keycloak_client: k.#Secret
        keycloak_realm: k.#Secret
        keycloak_url: k.#Secret
        keycloak_secret: k.#Secret
        mongo_vol: k.#Volume
        minio_vol: k.#Volume
        zookeeper_vol: k.#Volume
        kafka_vol: k.#Volume
        servercert: k.#Certificate
        serverdomain: k.#Domain
      }      
    }

    role: {
      frontinbound: {
        artifact: i.#Artifact
        config: {
          resource: {
            servercert: description.config.resource.servercert
            serverdomain: description.config.resource.serverdomain
          }
        }
      }

      zookeeper: {
        artifact: zk.#Artifact
        config: {
          parameter: {
            zookeeper_client_port: description.config.parameter.zookeeper_client_port
            zookeeper_tick_time: description.config.parameter.zookeeper_tick_time
          }
          resource: { 
            zookeeper_vol: description.config.resource.zookeeper_vol
          }
          resilience: description.config.resilience
        }
      }

      kafka: {
        artifact: kf.#Artifact
        config: {
          parameter: {
            kafka_cfg_zookeeper_connect: description.config.parameter.kafka_cfg_zookeeper_connect
            kafka_cfg_num_partitions: description.config.parameter.kafka_cfg_num_partitions
            allow_plaintext_listener: description.config.parameter.allow_plaintext_listener
            kafka_cfg_listener: description.config.parameter.kafka_cfg_listener
          }
          resource: {
            kafka_vol: description.config.resource.kafka_vol
           }
          resilience: description.config.resilience
        }
      }

      minio: {
        artifact: mi.#Artifact
        config: {
          parameter: {
            minio_server_url: description.config.parameter.minio_server_url
            minio_bucket: description.config.parameter.minio_bucket
          }
          resource: {
            default_user: description.config.resource.default_user
            default_password: description.config.resource.default_password
            minio_vol: description.config.resource.minio_vol
          }
          resilience: description.config.resilience
        }
      }

      mongo: {
        artifact: mg.#Artifact
        config: {
          parameter: {
            mongo_db: description.config.parameter.mongo_db
          }
          resource: {
            default_user: description.config.resource.default_user
            default_password: description.config.resource.default_password
            mongo_vol: description.config.resource.mongo_vol
          }
          resilience: description.config.resilience
        }
      }

      worker: {
        artifact: wo.#Artifact
        config: {
          parameter: {
            worker_node_env: description.config.parameter.worker_node_env
            worker_data_folder: description.config.parameter.worker_data_folder
            kafka_url: description.config.parameter.kafka_url
            minio_url: description.config.parameter.minio_url
            minio_port: description.config.parameter.minio_port
            minio_bucket: description.config.parameter.minio_bucket
            partition_factor: description.config.parameter.partition_factor
          }
          resource: {
            default_user: description.config.resource.default_user
            default_password: description.config.resource.default_password
            worker_vol: description.config.resource.worker_vol
          }
          resilience: description.config.resilience
        }
      }

      frontend: {
        artifact: fr.#Artifact
        config: {
          parameter: {
            frontend_node_env: description.config.parameter.frontend_node_env
            frontend_production_port: description.config.parameter.frontend_production_port
            frontend_prodution_ip: description.config.parameter.frontend_prodution_ip
            kafka_url: description.config.parameter.kafka_url
            minio_url: description.config.parameter.minio_url
            minio_port: description.config.parameter.minio_port
            minio_bucket: description.config.parameter.minio_bucket
            mongo_db: description.config.parameter.mongo_db
            mongo_host: description.config.parameter.mongo_host
          }
          resource: { 
            default_user: description.config.resource.default_user
            default_password: description.config.resource.default_password
            keycloak_client: description.config.resource.keycloak_client
            keycloak_realm: description.config.resource.keycloak_realm
            keycloak_url: description.config.resource.keycloak_url
            keycloak_secret: description.config.resource.keycloak_secret
          }
          resilience: description.config.resilience
        }
      }

      observer: {
        artifact: ob.#Artifact
        config: {
          parameter: {
            observer_node_env: description.config.parameter.observer_node_env
            kafka_url: description.config.parameter.kafka_url
            refresh_rate: description.config.parameter.refresh_rate
          }
          resource: {
            
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
			  from: frontinbound: "inbound"
        to: frontend: "entrypoint": _
      }
      mongoconnector: {
        as: "lb"
        from: frontend: "mongoclient"
        to: mongo: "mongoserver": _
      }
      minioconnector: {
        as: "lb"
        from: frontend: "minioclient"
        from: worker: "minioclient"
        to: minio: "minioserver": _
      }
      kafkaconnector: {
        as: "lb"
        from: frontend: "kafkaclient"
        from: worker: "kafkaclient"
        from: observer: "kafkaclient"
        to: kafka: "kafkaserver": _
      }
      kafkazookeeperconnector: {
        as: "lb"
        from: kafka: "zkclient"
        to: zookeeper: "zkserver": _
      }
    }
  }
}
