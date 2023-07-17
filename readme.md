# A websockets based chatroom project

Users will provide a username and be allowed to enter a chatroom where they can share messages with other users in realtime

Hosted [here](https://chatr.zing-rsa.co.za/).

### Usage notes

If you would like to simulate multiple users chatting you can open 2 sessions, but it's best if they are on different browsers. The app uses cookies to keep track of sessions, and most browsers save cookies globally across tabs(even incognito) so your sessions will conflict. The easiest is to use 2 different browsers. 

### Tech

`Frontend/Backend`: [Deno Fresh](https://github.com/denoland/fresh) 🍋  
`DB`: MongoDB  
`WS`: Deno Websockets  

> `serve-ws/` contains initial Websocket server before I migration to the fresh backend

### Running

1. create a `.env` file in `fresh-ws/`: 
```
FRESH_ENVIRONMENT="dev"
MONGO_URL="<your mongo url>"
APP_URL="localhost:8000"
WS_PTCL="ws://"
HTTP_PTCL="http://"
```

2. `cd fresh-ws`
3. `deno task start` (make sure to [install deno](https://deno.land/manual@v1.35.1/getting_started/installation))