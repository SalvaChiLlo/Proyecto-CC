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
  $0 create-secrets
  $0 create-domains
  # $0 deploy-service
  $0 deploy-security-service
  $0 describe-all
;;

'describe-all')
  $0 describe
  $0 describe-security
;;

'create-secrets')
  ${KUMORICTL_CMD} register secret keycloak_admin_password --from-data adminadmin
  ;;

'create-domains')
  ${KUMORICTL_CMD} register domain $DOMAIN --domain $SERVICEURL
  ${KUMORICTL_CMD} register domain $SECURITY_DOMAIN --domain $SERVICE_SECURITY_URL
  ;;

'deploy-service')
  ${KUMORICTL_CMD} register deployment $DEPLOYNAME \
    --deployment ./manifests/deployment_system \
    --wait 5m
  ;;


'deploy-security-service')
  ${KUMORICTL_CMD} register deployment $SECURITY_DEPLOYNAME \
    --deployment ./manifests/deployment_security \
    --comment "Deploy KeyCloak and PostgreSQL" \
    --wait 5m
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
  # ${KUMORICTL_CMD} describe deployment $INBOUNDNAME
  ;;

'describe-security')
  ${KUMORICTL_CMD} describe deployment $SECURITY_DEPLOYNAME
  echo
  echo
  # ${KUMORICTL_CMD} describe deployment $SECURITY_INBOUNDNAME
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
  ${KUMORICTL_CMD} unregister deployment $DEPLOYNAME --wait 5m --force
  ${KUMORICTL_CMD} unregister deployment $SECURITY_DEPLOYNAME --wait 5m --force
  ${KUMORICTL_CMD} unregister secret keycloak_admin_password
  ;;

*)
  echo "This script doesn't contain that command"
	;;

esac
