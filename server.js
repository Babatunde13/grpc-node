const path = require('path')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const packageDef = protoLoader.loadSync(path.join(process.cwd(), 'proto/todo.proto'), {})
const todoPackage = grpc.loadPackageDefinition(packageDef).todoPackage

const server = new grpc.Server()

server.addService(todoPackage.Todo.service, {
    createTodo,
    ReadTodos,
    ReadTodo,
    updateTodo,
    deleteTodo
})

server.bindAsync(':40000', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err)
        return
    }
    server.start()
    console.log(`Server listening on ${port}`)
})

let todos =  []

function createTodo (call, callback) {
    console.log('create todo', call.request)
    const newTodo = {
        id: todos.length + 1,
        text: call.request.text
    }
    todos.push(newTodo)
    callback(null, newTodo)
}

function ReadTodos(call, callback) {
    console.log('get todos', call.request)
    callback(null, { items: todos })
}

function ReadTodo (call, callback) {
    console.log('get todo', call.request)
    const todo = todos.find((t) => t.id === call.request.id)
    callback(null, todo)
}

function updateTodo (call, callback) {
    console.log('update todo', call.request)
    let todo
    let newTodos = []
    todos.forEach((t) => {
        if (t.id === call.request.id) {
            todo = t
            newTodos.push(call.request)
        } else {
            newTodos.push(t)
        }
    })
    console.log('todo', todo)
    if (!todo) {
        callback(null, 'Todo not found')
    }
    todos = newTodos
    callback(null, todo)
}

function deleteTodo (call, callback) {
    console.log('delete todo', call.request)
    let todo
    let newTodos = []
    todos.forEach((t) => {
        if (t.id === call.request.id) {
            todo = t
            newTodos.push(call.request)
        } else {
            newTodos.push(t)
        }
    })
    if (!todo) {
        callback(null, 'Todo not found')
     }
    todos = newTodos
    callback(null, todo)
}
