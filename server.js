const express = require("express");
const cors = require("cors");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Serve rendered videos
app.use("/out", express.static(path.join(__dirname, "out")));

// Health check (HF Spaces needs this on /)
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "jigi-remotion-renderer" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "jigi-remotion-renderer" });
});

// Render a composition
app.post("/render", (req, res) => {
  const {
    compositionId = "AminataTestimonial",
    props = {},
    outputFileName,
  } = req.body;

  const timestamp = Date.now();
  const fileName = outputFileName || `render-${compositionId}-${timestamp}.mp4`;
  const outputPath = path.join(__dirname, "out", fileName);

  try {
    // Write props to temp file
    const propsPath = path.join(__dirname, `temp-props-${timestamp}.json`);
    fs.writeFileSync(propsPath, JSON.stringify(props));

    // Build remotion render command
    const cmd = [
      "npx remotion render",
      compositionId,
      `"${outputPath}"`,
      `--props="${propsPath}"`,
    ].join(" ");

    console.log(`[RENDER] Starting: ${compositionId} -> ${fileName}`);
    execSync(cmd, { cwd: __dirname, timeout: 300000, stdio: "pipe" });

    // Cleanup temp props
    if (fs.existsSync(propsPath)) fs.unlinkSync(propsPath);

    const stats = fs.statSync(outputPath);

    // Use the HF Space URL or localhost
    const baseUrl = process.env.SPACE_HOST
      ? `https://${process.env.SPACE_HOST}`
      : `http://localhost:${PORT}`;
    const publicUrl = `${baseUrl}/out/${fileName}`;

    console.log(`[RENDER] Done: ${fileName} (${(stats.size / 1024 / 1024).toFixed(1)} MB)`);

    res.json({
      status: "succeeded",
      url: publicUrl,
      fileName,
      size: stats.size,
    });
  } catch (error) {
    console.error(`[RENDER] Failed:`, error.message);
    res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 7860;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`JIGI Remotion Renderer running on port ${PORT}`);
  console.log(`  POST /render  — render a composition`);
  console.log(`  GET  /health  — health check`);
});
