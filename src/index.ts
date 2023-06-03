import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import cors from 'cors';
import { IMessageGetParams, IUser } from './types';

const app: Express = express();
const port = 4000;

app.use(cors());

const httpServer = new http.Server(app);

const socketIO = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
  },
});

let users: IUser[] = [];

socketIO.on('connection', (socket: any) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('message', (data: IMessageGetParams) => {
    socketIO.emit('messageResponse', data);
  });

  socket.on('typing', (data: string) =>
    socket.broadcast.emit('typingResponse', data),
  );

  socket.on('newUser', (data: IUser) => {
    users.push(data);
    socketIO.emit('newUserResponse', users);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    users = users.filter(user => user.socketID !== socket.id);
    socketIO.emit('newUserResponse', users);
    socket.disconnect();
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, this is Express');
});

httpServer.listen(port, () => {
  console.log(`[Server]: I am running at ${port}`);
});
