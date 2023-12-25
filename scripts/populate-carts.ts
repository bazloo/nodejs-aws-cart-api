const { Client } = require('pg');

// PostgreSQL connection configuration
const pgConfig = {
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_USER_PASS,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
};

const createCartTable = `CREATE TABLE public.carts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL,
        status VARCHAR(10) CHECK (status IN ('OPEN', 'ORDERED'))
    );`

const createCartItemsTable = `CREATE TABLE public.cart_items (
        cart_id UUID REFERENCES public.carts(id),
        product_id UUID,
        count INTEGER,
        PRIMARY KEY (cart_id, product_id)
    );`

const populateCarts = [
  `
    INSERT INTO carts (user_id, created_at, updated_at, status)
    VALUES
      ('223e4567-e89b-12d3-a456-426614174004', '2023-01-01', '2023-01-02', 'OPEN') RETURNING id;
  `,
  `
    INSERT INTO carts (user_id, created_at, updated_at, status)
    VALUES
      ('223e4567-e89b-12d3-a456-426614174005', '2023-01-03', '2023-01-04', 'ORDERED') RETURNING id;
  `,
  `
    INSERT INTO carts (user_id, created_at, updated_at, status)
    VALUES
      ('223e4567-e89b-12d3-a456-426614174006', '2023-01-05', '2023-01-06', 'OPEN') RETURNING id;
  `,
];

const populateCartItems = [
  `
    INSERT INTO cart_items (cart_id, product_id, count)
    VALUES
      ('{cartId}', '223e4567-e89b-12d3-a456-426614174007', 1),
  `,
  `
    INSERT INTO cart_items (cart_id, product_id, count)
    VALUES
      ('{cartId}', '223e4567-e89b-12d3-a456-426614174007', 2),
  `,
  `
    INSERT INTO cart_items (cart_id, product_id, count)
    VALUES
      ('{cartId}', '223e4567-e89b-12d3-a456-426614174007', 3),
  `,
]

// Create a PostgreSQL client
const client = new Client(pgConfig);

// Connect to the database
client.connect()
  .then(async () => {
    // Drop tables if exits
    await Promise.all([
      client.query('DROP TABLE IF EXISTS cart_items'),
      client.query('DROP TABLE IF EXISTS carts')
    ]);

    // Creates new tables
    await Promise.all([
      client.query(createCartTable),
      client.query(createCartItemsTable)
    ]);

    // Populate with data
    const results = await Promise.all(populateCarts.map((q) => client.query(q)));
    // console.log(populateCartItems.map((q, i) => q.replace('{cartId}', results[i].rows[0].id)));
    await Promise.all(populateCartItems.map((q, i) => client.query(q.replace('{cartId}', results[i].rows[0].id))));
  })
  .then(() => console.log('Queries executed successfully'))
  .catch(error => console.error('Error executing queries:', error))
  .finally(() => {
    // Disconnect from the database
    client.end();
  });