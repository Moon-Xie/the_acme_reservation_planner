require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(morgan('dev'))
app.use(express.json())
const PORT = process.env.PORT
const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    createReservation
} = require('./db')

const init = async () => {
    console.log('Connecting with database...')
    await client.connect()
    console.log('Database connected!')
    await createTables()
    console.log('Created tables!')
    const [Moon, Hunter, Bojack, whyNot, appleBee, buffet] = await Promise.all([
        createCustomer("Moon"),
        createCustomer("Hunter"),
        createCustomer("Bojack"),
        createRestaurant("Why Not"),
        createRestaurant("AppleBee"),
        createRestaurant("Buffet")
    ])
    
    const [reservation, reservation1] = await Promise.all([
        createReservation({
            date: '4/18/2025',
            party_count: 3,
            restaurant_id: appleBee.id,
            customer_id: Moon.id
        }),
        createReservation({
            date: '5/30/2025',
            party_count: 3,
            restaurant_id: buffet.id,
            customer_id: Bojack.id
        })
    ])
    
    app.listen(PORT, () => {
        console.log('Server is listening to', PORT)
    })

}
init()