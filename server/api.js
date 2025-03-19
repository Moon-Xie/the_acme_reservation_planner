const apiRouter = require('express').Router()
const {
    client,
    createReservation,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    destroyReservation 
} = require('./db')

//GET Route - /api/customers
apiRouter.get('/customers', async(req, res, next) => {
    try {
        const response = await fetchCustomers()
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})

//GET Route - /api/restaurants
apiRouter.get('/restaurants', async(req, res, next) => {
    try {
        const response = await fetchRestaurants()
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})

//GET Route - /api/reservations
apiRouter.get('/reservations', async(req, res, next) => {
    try {
        const response = await fetchReservations()
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})

//POST Route - /api/customers/:id/reservations
apiRouter.post('/customers/:id/reservations', async(req, res, next) => {
    try {
        const response = await createReservation({
            date: req.body.date,
            party_count: req.body.party_count,
            restaurant_id: req.body.restaurant_id,
            customer_id: req.params.id
        })
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})

//DELETE Route - /api/customers/:customer_id/reservations/:id
apiRouter.delete('/customers/:customer_id/reservations/:id', async(req, res, next) => {
    try {
        await destroyReservation({
            customer_id: req.params.customer_id,
            id: req.params.id
        })
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

module.exports = apiRouter