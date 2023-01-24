#!/bin/bash

CLUSTERNAME="..."
REFERENCEDOMAIN="vera.kumori.cloud"
INBOUNDNAME="system_in"
SECURITY_INBOUNDNAME="security_kc"
DEPLOYNAME="proyectoccdep"
SECURITY_DEPLOYNAME="securitydepl"
DOMAIN="proyectocc"
SECURITY_DOMAIN="kc"
SERVICEURL="proyectocc.${REFERENCEDOMAIN}"
SERVICE_SECURITY_URL="kc.${REFERENCEDOMAIN}"
CLUSTERCERT="cluster.core/wildcard-vera-kumori-cloud"

KUMORICTL_CMD="kam ctl"
KAM_CMD="kam"

# Using with development cluster
#CLUSTERNAME="devtesting"
#REFERENCEDOMAIN="test.deployedin.cloud"
#CLUSTERCERT="cluster.core/wildcard-test-deployedin-cloud"

case $1 in

'refresh-dependencies')
  cd manifests
	${KAM_CMD} mod dependency --delete kumori.systems/kumori
	${KAM_CMD} mod dependency kumori.systems/kumori/@1.0.11
  ${KAM_CMD} mod relink
  cd ..
  ;;

'deploy-all')
  $0 refresh-dependencies
  $0 create-volumes
  $0 create-secrets
  $0 create-domain
  $0 create-security-domain
  $0 deploy-inbound
  $0 deploy-security-inbound
  $0 deploy-service
  $0 deploy-security-service
  $0 link
  $0 link-security
  $0 describe
  $0 describe-security
;;

'describe-all')
  $0 describe
  $0 describe-security
;;


'create-volumes')
  ${KUMORICTL_CMD} register volume postgres_vol \
  --items 5 \
  --size 500Mi \
  --type persistent
  ${KUMORICTL_CMD} register volume mongo_vol \
  --items 5 \
  --size 500Mi \
  --type persistent
  ${KUMORICTL_CMD} register volume minio_vol \
  --items 5 \
  --size 500Mi \
  --type persistent
  ;;

'create-secrets')
  ${KUMORICTL_CMD} register secret zookeeper_client_port --from-data 2181
  ${KUMORICTL_CMD} register secret zookeeper_tick_time --from-data 2000
  ${KUMORICTL_CMD} register secret kafka_broker_id --from-data 1
  ${KUMORICTL_CMD} register secret kafka_zookeeper_connect --from-data zookeeper:2181
  ${KUMORICTL_CMD} register secret kafka_advertised_listeners --from-data PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
  ${KUMORICTL_CMD} register secret kafka_listener_security_protocol_map --from-data PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
  ${KUMORICTL_CMD} register secret kafka_inter_broker_listener_name --from-data PLAINTEXT
  ${KUMORICTL_CMD} register secret kafka_offsets_topic_replication_factor --from-data 1
  ${KUMORICTL_CMD} register secret kafka_clusters_0_name --from-data local
  ${KUMORICTL_CMD} register secret kafka_clusters_0_bootstrapservers --from-data kafka:9092
  ${KUMORICTL_CMD} register secret kafka_clusters_0_metrics_port --from-data 9997
  ${KUMORICTL_CMD} register secret minio_root_user --from-data admin
  ${KUMORICTL_CMD} register secret minio_root_password --from-data adminadmin
  ${KUMORICTL_CMD} register secret minio_server_url --from-data http://dev.int:9000
  ${KUMORICTL_CMD} register secret minio_port --from-data 9000
  ${KUMORICTL_CMD} register secret minio_url --from-data minio
  ${KUMORICTL_CMD} register secret minio_bucket --from-data proyecto-cc
  ${KUMORICTL_CMD} register secret postgres_db --from-data keycloak
  ${KUMORICTL_CMD} register secret postgres_db_url --from-data jdbc:postgresql://0.dbclient:5432/keycloak
  ${KUMORICTL_CMD} register secret postgres_username --from-data postgres
  ${KUMORICTL_CMD} register secret postgres_password --from-data adminadmin
  ${KUMORICTL_CMD} register secret pgdata --from-data /var/lib/postgresql/data/pgdata
  ${KUMORICTL_CMD} register secret keycloak_admin --from-data admin
  ${KUMORICTL_CMD} register secret keycloak_admin_password --from-data adminadmin
  ${KUMORICTL_CMD} register secret kc_db --from-data postgres
  ${KUMORICTL_CMD} register secret kc_db_url --from-data jdbc:postgresql://postgres:5432/keycloak
  ${KUMORICTL_CMD} register secret kc_db_username --from-data postgres
  ${KUMORICTL_CMD} register secret kc_db_password --from-data adminadmin
  ${KUMORICTL_CMD} register secret mongo_username --from-data admin
  ${KUMORICTL_CMD} register secret mongo_password --from-data adminadmin
  ${KUMORICTL_CMD} register secret mongo_database --from-data proyectocc
  ${KUMORICTL_CMD} register secret mongo_host --from-data mongo:27017
  ${KUMORICTL_CMD} register secret mongo_url --from-data mongodb://admin:adminadmin@mongo:27017/
  ${KUMORICTL_CMD} register secret worker_node_env --from-data production
  ${KUMORICTL_CMD} register secret worker_data_folder --from-data /tmp/jobexecutor
  ${KUMORICTL_CMD} register secret partition_factor --from-data 2
  ${KUMORICTL_CMD} register secret frontend_node_env --from-data production
  ${KUMORICTL_CMD} register secret frontend_production_port --from-data 80
  ${KUMORICTL_CMD} register secret frontend_production_ip --from-data 0.0.0.0
  ${KUMORICTL_CMD} register secret observer_node_env --from-data production
  ${KUMORICTL_CMD} register secret refresh_rate --from-data 20
  ;;

