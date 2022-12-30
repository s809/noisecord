import { readdir } from "fs/promises";

export const isTsNode = !!(process as any)[Symbol.for("ts-node.register.instance")];

/**
 * Imports modules in a given directory. \
 * Ignores index.js/ts (depends on whether running in ts-node).
 * 
 * @param dir Path to directory.
 * @returns Imported modules.
 */
export async function importModules<T>(dir: string): Promise<[string, T][]> {
    const modules = [];

    for (const entry of await readdir(dir, { withFileTypes: true })) {
        if (!entry.isDirectory() && (isTsNode
            ? (entry.name === "index.ts" || !entry.name.endsWith(".ts"))
            : (entry.name === "index.js" || !entry.name.endsWith(".js"))))
            continue;
        
        const path = `${dir}/${entry.name}`;
        modules.push(Promise.all([path, import(path).then(m => m.default as T)]));
    }

    return Promise.all(modules);
}
