import 'dotenv/config'
import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { resolve, extname } from 'path'
import { Server } from 'socket.io'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

let supabase = null
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('Supabase conectado')
} else {
  console.log('Modo sin persistencia — define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
}

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
}

const httpServer = createServer((req, res) => {
  const dist = resolve('dist')
  let filePath = req.url === '/' ? '/index.html' : req.url.split('?')[0]
  const fullPath = resolve(dist + filePath)

  if (fullPath.startsWith(dist) && existsSync(fullPath)) {
    const ext = extname(fullPath)
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(readFileSync(fullPath))
  } else {
    const indexPath = resolve(dist, 'index.html')
    if (existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(readFileSync(indexPath))
    } else {
      res.writeHead(404)
      res.end('Not found')
    }
  }
})

const io = new Server(httpServer, {
  cors: { origin: '*' },
})

io.on('connection', async (socket) => {
  console.log(`Usuario conectado: ${socket.id}`)

  if (supabase) {
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .order('time', { ascending: true })

    if (messages) {
      socket.emit('chat_messages', messages)
    }
  }

  socket.on('chat_message', async (msg) => {
    const msgWithId = { ...msg, id: socket.id }

    if (supabase) {
      await supabase.from('messages').insert(msgWithId).maybeSingle()
    }

    io.emit('chat_message', msgWithId)
  })

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`)
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Servidor Socket.IO corriendo en puerto ${PORT}`)
})
