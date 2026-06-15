import asyncio
import websockets
import json

clientes = set()
historico_noticias = [] 

async def handler(websocket):
    clientes.add(websocket)
    print(f"Conexão aberta: {websocket.remote_address}")
    for noticia in historico_noticias:
        await websocket.send(json.dumps(noticia))  
    try:
        async for message in websocket:
            print(f"Mensagem recebida: {message}")
            data = json.loads(message)
            if "titulo" in data:
                historico_noticias.append(data)
            
            if clientes:
                await asyncio.gather(*[client.send(message) for client in clientes])
    finally:
        clientes.remove(websocket)
        print("Conexão encerrada")

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8080):
        await asyncio.Future()

asyncio.run(main())

