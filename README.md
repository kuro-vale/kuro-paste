# kuro-paste

[![PWD](https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/kuro-vale/kuro-paste/main/docker-compose.yml)

API project made with NestJS.

The thematic of this API is PasteBin.

### Features

- This API uses JWT as an authentication method
- Uses a mongodb for storing pastes
- You can upload files as pastes

See the API [docs](https://documenter.getpostman.com/view/20195671/2s8YsnWb7z)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/20195671-f581f38a-d880-4fb3-be37-35064b223177?action=collection%2Ffork&collection-url=entityId%3D20195671-f581f38a-d880-4fb3-be37-35064b223177%26entityType%3Dcollection%26workspaceId%3D340d12f8-bfd8-4f84-8bc7-f3b080c24682)

### Docker image

You can run this project by building the Dockerfile or docker-compose or using this [prebuilt image](https://hub.docker.com/r/kurovale/kuro-paste)

### Quick Setup

1. create a .env file, use .env.example as reference (Use a mongodb database)
2. run ```npm install```
3. run ```nest start```
