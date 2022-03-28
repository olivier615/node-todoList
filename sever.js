const http = require('http')
const { v4: uuidv4 } = require('uuid')
const { successHandel, errorHandle } = require('./responseHandle.js')
const todos = []

const requestListener = (request, response) => {
    let body = ''
    request.on('data', chunk => {
        body += chunk
    })
    if (request.url === '/todos' && request.method === 'GET') {
        successHandel(response, todos)
    } else if (request.url === '/todos' && request.method === 'POST') {
        request.on('end', () => {
            try {
                const title = JSON.parse(body).title
                if (title !== undefined) {
                    const todo = {
                        'title': title,
                        'id': uuidv4()
                    }
                    todos.push(todo)
                    successHandel(response, todos)
                } else {
                    errorHandle(response, 400, '無 title 資料')
                }
            } catch {
                errorHandle(response, 400, '資料格式不正確')
            }
        })
    } else if (request.url === '/todos' && request.method === 'DELETE') {
        todos.length = 0
        successHandel(response, todos)
    } else if (request.url.startsWith('/todos/') && request.method === 'DELETE') {
        const id = request.url.split('/').pop()
        const index = todos.findIndex(item => item.id === id)
        if (index !== -1) {
            todos.splice(index, 1)
            successHandel(response, todos)
        } else {
            errorHandle(response, 400, '找不到此 id')
        }
    } else if (request.url.startsWith('/todos/') && request.method === 'PATCH') {
        request.on('end', () => {
            try {
                const todo = JSON.parse(body).title
                const id = request.url.split('/').pop()
                const index = todos.findIndex(item => item.id === id)
                if (todo !== undefined && index !== -1) {
                    todos[index].title = todo
                    successHandel(response, todos)
                } else {
                    errorHandle(response, 400, '找不到 id 或 id 不正確')
                }
            } catch {
                errorHandle(response, 400, '資料格式不正確')
            }
        })
    } else if (request.url === '/todos' && request.method === 'OPTIONS') {
        // for preflight 表示可以支援跨網域
        response.writeHead(200, header)
        response.end()
    } else {
        errorHandle(response, 404, 'not found 404')
    }
}

const sever = http.createServer(requestListener)
sever.listen(process.env.PORT || 3005)
