const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

class SoppingList {
  constructor() {
    this.ideas = [];
  }


  async find() { 
    return this.ideas  
  }


  async create(data) {
    const idea = {
      id: this.ideas.length,
      title: data.title,
      price: data.price,
    };


    this.ideas.push(idea);

    return idea;
  }
}

const app = express(feathers());


app.use(express.json());
app.configure(socketio());
app.configure(express.rest());
app.use("/ideas", new SoppingList());


app.on('connection', conn => app.channel('stream').join(conn));

app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3000;

app
  .listen(PORT)
  .on('listening', () =>
    console.log(`Realtime server running on port ${PORT}`)
  );

app.service("ideas").create({
  title: "Buy Angular app",
  price: 3,
});
app.service("ideas").create({
  title: "Buy React app",
  price: 6,
});
app.service("ideas").create({
  title: "Buy Vue app",
  price: 7,
});


