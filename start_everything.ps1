echo "Starting vite web server / builder on port 8080"
cd Game
start npx "vite --port 8080"

echo "Opening web browser"
Start "C:\Program Files\Mozilla Firefox\firefox.exe" "http://localhost:8080/game.html"

echo "Opening vim"
start "C:\Program Files\Vim\vim91\gvim.exe" "game.js"

echo "Opening powershell window so you can run git"
start powershell
