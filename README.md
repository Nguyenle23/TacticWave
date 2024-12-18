# TactiWave Frontend Setup

This guide provides instructions to set up and run the frontend of the **TacticWave** project, which uses **Vite** and **React JS**.

## Prerequisites

Ensure you have the following tools installed on your machine:

- **Node.js** (version 14.18+ or 16+ is recommended): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** (optional):
  ```bash
  npm -v  # Check npm version
  yarn -v # Check yarn version (if using yarn)
  ```

## Clone the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/Nguyenle23/TacticWave.git
```

Navigate to the project directory:

```bash
cd TacticWave
```

## Install Dependencies

Install the necessary dependencies using `npm` or `yarn`:

### Using npm:
```bash
npm install
```

### Using yarn:
```bash
yarn install
```

## Run the Development Server

Start the development server to view the project locally:

### Using npm:
```bash
npm run dev
```

### Using yarn:
```bash
yarn dev
```

After starting, you should see output similar to this:

```
  VITE v<version>  ready in <time>
  🌐 Local: http://localhost:5173/
  📡 Network: http://<your-ip>:5173/
```

Open your browser and navigate to [http://localhost:5173/](http://localhost:5173/) to view the application.

## Environment Variables

The project may require specific environment variables to run. If an `.env` file is included in the repository, ensure it is configured correctly.

If the `.env` file is missing, you may need to create one in the root directory based on the provided `.env.example` file:

```bash
cp .env.example .env
```

Edit the `.env` file to match your environment setup.

## Build for Production

To build the project for production, run:

### Using npm:
```bash
npm run build
```

### Using yarn:
```bash
yarn build
```

The production-ready files will be generated in the `dist/` directory. You can deploy this folder to any static hosting service, such as Netlify, Vercel, or AWS S3.

## Troubleshooting

### Common Issues:
1. **Missing dependencies**: Ensure you have run `npm install` or `yarn install`.
2. **Environment issues**: Ensure all required environment variables are set in the `.env` file.
3. **Port conflict**: If port `5173` is already in use, update the `vite.config.js` or use the following command to specify a different port:
   ```bash
   npm run dev -- --port=3000
   ```

### Need help?
Feel free to raise an issue in the GitHub repository or reach out to the project maintainers.

## License
This project is licensed under the terms specified in the repository. Please check the `LICENSE` file for more information.
