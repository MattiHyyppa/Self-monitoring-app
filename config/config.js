let config = {};

if (Deno.env.get('TEST')) {
  config.database = {
    hostname: Deno.env.get('TEST_DB_HOST'),
    database: Deno.env.get('TEST_DB_NAME'),
    user: Deno.env.get('TEST_DB_USER'),
    password: Deno.env.get('TEST_DB_PASSWORD'),
    port: Number(Deno.env.get('TEST_DB_PORT'))
  };
  console.log('Connecting to a testing database.');
}
else if (Deno.env.get('PRODUCTION')) {
  config.database = Deno.env.toObject().DATABASE_URL;
  console.log('Connecting to a production database.');
}
else if (Deno.env.get('DOCKER_ENV')) {
  config.database = {};
  console.log('Connecting to the database in Docker.');
}
else {
  config.database = {
    hostname: Deno.env.get('DB_HOST'),
    database: Deno.env.get('DB_NAME'),
    user: Deno.env.get('DB_USER'),
    password: Deno.env.get('DB_PASSWORD'),
    port: Number(Deno.env.get('DB_PORT'))
  };
  console.log('Connecting to the database.');
}

export { config };