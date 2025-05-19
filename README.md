## About MoonMab

MoonMab is an interactive 3D exploration game of the Tonsley Main Assembly Building (MAB), built with blocks like Minecraft. Control your experience using hand gestures, collect jerry cans to increase your score, and compete on the leaderboard by creating an account. MoonMab is designed to provide an immersive and enjoyable exploration experience while showcasing modern web technologies.

## Features

- **Hand Gesture Controls**: Navigate and interact with the environment using predefined hand gestures detected via your     webcam.
- **3D Exploration**: Immerse yourself in a block-based 3D representation of the MAB, similar to Minecraft.
- **Score Collection**: Collect jerry cans scattered throughout the environment to increase your score.
- **Leaderboard**: Save your score and compete with other players by creating an account.
- **Responsive Design**: Optimized for various screen sizes and devices.
- **Interactive UI**: Engaging user interface built with modern web technologies.

## Hosting with Docker

Follow these steps to set up the application using Docker and host it on a server:

1. **Download and Install Docker**  
   If Docker is not already installed, download it from the [Docker website](https://www.docker.com/products/docker-desktop) and install it on your server.

2. **Create a Dockerfile**  
   Add a `Dockerfile` to the root of your project with the following content:

   FROM php:8.1-fpm

   # Install system dependencies
   RUN apt-get update && apt-get install

   # Install PHP extensions
   RUN docker-php-install

   # Set working directory
   WORKDIR /var/www

   # Install Composer
    /usr/bin/composer 

   # Install dependencies
   RUN composer install 
   RUN npm install && npm run build

   # Host to port 8000
   EXPOSE 8000

   # Start the server
   CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]


## Installation

To get started with MoonMab locally, follow these steps:

1. **Clone the Repository**

   git clone https://github.com/uing-io/moonmab.git
   cd moonmab


## Install Composer Dependencies

composer install
npm install


## Update the .env file with your database credentials

Update the `.env` file with the following database configuration:

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password


## Run Migrations

1. Run the database migrations:
   ```bash
   ./vendor/bin/sail artisan migrate
2. 
npm run dev
./vendor/bin/sail artisan serve

## Packages and Dependencies

### Dev Dependencies

- `@tailwindcss/forms` ^0.5.2
- `alpinejs` ^3.4.2
- `autoprefixer` ^10.4.2
- `axios` ^1.7.4
- `concurrently` ^9.0.1
- `laravel-vite-plugin` ^1.0
- `postcss` ^8.4.31
- `tailwindcss` ^3.1.0
- `vite` ^5.0

### Dependencies

- `@popperjs/core` ^2.11.8
- `@tensorflow-models/hand-pose-detection` ^2.0.1
- `@tensorflow/tfjs` ^4.20.0
- `bootstrap` ^5.3.3
- `jquery` ^3.7.1
- `jszip` ^3.10.1
- `lil-gui` ^0.19.2
- `qrcode` ^1.5.4
- `three` ^0.170.0


## Usage

1. **Access the Application**  
   Open your web browser and navigate to `http://localhost:8000/side/edwin/mab-project`.

2. **Allow Webcam Access**  
   When prompted, grant the application permission to access your webcam for hand gesture recognition.

3. **Play the Game**  
   - Use the predefined hand gestures to explore the MAB environment.  
   - Collect jerry cans scattered throughout the space to increase your score.

4. **Save Your Score**  
   - After collecting items, save your score to the leaderboard.  
   - If you are not logged in, you will be prompted to register or log in.

## Acknowledgments

- **Laravel Framework**: Laravel
- **Three.js**: For 3D rendering.
- **TensorFlow.js**: For hand gesture recognition.
- **Bootstrap**: For responsive UI components.
- **Community Contributors**: Thank you to everyone who has contributed to this project.
