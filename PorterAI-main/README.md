# Voice AI MERN Application

This project is a voice-first web application built using the MERN stack (MongoDB, Express, React, Node.js). It leverages AI speech recognition, natural language understanding via the OpenAI API, and text-to-speech functionality using the Speech Synthesis API.

## Features

- Voice command input using the Web Speech API.
- Integration with OpenAI for natural language processing.
- Text-to-speech responses using the Speech Synthesis API.
- Responsive and user-friendly interface.

## Project Structure

```
voice-ai-mern-app
├── client                # Client-side application
│   ├── src
│   │   ├── components    # React components
│   │   │   └── VoiceInterface.tsx
│   │   ├── App.tsx       # Main application component
│   │   ├── index.tsx     # Entry point for React application
│   │   └── types         # TypeScript types and interfaces
│   │       └── index.ts
│   ├── package.json      # Client-side dependencies and scripts
│   └── README.md         # Client-side documentation
├── server                # Server-side application
│   ├── src
│   │   ├── controllers    # Controllers for handling requests
│   │   │   └── aiController.ts
│   │   ├── routes         # API routes
│   │   │   └── aiRoutes.ts
│   │   ├── app.ts         # Entry point for Express application
│   │   └── types          # TypeScript types and interfaces
│   │       └── index.ts
│   ├── package.json       # Server-side dependencies and scripts
│   ├── tsconfig.json      # TypeScript configuration
│   └── README.md          # Server-side documentation
└── README.md              # Overall project documentation
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd voice-ai-mern-app
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd client
   npm install
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm start
   ```

2. Start the client:
   ```
   cd client
   npm start
   ```

### Usage

- Open your browser and navigate to `http://localhost:3000` to access the application.
- Use voice commands to interact with the AI.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.