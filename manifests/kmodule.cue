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
	dependencies: {
		"kumori.systems/kumori": {
			query:  "1.0.11"
			target: "kumori.systems/kumori/@1.0.11"
		}
		"kumori.systems/builtins/inbound": {
			query:  "1.1.0"
			target: "kumori.systems/builtins/inbound/@1.1.0"
		}
	}
	sums: {
		"kumori.systems/kumori/@1.0.11":          "wEmCo3JdBB/eOBCqEXTltNjCypVjgEX/x8LKfMnlYN0="
		"kumori.systems/builtins/inbound/@1.1.0": "hj+cMB0LhH0c6S30FpuuOd5KsMpmaFZVgukDWMkZCxA="
	}
	artifacts: {
		frontend:           "component"
		worker:             "component"
		cache:              "component"
		service_nocache:    "service"
		service_cache:      "service"
		service_cache_tags: "service"
	}
}
