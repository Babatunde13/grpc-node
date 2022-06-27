import path from 'path'
import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

const packageDef = protoLoader.loadSync(path.join(process.cwd(), 'proto/todo.proto'), {})
const todoPackage = grpc.loadPackageDefinition(packageDef).todoPackage

const server = new grpc.Server()

server.bind(':50051', grpc.ServerCredentials.createInsecure())

server.addService(todoPackage.Todo.service, {
    createTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo
})

server.start()

interface Todo {
    id: number
    text: string
}

let todos: Todo[] =  []

function createTodo (call, callback) {
    console.log(call)
    const newTodo: Todo = {
        id: todos.length + 1,
        text: call.request.text
    }
    todos.push(newTodo)
    callback(null, newTodo)
}

function getTodos (call, callback) {
    console.log(call)
    callback(null, todos)
}

function getTodo (call, callback) {
    console.log(call)
    const todo = todos.find((t) => t.id === call.request.id)
    callback(null, todo)
}

function updateTodo (call, callback) {
    console.log(call)
    let todo: Todo | undefined = undefined
    todos = todos.map(td => {
        if (td.id === call.request.id) {
            td.text = call.request.text
            todo = td
        }
        return td
    })
    if (!todo) {
       callback(new Error('Todo not found'))
    }
    callback(null, todo)
}

function deleteTodo (call, callback) {
    console.log(call)
    let todo: Todo | undefined = undefined
    todos = todos.filter(td => {
        if (td.id === call.request.id) {
            td.text = call.request.text
            todo = td
        }
        return td.id !== call.request.id
    })
    if (!todo) {
        callback(new Error('Todo not found'))
     }
     callback(null, todo)
}
