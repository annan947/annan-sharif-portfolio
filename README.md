# Annan Sharif — Interactive 3D Portfolio

My personal portfolio, built as an interactive 3D island. Visitors can walk or drive between exhibits to explore my projects, learn about my experience, and get in touch.

🌐 **Live website:** [annan947.github.io](https://annan947.github.io/)

## Screenshots

### Project Island
<img width="1904" height="933" alt="image" src="https://github.com/user-attachments/assets/e5c64a5f-4654-49ae-8787-267a113c8f2e" />


### Classic View
<img width="1890" height="933" alt="image" src="https://github.com/user-attachments/assets/5f648db0-60c6-4fff-b83c-d892137a7f28" />


## Features

- Playable character with walking and sprinting controls
- Drivable car for exploring the island
- Four project exhibits with descriptions and GitHub links
- Clickable map for jumping to project locations
- Keyboard and touch controls
- About section covering my experience and interests
- Contact links that open a Gmail draft addressed to me
- Classic portfolio view with projects, experience, and technical skills

## Featured Projects

### Maze & Pathfinding Visualizer
A Python and Pygame application that generates random mazes and animates BFS, DFS, Dijkstra, and A*. It compares path length, explored cells, and execution time.

[View repository](https://github.com/annan947/maze-solver-visualizer)

### Monte Carlo Stock Simulator
An educational Python application that retrieves historical stock data from Alpha Vantage and simulates 5,000 possible price paths using Geometric Brownian Motion.

[View repository](https://github.com/annan947/monte_carlo_stock_simulator)

### Zombie Infection Simulation
A Pygame simulation with moving agents and proximity-based infection. Users can adjust infection settings, pause or restart the simulation, and monitor population statistics.

[View repository](https://github.com/annan947/zombie-survival-simulation)

### Python Weather App
A desktop application built with PyQt5 and the OpenWeather API. It supports city searches, temperature unit switching, recent search history, and background requests.

[View repository](https://github.com/annan947/weather_app)

The island exhibits are visual representations of these projects. The original applications are available in their linked repositories.

## Technologies

- **Three.js** — 3D rendering and scene construction
- **JavaScript** — movement, interactions, animation, and project dialogs
- **HTML and CSS** — page structure, styling, and responsive layouts
- **GitHub Pages** — website hosting

## Controls

| Control | Action |
| --- | --- |
| WASD or arrow keys | Move around the island |
| Shift | Sprint while walking |
| V | Switch between walking and driving |
| E | Open a nearby project |
| Click or tap the ground | Move toward that location |
| Click a project label | Open project details |
| Click a map station | Jump to that project’s entrance |
| Escape | Close a dialog |
| Reset button | Return to the center |

Mobile visitors can use the on-screen arrow buttons. The Projects menu provides direct access to each project without navigating the island.

## Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/annan947/annan947.github.io.git
   ```

2. Open the project folder:

   ```bash
   cd annan947.github.io
   ```

3. Start a local server:

   ```bash
   python -m http.server 8000
   ```

   On Windows, you can also use:

   ```bash
   py -m http.server 8000
   ```

4. Open [http://localhost:8000](http://localhost:8000) in your browser.

The 3D portfolio uses JavaScript modules, so run it through a local server rather than opening `index.html` directly. No npm installation or build step is required.

## Main Files

| File | Purpose |
| --- | --- |
| `index.html` | Main 3D portfolio page |
| `world.js` | Island, character, car, camera, and interactions |
| `world.css` | Styling and responsive interface |
| `movement.js` | Movement boundaries and collision checks |
| `projects.js` | Project descriptions, links, and exhibit locations |
| `classic.html` | Classic portfolio page |
| `styles.css` | Classic portfolio styling |
| `script.js` | Classic portfolio interactions |
| `vendor/three.module.js` | Bundled Three.js library |

## About Me

I’m Annan Sharif, a Computer Science student at The City College of New York, expecting to graduate in May 2028.

My experience includes AI evaluation at Handshake AI, Python scripting and hardware/software integration at Sydra through CUNY Career Launch, and Python and SQL data workflows at Tanim Consulting.

I love problem solving and enjoy building projects that help me understand how things work. Outside of programming, my interests include TV shows, video games, movies, and music.

## Credits

This portfolio was built with AI assistance from ChatGPT/Codex, with my direction on the content, features, and design.

Three.js is distributed under the MIT license. Its license is included in `vendor/THREE-LICENSE.txt`.

## Contact

- **Email:** sharifannan497@gmail.com
- **GitHub:** [annan947](https://github.com/annan947)
- **Portfolio:** [annan947.github.io](https://annan947.github.io/)
