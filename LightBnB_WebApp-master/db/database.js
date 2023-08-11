const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

pool
  .connect()
  .then(() => console.log("connected"))
  .catch((err) => console.log(err.message));

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((res) => { return res.rows[0];})
    .catch((error) => {
      console.log(`Login Error: ${error.message}`);
      return null;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1;`, [id])
    .then((res) => { return res.rows[0]; })
    .catch((error) => {
      console.log(`Login Error: ${error.message}`);
      return null;
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const { name, email, password} = user;

  return pool
    .query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3) RETURNING *;`,
      [name, email, password]
    )
    .then((res) => {
      console.log(`New user added with id: ${res.rows[0].id}`);
      return res.rows[0];
    })
    .catch((error) => {
      console.log(user);
      console.log(`Sign up error: ${error.message}`);
      return null;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(
      `SELECT reservations.*, properties.*, avg(property_reviews.rating), property_reviews.*
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id, property_reviews.id
      ORDER BY start_date DESC
      LIMIT $2;`,
      [guest_id, limit]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  const { city, owner_id, minimum_price_per_night, maximum_price_per_night, minimum_rating } = options;
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1 = 1
  `;

  if (city) {
    queryParams.push(`%${city}%`);
    queryString += `AND city ILIKE $${queryParams.length} `;
  }

  if (owner_id) {
    queryParams.push(`${owner_id}`);
    queryString += ` AND properties.owner_id  = $${queryParams.length}`;
  }

  if (minimum_price_per_night) {
    queryParams.push(`${minimum_price_per_night * 100}`);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }

  if (maximum_price_per_night) {
    queryParams.push(`${maximum_price_per_night * 100}`);
    queryString += ` AND cost_per_night <= $${queryParams.length} `;
  }

  queryString += ` GROUP BY properties.id `;

  if (minimum_rating) {
    queryParams.push(`${minimum_rating}`);
    queryString += `HAVING AVG(rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};`;

  return pool.query(queryString, queryParams).then((res) => res.rows);
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {

  //Validate the property object
  if (!property) {
    console.log('Invalid property object.')
    return Promise.resolve(null);
  }

  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
  ];

  const queryString = `
  INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 )
  RETURNING *;`;

  return pool
    .query(queryString, queryParams)
    .then((res) => {
      console.log(`New property added with id: ${res.rows[0].id}`);
      return res.rows[0];
    })
    .catch((error) => {
      console.log(error.message);
      return null;
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
