package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "zookeeper"

  description: {

    srv: {
      server: {
        zkserver: { protocol: "tcp", port: 2181 }
      }
    }

    config: {
      resource: {
        zookeeper_client_port: k.#Secret
        zookeeper_tick_time: k.#Secret
      }
    }
    
    size: {
      bandwidth: { size: 15, unit: "M" }
    }

    code: zookeeper: {
      name: "zookeeper"
      image: {
        hub: { name: "", secret: "" }
        tag: "confluentinc/cp-zookeeper:latest"
      }      
      mapping: {
        env: {
          ZOOKEEPER_CLIENT_PORT: secret: "zookeeper_client_port"
          ZOOKEEPER_TICK_TIME: secret: "zookeeper_tick_time"
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
