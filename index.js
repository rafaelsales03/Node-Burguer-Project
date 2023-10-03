const express = require("express")
const uuid = require("uuid")

const port = 3000
const app = express()
app.use(express.json())


const orders = []


const checkOrderId = (request, response, next) => {

    const { id } = request.params

    const index = orders.findIndex(user => user.id === id)

    if (index < 0) {

        return response.status(404).json({ error: 'Order not found' })

    }

    request.orderIndex = index
    request.orderId = id

    next()


}

const checkUrl = (request, response, next) => {

    console.log(request.method)
    console.log(request.url)

    next()
}


app.get('/orders', checkUrl, (request, response) => {

    return response.json(orders)


})

app.post('/orders', checkUrl, (request, response) => {

    const { name, clientName, price, status } = request.body

    const order = { id: uuid.v4(), name, clientName, price, status: 'Em preparação' }

    orders.push(order)

    return response.status(201).json(order)

})

app.put('/orders/:id', checkOrderId, checkUrl, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex

    const { name, clientName, price, status } = request.body
    const updatedOrder = { id, name, clientName, price, status }


    orders[index] = updatedOrder

    return response.json(updatedOrder)


})

app.delete('/orders/:id', checkOrderId, checkUrl, (request, response) => {

    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json({ message: "Order deleted" })


})

app.get('/orders/:id', checkOrderId, checkUrl, (request, response) => {

    const index = request.orderIndex
    const id = request.orderId

    return response.status(201).json(orders[index])


})

app.patch('/orders/:id', checkOrderId, checkUrl, (request, response) => {

    const index = request.orderIndex
    const id = request.orderId

    const { name, clientName, price, status } = request.body

    const updatedOrder = { id, name: orders[index].name, clientName: orders[index].clientName, price: orders[index].price, status: "Pronto" }

    orders[index] = updatedOrder

    return response.json(updatedOrder)


})

app.listen(port, () => {

    console.log(`🤪 Server started on port ${port}`)

}) 