'create-domain')
  ${KUMORICTL_CMD} register domain $DOMAIN --domain $SERVICEURL
  ;;

'create-security-domain')
  ${KUMORICTL_CMD} register domain $SECURITY_DOMAIN --domain $SERVICE_SECURITY_URL
  ;;

'deploy-inbound')
  ${KUMORICTL_CMD} register inbound $INBOUNDNAME \
    --domain $DOMAIN \
    --cert $CLUSTERCERT
  ;;

'deploy-security-inbound')
  ${KUMORICTL_CMD} register inbound $SECURITY_INBOUNDNAME \
    --domain $SECURITY_DOMAIN \
    --cert $CLUSTERCERT
  ;;

'deploy-service')
  ${KUMORICTL_CMD} register deployment $DEPLOYNAME \
    --deployment ./manifests/deployment_system \
    --wait 5m
  $0 link
  ;;


'deploy-security-service')
  ${KUMORICTL_CMD} register deployment $SECURITY_DEPLOYNAME \
    --deployment ./manifests/deployment_security \
    --comment "Deploy KeyCloak and PostgreSQL" \
    --wait 5m
  $0 link-security
  ;;

'link')
  ${KUMORICTL_CMD} link $DEPLOYNAME:service $INBOUNDNAME:inbound
  ;;


'link-security')
  ${KUMORICTL_CMD} link $SECURITY_DEPLOYNAME:service $SECURITY_INBOUNDNAME:inbound
  ;;

'describe')
  ${KUMORICTL_CMD} describe deployment $DEPLOYNAME
  echo
  echo
  ${KUMORICTL_CMD} describe deployment $INBOUNDNAME
  ;;

'describe-security')
  ${KUMORICTL_CMD} describe deployment $SECURITY_DEPLOYNAME
  echo
  echo
  ${KUMORICTL_CMD} describe deployment $SECURITY_INBOUNDNAME
  ;;


'describe-details')
  ${KUMORICTL_CMD} describe deployment $DEPLOYNAME -odetails
  echo
  echo
  ${KUMORICTL_CMD} describe deployment $INBOUNDNAME -odetails
  ;;

'describe-security-details')
  ${KUMORICTL_CMD} describe deployment $SECURITY_DEPLOYNAME -odetails
  echo
  echo
  ${KUMORICTL_CMD} describe deployment $SECURITY_INBOUNDNAME -odetails
  ;;

'update-security')
  ${KUMORICTL_CMD} update deployment $SECURITY_DEPLOYNAME \
    --deployment ./manifests/deployment_security \
    --yes \
    --wait 5m
  ;;

