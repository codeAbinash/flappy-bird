# Flappy Bird Game

A modern implementation of the classic Flappy Bird game built with React, TypeScript, and Canvas. Features include smooth animations, sound effects, high score tracking, and responsive design.

## Features

- Classic Flappy Bird gameplay mechanics
- Smooth animations and particle effects
- Sound effects with mute option
- Local storage for high scores
- Responsive design for all devices
- Dynamic day/night themes
- Score tracking system

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

## Development Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/robert-kratz/flappy-bird.git
    cd flappy-bird
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Docker Deployment

### Using Docker Compose (Development)

1. Start the development environment:

    ```bash
    docker-compose up
    ```

2. Access the application at `http://localhost:3000`

### Using Dockerfile (Production)

1. Build the Docker image:

    ```bash
    docker build -t flappy-bird .
    ```

2. Run the container:

    ```bash
    docker run -p 3000:3000 flappy-bird
    ```

3. Access the application at `http://localhost:3000`

## Project Structure

```
├── src/
│   ├── components/        # React components
│   ├── game/
│   │   ├── core/         # Game engine core
│   │   └── entities/     # Game entities
│   ├── config/           # Game configuration
│   └── assets/           # Static assets
├── public/               # Public assets
└── sounds/               # Game sound effects
```

## Key Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- HTML5 Canvas
- Howler.js (audio)

## Controls

- Click/Tap - Make the bird flap
- Space/Tab - Alternative controls
- Sound toggle button - Mute/unmute game sounds

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Original Flappy Bird game by Dong Nguyen
- Sound effects from [www.101soundboards.com](**https://www.101soundboards.com/boards/10178-flappy-bird-sounds**)
- Community contributors and feedback
