# Voice AI MERN App

## Overview
This project is a voice-first web application built using the MERN stack (MongoDB, Express, React, Node.js). It leverages AI speech recognition, natural language understanding via the OpenAI API, and text-to-speech functionality using the Web Speech API.

## Server Setup

### Prerequisites
- Node.js (version 14 or higher)
- TypeScript
- MongoDB (for data storage)

### Installation
1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install the dependencies:
   ```
   npm install
   ```

### Configuration
- Create a `.env` file in the server directory to store your environment variables, including your OpenAI API key.

### Running the Server
To start the server, run:
```
npm start
```
The server will be running on `http://localhost:5000`.

### API Endpoints
- **POST /api/ai/command**: Processes a voice command and returns a response from the AI.

## Client Setup

### Installation
1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install the dependencies:
   ```
   npm install
   ```

### Running the Client
To start the client, run:
```
npm start
```
The client will be running on `http://localhost:3000`.

## Usage
- Open the client application in your browser.
- Use the voice interface to interact with the AI by speaking commands.

## Contributing
Feel free to fork the repository and submit pull requests for any improvements or features.

## License
This project is licensed under the MIT License.