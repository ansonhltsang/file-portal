<br/>

<div align="center">
  <a href="https://github.com/ansonhltsang/file-portal">
    <img src="client/src/favicon.svg" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">File Portal</h3>
  <p align="center">
    An end-to-end encrypted file transfer service with a responsive frontend.
        <br />
    <strong>Live Demo</strong> » <a href="https://file-portal.pages.dev/">file-portal.pages.dev</a>
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#installation">Installation</a>
      <ul>
        <li><a href="#frontend">Frontend</a></li>
        <li><a href="#backend">Backend</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project
![file-portal-demo-gif][demo-gif]

Unlike popular cloud storage services such as Google Drive and Dropbox, where files are encrypted but the service provider 
retains the ability to decrypt them, this project aims to create a file transfer service which prioritises security and 
privacy through the implementation of end-to-end encryption.

End-to-end encryption means files are encrypted on the user's device before it leaves their control and remain encrypted 
throughout the entire transfer and storage process. This means that even the server will not be able to read the 
original contents of the file, ensuring only the intended recipients can decrypt and access it.

### Built With
- [![PocketBase][pocketbase.io]][pocketbase-url]
- [![React][react.dev]][react-url]
- [![Mantine][mantine.dev]][mantine-url]
- [![React Router][reactrouter.com]][reactrouter-url]

## Installation
To get a local copy running, follow these simple steps.

1. Clone the repository
```sh
git clone https://github.com/ansonhltsang/file-portal.git
```
2. Create a `.env` file following `.env.example`, use the following if the backend is hosted on port 8090, with a file 
upload size limit of 25 MB and a session duration of 30 minutes.
```
VITE_PB_URL=http://localhost:8090
VITE_UPLOAD_BYTE_SIZE_LIMIT=26214400
VITE_DEFAULT_SESSION_DURATION_IN_MINUTES=30
```

#### Frontend
1. Install [Node 18+][node-url]
2. Enable Corepack
```sh
corepack enable
```
3. Go into the `file-portal/client` directory
```sh
cd client
```
4. Install dependencies
```sh
yarn install
```
5. Run the following to start up the frontend locally. The default port used is 5173, follow the link in the terminal to access the frontend.
```sh
yarn dev
```
6. Other commands such as linting `yarn test` and building for production `yarn build`  can be found in `package.json`

#### Backend
There are two ways to run the backend, either with Docker or by installing Go and building the application.

##### *Docker*
1. Install [Docker][docker-url]
2. Go into the `file-portal` directory
3. Build the docker image
```sh
docker build --tag file-portal-pb .
```
4. Create and run a new container from the image
```sh 
docker run -d -p 8090:8090 file-portal-pb
```

##### *Go*
1. Install [Go 1.18+][go-url]
2. Go into the `file-portal` directory
3. Run and serve the backend
```sh 
go run main.go serve --dir="./pb_data" --http=127.0.0.1:8090
```
If you followed the above instructions to set up the backend, access the admin dashboard by visiting [http://localhost:8090/_](http://localhost:8090/_) and set up an account.

There will now be a `pb_data` folder in the project directory, this will be the directory where data and user uploaded files are stored. To reset the database, simply end the application and delete this folder.

As an option, the backend can be built into a portable standalone binary executable.

*If the `CGO_ENABLED` environment variable was changed previously, it should be set to 0. If it is unset, it defaults to 0*

```sh 
go build
```
Run the following command to serve the binary executable.
```sh
./file-portal serve --dir="./pb_data" --http=127.0.0.1:8090
```

## Roadmap
- [X] Extract application configurations to `.env` file
- [ ] Add rate limiting to backend
- [ ] Add peer-to-peer transfer for large files
- [ ] Add ability to set session expiration time
- [ ] Add ability to set individual file expiration time

## Acknowledgments

Listed below are projects/packages used in this project.

- [Tabler Icons For React](https://tabler-icons.io/)
- [base58check](https://www.npmjs.com/package/base58check)
- [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- [react-countdown](https://www.npmjs.com/package/react-countdown)
- [godotenv](https://github.com/joho/godotenv)

## Contact
Anson Tsang - ansonhltsang@gmail.com - [LinkedIn](https://www.linkedin.com/in/hlansontsang)

<!-- MARKDOWN LINKS & IMAGES -->
[demo-gif]: https://github.com/ansonhltsang/file-portal/assets/111023420/f8deb5cc-3534-4631-85c8-2c97892512d3
[react.dev]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://react.dev/
[mantine.dev]:https://img.shields.io/badge/Mantine-5B5B5B?style=for-the-badge&logo=mantine
[mantine-url]: https://mantine.dev/
[pocketbase.io]: https://img.shields.io/badge/PocketBase-B8DBE4?style=for-the-badge&logo=PocketBase&logoColor=black
[pocketbase-url]: https://pocketbase.io/
[reactrouter.com]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[reactrouter-url]: https://reactrouter.com/
[node-url]: https://nodejs.org/en
[docker-url]: https://docs.docker.com/get-docker/
[go-url]: https://go.dev/doc/install
