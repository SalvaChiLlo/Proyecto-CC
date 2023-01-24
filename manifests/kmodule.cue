package kmodule

{
	domain: "kumori.examples"
	module: "calccache"
	version: [
		3,
		0,
		7,
	]
	cue: "v0.4.1"
	spec: [
		1,
		0,
	]
	dependencies: "kumori.systems/kumori": {
		query:  "1.0.11"
		target: "kumori.systems/kumori/@1.0.11"
	}
	sums: {}
	artifacts: {
		frontend:           "component"
		worker:             "component"
		cache:              "component"
		service_nocache:    "service"
		service_cache:      "service"
		service_cache_tags: "service"
	}
}
