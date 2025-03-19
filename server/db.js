const pg = require('pg')
const DATABASE_URL = process.env.DATABASE_URL
const uuid = require('uuid')
const client = new pg.Client(DATABASE_URL)

const createTables = async () => {
    const SQL =/*sql*/ `
        DROP TABLE IF EXISTS reservations;
        DROP TABLE IF EXISTS customer;
        DROP TABLE IF EXISTS restaurant;
        CREATE TABLE customer(
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );
        CREATE TABLE restaurant(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
        CREATE TABLE reservations(
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count INTEGER NOT NULL,
            restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
            customer_id UUID REFERENCES customer(id) NOT NULL
        )
    `
    await client.query(SQL)
}

const createCustomer = async (name) => {
    const SQL = /*sql*/`
        INSERT INTO customer(id, name) 
        VALUES ($1, $2)
        RETURNING *;
    `
    const values = [uuid.v4(), name]
    const response = await client.query(SQL, values)
    return response.rows[0]
}

const createRestaurant = async (name) => {
    const SQL = /*sql*/`
        INSERT INTO restaurant (id, name) 
        VALUES ($1, $2) 
        RETURNING *;
    `
    const values = [uuid.v4(), name]
    const response = await client.query(SQL, values)
    return response.rows[0]
}

const createReservation = async ({date, party_count, restaurant_id, customer_id}) => {
    const SQL = /*sql*/ `
        INSERT INTO reservations (id, date, party_count, restaurant_id, customer_id)
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *
    `
    const values = [uuid.v4(), date,party_count, restaurant_id, customer_id]
    const response = await client.query(SQL, values)
    return response.rows[0]
}

const fetchCustomers = async () => {
    const SQL = /*sql*/ `
        SELECT * FROM customer;
    `
    const response = await client.query(SQL)
    return response.rows
}

const fetchRestaurants = async () => {
    const SQL = /*sql*/ `
        SELECT * FROM restaurant;
    `
    const response = await client.query(SQL)
    return response.rows
}

const fetchReservations = async () => {
    const SQL = /*sql*/ `
        SELECT * FROM reservations;
    `
    const response = await client.query(SQL)
    return response.rows
}

const destroyReservation = async ({customer_id, id}) => {
    const SQL = /*sql*/ `
        DELETE FROM reservations 
        WHERE customer_id = $1 AND id = $2
    `
    const values = [customer_id, id]
    await client.query(SQL, values)
}

module.exports = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    createReservation,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    destroyReservation
}