# TacticWave Frontend Setup

This guide provides instructions to set up and run the frontend of the **TacticWave** project, which uses **Vite** and **React JS**. Additionally, this project requires Python with Flask for the backend.

## Prerequisites

Ensure you have the following tools installed on your machine:

- **Node.js** (version 14.18+ or 16+ is recommended): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** (optional):
  ```bash
  npm -v  # Check npm version
  yarn -v # Check yarn version (if using yarn)
  ```
- **Python** (version 3.8+): [Download Python](https://www.python.org/)
  ```bash
  python --version  # Check Python version
  pip --version     # Check pip version
  ```
- **Arduino IDE** (for ESP32 setup): [Download Arduino IDE](https://www.arduino.cc/en/software)

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

### For Frontend
Since the project already has `vite.config.js` and `package.json` configured, you only need to install the dependencies:

#### Using npm:
```bash
npm install
```

#### Using yarn:
```bash
yarn install
```

### For Backend (Python + Flask)

Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

### For Arduino IDE (ESP32 Setup)
_Copy **Hardware > [NEW] VIBRATION CONTROL.ino** and paste to Arduino IDE_
1. Install the Arduino IDE from [Arduino Software](https://www.arduino.cc/en/software).

2. Set up ESP32 in Arduino IDE:
   - Open the Arduino IDE.
   - Go to **File > Preferences**.
   - In the "Additional Board Manager URLs" field, add the following URL:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Click **OK**.

3. Install the ESP32 Board Package:
   - Go to **Tools > Board > Boards Manager**.
   - Search for `ESP32`.
   - Click **Install** on the "ESP32 by Espressif Systems" package.

4. Select the ESP32 Board:
   - Go to **Tools > Board > ESP32 Arduino**.
   - Select your specific ESP32 board (e.g., `ESP32 Dev Module`).

5. Connect your ESP32 device to your computer using a USB cable.

6. Select the Port:
   - Go to **Tools > Port** and select the port corresponding to your ESP32 device. If your PORT is not COM4, go to **Server > controllers > RunExpController.py** and edit the value of **esp32_port** to match your PORT.
   - Choose **Upload Speed**: 115200
   

## Run the Development Server

### For Frontend
Start the development server to view the project locally:

#### Using npm:
```bash
npm run dev
```

#### Using yarn:
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

### For Backend
Run the Flask server:

```bash
python app.py
```

The backend should be running at `http://localhost:5000` by default. Adjust the host or port in `app.py` if needed.

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
1. **Missing dependencies**: Ensure you have run `npm install`, `yarn install`, or `pip install` as required.
2. **Environment issues**: Ensure all required environment variables are set in the `.env` file.
3. **Port conflict**: If ports `5173` (frontend) or `5000` (backend) are already in use, update the respective configurations or use the following commands to specify a different port:
   - Frontend: 
     ```bash
     npm run dev -- --port=3000
     ```
   - Backend (in `app.py`):
     ```python
     app.run(port=4000)
     ```

### Need help?
Feel free to raise an issue in the GitHub repository or reach out to the project maintainers.

## License
This project is licensed under the terms specified in the repository. Please check the `LICENSE` file for more information.
