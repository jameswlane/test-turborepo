import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

const rpArg = process.argv[2] || "[]"; // Release Please paths_released JSON

function safeParse(json, fallback) { try { return JSON.parse(json); } catch { return fallback; } }

function toComponent(p) {
    if (p === "apps/cli") return { component: "", name: "cli" };
    if (p === "packages/test-sdk") return { component: "packages/test-sdk", name: "test-sdk" };
    return { component: `@plugin/${path.basename(p)}`, name: path.basename(p) };
}

function toItem(p) {
    const base = toComponent(p);
    return { path: p, config: `${p}/.goreleaser.pro.yaml`, ...base };
}

function uniq(arr) { return Array.from(new Set(arr)); }

function resolveAffectedPackages() {
    // Turbo prints a graph with tasks[].package. We only need package names.
    try {
        const out = execSync("pnpm turbo run build --affected --dry=json", { stdio: ["ignore", "pipe", "pipe"] }).toString();
        const obj = safeParse(out, {});
        const names = obj?.tasks?.map(t => t.package).filter(Boolean) ?? [];
        return uniq(names);
    } catch {
        return []; // fall back to RP only
    }
}

async function nameToDirMap() {
    // Scan for package.json entries to map "name" -> directory
    const globs = ["apps", "packages"];
    const map = {};
    for (const g of globs) {
        let entries = [];
        try { entries = await fs.readdir(g, { withFileTypes: true }); } catch { continue; }
        for (const e of entries) {
            if (!e.isDirectory()) continue;
            const p = path.join(g, e.name, "package.json");
            try {
                const pkg = JSON.parse(await fs.readFile(p, "utf8"));
                if (pkg?.name) map[pkg.name] = path.join(g, e.name);
            } catch { /* ignore */ }
        }
    }
    return map;
}

async function main() {
    const rpPaths = safeParse(rpArg, []);
    const affectedNames = resolveAffectedPackages();
    const nameDir = await nameToDirMap();
    const affectedPaths = affectedNames.map(n => nameDir[n]).filter(Boolean);

    let paths = rpPaths;
    if (affectedPaths.length) {
        const set = new Set(affectedPaths);
        paths = rpPaths.filter(p => set.has(p));
    }

    const include = paths.map(toItem);
    process.stdout.write(JSON.stringify({ include }));
}

main().catch(e => { console.error(e); process.exit(1); });
