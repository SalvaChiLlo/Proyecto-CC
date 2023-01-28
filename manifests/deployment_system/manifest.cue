package deployment

import (
  s ".../service_system:service"
)

#Deployment: {
  name: "system_depl"
  artifact: s.#Artifact
  config: {
    parameter: {
      frontend_node_env: "production"
      frontend_production_port: 80
      frontend_prodution_ip: "0.0.0.0"
      mongo_host: "0.mongoclient:80"
      kafka_cfg_zookeeper_connect: "set.0.zkclient:2181"
      kafka_cfg_num_partitions: 10
      allow_plaintext_listener: "yes"
      kafka_cfg_listener: "PLAINTEXT://:9092"
      minio_server_url: "http://minioclient:80"
      mongo_db: "proyectocc"
      observer_node_env: "production"
      refresh_rate: 20
      worker_node_env: "production"
      worker_data_folder: "/jobexecutor"
      kafka_url: "0.kafkaclient:80"
      minio_url: "0.minioclient"
      minio_port: 80
      minio_bucket: "proyecto-cc"
      partition_factor: 2
      zookeeper_client_port: 2181
      zookeeper_tick_time: 2000
    }
    resource: {
      default_user: secret: "default_user"
      default_password: secret: "default_password"
      keycloak_client: secret: "keycloak_client"
      keycloak_realm: secret: "keycloak_realm"
      keycloak_url: secret: "keycloak_url"
      keycloak_secret: secret: "keycloak_secret"
      mongo_vol: volume: {size: 10, unit: "G"}
      minio_vol: volume: {size: 5, unit: "G"}
      zookeeper_vol: volume: {size: 15, unit: "G"}
      kafka_vol: volume: {size: 15, unit: "G"}
      worker_vol: volume: {size: 15, unit: "G"}
      servercert: certificate: "cluster.core/wildcard-vera-kumori-cloud"
      serverdomain: domain: "proyectocc"
    }
    scale: detail: {
      zookeeper: hsize: 1
      kafka: hsize: 1
      minio: hsize: 1
      mongo: hsize: 1
      worker: hsize: 1
      frontend: hsize: 1
      observer: hsize: 1
    }
    resilience: 0
  }
}