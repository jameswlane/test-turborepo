import { promises as fs } from "node:fs";
import path from "node:path";

const CONFIG = "release-please-config.json";
const MANIFEST = ".release-please-manifest.json";

function repoRoot() { return process.cwd(); }
async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }

async function listDirs(globDir) {
    const dir = path.join(repoRoot(), globDir);
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    return entries.filter(e => e.isDirectory()).map(e => path.join(globDir, e.name));
}

async function main() {
    const pkgs = await listDirs("packages");
    const cfg = {
        "include-v-in-tag": true,
        "include-component-in-tag": true,
        "tag-separator": "@",
        "packages": {
            // root app: plain vX.Y.Z
            "apps/cli": { "release-type": "go", "include-component-in-tag": false }
        }
    };

    for (const d of pkgs) {
        const base = path.basename(d);
        let component;
        if (d === "packages/test-sdk") component = "packages/test-sdk";
        else component = `@plugin/${base}`;
        cfg.packages[d] = { "release-type": "go", component };
    }

    await fs.writeFile(CONFIG, JSON.stringify(cfg, null, 2));

    if (!(await exists(MANIFEST))) {
        const manifest = { "apps/cli": "0.1.0" };
        for (const d of pkgs) manifest[d] = "0.1.0";
        await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
    }
    console.log(`Wrote ${CONFIG} and ensured ${MANIFEST}`);
}
main().catch(e => { console.error(e); process.exit(1); });
