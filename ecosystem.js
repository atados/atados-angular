{
  apps : [
    {
      name      : "atados-web",
      script    : "server.js",
      // env: {
      //   COMMON_VARIABLE: "true"
      // },
      env_development: {
        NODE_ENV: "development"
      },
      env_production : {
        NODE_ENV: "production"
      }
    }
  ]
}
