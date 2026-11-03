const { spawn } = require("child_process")
const path = require("path")
const fs = require("fs")
const http = require("http")

const BACKEND_CANDIDATES = [
  path.resolve(__dirname, "../../NAPA-backend"),
  path.resolve(process.cwd(), "../NAPA-backend"),
  "C:\\Users\\APPUz\\Documents\\me\\NAPA-backend"
]

function findBackendPath() {
  for (const candidate of BACKEND_CANDIDATES) {
    if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, "package.json"))) {
      return candidate
    }
  }
  return null
}

function checkPort6100() {
  return new Promise((resolve) => {
    const req = http.get("http://localhost:6100/health", (res) => {
      resolve(res.statusCode === 200)
    })
    req.on("error", () => resolve(false))
    req.setTimeout(1000, () => {
      req.destroy()
      resolve(false)
    })
  })
}

async function main() {
  console.log("====================================================")
  console.log("🌟 NAPA SMP — Web & YouPI-PG Backend Runner")
  console.log("====================================================")

  const isBackendActive = await checkPort6100()
  let backendProc = null

  if (isBackendActive) {
    console.log("✅ YouPI-PG Backend is already active on http://localhost:6100")
  } else {
    const backendPath = findBackendPath()
    if (!backendPath) {
      console.warn("⚠️ Could not find NAPA-backend directory. Running Web frontend only.")
    } else {
      console.log(`🚀 Launching YouPI-PG Backend from: ${backendPath}`)
      const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm"
      backendProc = spawn(npmCmd, ["run", "dev"], {
        cwd: backendPath,
        stdio: "inherit",
        shell: true
      })

      backendProc.on("error", (err) => {
        console.error("Failed to start backend process:", err.message)
      })
    }
  }

  // Start Next.js development server
  console.log("🚀 Launching Next.js Web Frontend (http://localhost:3000)...")
  const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx"
  const webProc = spawn(npxCmd, ["next", "dev"], {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true
  })

  const shutdown = () => {
    console.log("\n🛑 Stopping all servers...")
    if (backendProc) {
      try {
        if (process.platform === "win32") {
          spawn("taskkill", ["/pid", backendProc.pid, "/f", "/t"])
        } else {
          backendProc.kill("SIGTERM")
        }
      } catch {}
    }
    if (webProc) {
      try {
        if (process.platform === "win32") {
          spawn("taskkill", ["/pid", webProc.pid, "/f", "/t"])
        } else {
          webProc.kill("SIGTERM")
        }
      } catch {}
    }
    process.exit(0)
  }

  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
  process.on("exit", shutdown)
}

main().catch(console.error)
