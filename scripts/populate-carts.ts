const { Client } = require('pg');

// PostgreSQL connection configuration
const pgConfig = {
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_USER_PASS,
  port: 5432,
};

// Queries to create tables and insert data
const queries = [
  `
    INSERT INTO carts (user_id, created_at, updated_at, status)
    VALUES
      ('user1', '2023-01-01', '2023-01-02', 'OPEN'),
      ('user2', '2023-01-03', '2023-01-04', 'ORDERED'),
      ('user3', '2023-01-05', '2023-01-06', 'OPEN');
  `,
  `
    INSERT INTO cart_items (cart_id, product_id, count)
    VALUES
      ('123e4567-e89b-12d3-a456-426614174001', 'product1', 2),
      ('223e4567-e89b-12d3-a456-426614174002', 'product2', 1),
      ('323e4567-e89b-12d3-a456-426614174003', 'product3', 3);
  `,
];

// Create a PostgreSQL client
const client = new Client(pgConfig);

// Connect to the database
client.connect()
  .then(() => {
    // Execute queries sequentially
    return queries.reduce((prevQueryPromise, query) => {
      return prevQueryPromise.then(() => client.query(query));
    }, Promise.resolve());
  })
  .then(() => console.log('Queries executed successfully'))
  .catch(error => console.error('Error executing queries:', error))
  .finally(() => {
    // Disconnect from the database
    client.end();
  });