package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "observer"

  description: {

    srv: {
      client: {
        kafkaclient: { protocol: "tcp" }
      }
    }

    config: {
      resource: {
        observer_node_env: k.#Secret
        kafka_clusters_0_bootstrapservers: k.#Secret
        refresh_rate: k.#Secret
      }
    }
    
    size: {
      bandwidth: { size: 15, unit: "M" }
    }

    code: observer: {
      name: "observer"
      image: {
        hub: { name: "", secret: "" }
        tag: "salvachll/observer-proyectocc"
      }      
      mapping: {
        env: {
          NODE_ENV: secret: "observer_node_env"
          PRODUCTION_KAFKA_URL: secret: "kafka_clusters_0_bootstrapservers"
          REFRESH_RATE: secret: "refresh_rate"
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
