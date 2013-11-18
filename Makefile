.PHONY : default
default:
	./node_modules/.bin/browserify --debug perf/concat.js > perf/bundle.js
	/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary perf/index.html