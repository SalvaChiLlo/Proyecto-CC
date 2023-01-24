package deployment
// If a package name other than "deployment" is used, then the
// "kumorictl register deployment" operation must include the "--package" flag.

import (
  s ".../service_system:service"
)

#Deployment: {
  name: "system_depl"
  artifact: s.#Artifact
  config: {
    resource: {
      zookeeper_client_port: secret: "zookeeper_client_port"
      zookeeper_tick_time: secret: "zookeeper_tick_time"
      kafka_broker_id: secret: "kafka_broker_id"
      kafka_zookeeper_connect: secret: "kafka_zookeeper_connect"
      kafka_advertised_listeners: secret: "kafka_advertised_listeners"
      kafka_listener_security_protocol_map: secret: "kafka_listener_security_protocol_map"
      kafka_inter_broker_listener_name: secret: "kafka_inter_broker_listener_name"
      kafka_offsets_topic_replication_factor: secret: "kafka_offsets_topic_replication_factor"
      kafka_clusters_0_name: secret: "kafka_clusters_0_name"
      kafka_clusters_0_bootstrapservers: secret: "kafka_clusters_0_bootstrapservers"
      kafka_clusters_0_metrics_port: secret: "kafka_clusters_0_metrics_port"
      minio_root_user: secret: "minio_root_user"
      minio_root_password: secret: "minio_root_password"
      minio_server_url: secret: "minio_server_url"
      minio_port: secret: "minio_port"
      minio_url: secret: "minio_url"
      minio_bucket: secret: "minio_bucket"
      pgdata: secret: "pgdata"
      mongo_username: secret: "mongo_username"
      mongo_password: secret: "mongo_password"
      mongo_database: secret: "mongo_database"
      mongo_url: secret: "mongo_url"
      mongo_host: secret: "mongo_host"
      worker_node_env: secret: "worker_node_env"
      worker_data_folder: secret: "worker_data_folder"
      partition_factor: secret: "partition_factor"
      frontend_node_env: secret: "frontend_node_env"
      frontend_production_port: secret: "frontend_production_port"
      frontend_production_ip: secret: "frontend_production_ip"
      observer_node_env: secret: "observer_node_env"
      refresh_rate: secret: "refresh_rate"
      mongo_vol: volume: "mongo_vol"
      minio_vol: volume: "minio_vol"
    }
    scale: detail: {
      zookeeper: hsize: 1
      kafka: hsize: 1
      // kafka_ui: hsize: 1
      minio: hsize: 1
      mongo: hsize: 1
      // mongo_express: hsize: 1
      worker: hsize: 1
      frontend: hsize: 1
      observer: hsize: 1
    }
    resilience: 0
  }
}