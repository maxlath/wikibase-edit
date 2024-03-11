# wikibase-edit browser demo

To run wikibase-edit in the browser, you need a bundler. In this demo we use `esbuild` (see [`build.sh`](./build.sh)).
```sh
cd browser-demo
./build.sh
```

You can then use a file server to serve the files in this directory and test wikibase-edit in the browser. Note that the edit will only work if the page is served under HTTPS.