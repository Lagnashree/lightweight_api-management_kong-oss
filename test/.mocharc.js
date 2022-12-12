module.exports= {
  "allow-uncaught": false,
  "async-only": true,
  color: true,
  diff: true,
  extension: ["js"],
  parallel: true,
  reporter: "spec",
  retries: 0,
  slow: "75",
  spec: ["test/**/*.spec.js"],
  timeout: "40000",
  ui: "bdd",
  watch: false,
  "watch-files": ["../src/**/*.js", "./**/*.js"],

};