'update-system')
  ${KUMORICTL_CMD} update deployment $DEPLOYNAME \
    --deployment ./manifests/deployment_system \
    --yes \
    --wait 5m
  ;;

'undeploy-all')
  ${KUMORICTL_CMD} unlink $DEPLOYNAME:service $INBOUNDNAME:inbound --wait 5m
  ${KUMORICTL_CMD} unlink $SECURITY_DEPLOYNAME:service $SECURITY_INBOUNDNAME:inbound --wait 5m
  ${KUMORICTL_CMD} unregister deployment $DEPLOYNAME --wait 5m --force
  ${KUMORICTL_CMD} unregister deployment $INBOUNDNAME --wait 5m
  ${KUMORICTL_CMD} unregister deployment $SECURITY_DEPLOYNAME --wait 5m --force
  ${KUMORICTL_CMD} unregister deployment $SECURITY_INBOUNDNAME --wait 5m
  ${KUMORICTL_CMD} unregister secret zookeeper_client_port
  ${KUMORICTL_CMD} unregister secret zookeeper_tick_time
  ${KUMORICTL_CMD} unregister secret kafka_broker_id
  ${KUMORICTL_CMD} unregister secret kafka_zookeeper_connect
  ${KUMORICTL_CMD} unregister secret kafka_advertised_listeners
  ${KUMORICTL_CMD} unregister secret kafka_listener_security_protocol_map
  ${KUMORICTL_CMD} unregister secret kafka_inter_broker_listener_name
  ${KUMORICTL_CMD} unregister secret kafka_offsets_topic_replication_factor
  ${KUMORICTL_CMD} unregister secret kafka_clusters_0_name
  ${KUMORICTL_CMD} unregister secret kafka_clusters_0_bootstrapservers
  ${KUMORICTL_CMD} unregister secret kafka_clusters_0_metrics_port
  ${KUMORICTL_CMD} unregister secret minio_root_user
  ${KUMORICTL_CMD} unregister secret minio_root_password
  ${KUMORICTL_CMD} unregister secret minio_server_url
  ${KUMORICTL_CMD} unregister secret minio_port
  ${KUMORICTL_CMD} unregister secret minio_url
  ${KUMORICTL_CMD} unregister secret minio_bucket
  ${KUMORICTL_CMD} unregister secret postgres_db
  ${KUMORICTL_CMD} unregister secret postgres_db_url
  ${KUMORICTL_CMD} unregister secret postgres_username
  ${KUMORICTL_CMD} unregister secret postgres_password
  ${KUMORICTL_CMD} unregister secret pgdata
  ${KUMORICTL_CMD} unregister secret keycloak_admin
  ${KUMORICTL_CMD} unregister secret keycloak_admin_password
  ${KUMORICTL_CMD} unregister secret kc_db
  ${KUMORICTL_CMD} unregister secret kc_db_url
  ${KUMORICTL_CMD} unregister secret kc_db_username
  ${KUMORICTL_CMD} unregister secret kc_db_password
  ${KUMORICTL_CMD} unregister secret mongo_username
  ${KUMORICTL_CMD} unregister secret mongo_password
  ${KUMORICTL_CMD} unregister secret mongo_database
  ${KUMORICTL_CMD} unregister secret mongo_host
  ${KUMORICTL_CMD} unregister secret mongo_url
  ${KUMORICTL_CMD} unregister secret worker_node_env
  ${KUMORICTL_CMD} unregister secret worker_data_folder
  ${KUMORICTL_CMD} unregister secret partition_factor
  ${KUMORICTL_CMD} unregister secret frontend_node_env
  ${KUMORICTL_CMD} unregister secret frontend_production_port
  ${KUMORICTL_CMD} unregister secret frontend_production_ip
  ${KUMORICTL_CMD} unregister secret observer_node_env
  ${KUMORICTL_CMD} unregister secret refresh_rate
  ${KUMORICTL_CMD} unregister domain $DOMAIN
  ${KUMORICTL_CMD} unregister domain $SECURITY_DOMAIN
  ${KUMORICTL_CMD} unregister volume postgres_vol
  ${KUMORICTL_CMD} unregister volume mongo_vol
  ${KUMORICTL_CMD} unregister volume minio_vol
  ;;

*)
  echo "This script doesn't contain that command"
	;;

esac
