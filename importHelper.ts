import { readdir } from "fs/promises";
import { dirname } from "path";

export const isTsNode = !!(process as any)[Symbol.for("ts-node.register.instance")];

/**
 * Imports modules in directory of {@link modulePath}.
 * Ignores index.js.
 * 
 * @param modulePath Path to module.
 * @returns Imported modules.
 */
export async function importModules<T>(modulePath: string): Promise<[string, T][]> {
    const dir = dirname(modulePath);
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
