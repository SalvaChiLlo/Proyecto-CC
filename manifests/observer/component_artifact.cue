package component

// import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "observer"

  description: {

    srv: {
      client: {
        kafkaclient: { protocol: "tcp" }
      }
    }

    config: {
      parameter: {
        observer_node_env: string
        kafka_url: string
        refresh_rate: number
      }
      resource: {

      }
    }
    
    size: {
      bandwidth: { size: 100, unit: "M" }
    }

    code: observer: {
      name: "observer"
      image: {
        hub: { name: "", secret: "" }
        tag: "salvachll/observer-proyectocc:latest"
      }      
      mapping: {
        env: {
          NODE_ENV: parameter: "observer_node_env"
          PRODUCTION_KAFKA_URL: parameter: "kafka_url"
          REFRESH_RATE: parameter: "refresh_rate"
        }

      }
      size: {
        memory: { size: 2, unit: "G" }
        mincpu: 1000
        cpu: { size: 2000, unit: "m" }
      }
    }

  }
}
