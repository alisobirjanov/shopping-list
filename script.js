const socket = io("http://localhost:3000");
const app = feathers();
app.configure(feathers.socketio(socket));


document.getElementById("form").addEventListener("submit", sendIdea);

async function sendIdea(event) {
  event.preventDefault()
  const title = document.getElementById("title");
  const price = document.getElementById("price");

  app.service("ideas").create({
    title: title.value,
    price: price.value * 1,
  });

  title.value = price.value = "";
}

let price = 0
async function renderList(list) {
  price = price += list.price
  document.getElementById("ideas").innerHTML += `
      <li class="list-item" >(${list.id + 1}) ${list.title}<span>${list.price}$</span></li>
    `;
     document.getElementById("count").innerHTML = price
}

async function init() {
  const ideas = await app.service("ideas").find();
  ideas.forEach(renderList);

  app.service("ideas").on("created", renderList);
}

init();
