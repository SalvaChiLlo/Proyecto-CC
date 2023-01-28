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
      parameter: {
        zookeeper_client_port: number
        zookeeper_tick_time: number
      }
      resource: {
        zookeeper_vol: k.#Volume
      }
    }
    
    size: {
      bandwidth: { size: 100, unit: "M" }
    }

    code: zookeeper: {
      name: "zookeeper"
      image: {
        hub: { name: "", secret: "" }
        tag: "confluentinc/cp-zookeeper:latest"
      }      
      mapping: {
        env: {
          ZOOKEEPER_CLIENT_PORT: parameter: "zookeeper_client_port"
          ZOOKEEPER_TICK_TIME: parameter: "zookeeper_tick_time"
        }
      }
      size: {
        memory: { size: 1, unit: "G" }
        mincpu: 500
        cpu: { size: 2000, unit: "m" }
      }
    }

  }
}
