const path = require('path')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const packageDef = protoLoader.loadSync(path.join(process.cwd(), 'proto/todo.proto'), {})
const todoPackage = grpc.loadPackageDefinition(packageDef).todoPackage
console.log('Starting gRPC client...');
main();

function main() {
    const client = new todoPackage.Todo('localhost:40000', grpc.credentials.createInsecure());
    client.deleteTodo({id: 1}, function(err, response) {
        if (err) {
            console.log('error deleting todo:', err);
            return
        }
        console.log('delete todo:', response);
    });
    client.updateTodo({id: 1, text: 'Wash clothes'}, function(err, response) {
        if (err) {
            console.log('error updating todo:', err);
            return
        }
        console.log('update todo:', response);
    });
    client.ReadTodo({id: 1}, function(err, response) {
        if (err) {
            console.log('error fetching todo by id:', err);
            return
        }
      console.log('get todo by id:', response);
    });
    client.ReadTodos({}, function(err, response) {
        if (err) {
            console.log('error reading todo:', err);
            return
        }
      console.log('get todos:', response);
    });
    client.createTodo({ text: 'Wash clothe', id: -1 }, function(err, response) {
        if (err) {
            console.log('error creating todo:', err);
            return
        }
      console.log('create todo response:', response);
    });
}
