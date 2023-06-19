import { UnionToIntersection } from "type-fest";

/** @internal */
export function _traverseTree<T>(path: string[],
    root: ReadonlyMap<string, T>,
    getDescendants: (value: T) => Map<string, T> | null | undefined,
    allowPartialResolve: boolean = false): T | null {
    path = [...path];
    let result: T | undefined;

    let list: ReadonlyMap<string, T> | null | undefined = root;
    do {
        const found: T | undefined = list.get(path[0]);
        if (!found)
            break;

        result = found;

        list = getDescendants(result);
        path.shift();
    } while (list);

    if (path.length && !allowPartialResolve)
        return null;

    return result ?? null;
};

/**
 * Extracts ID from mention.
 * 
 * @param text - Text containing mention.
 * @returns Extracted ID.
 * @public
 */
export function parseMention(text: string, prefix: string): string | null {
    if (/^\d{1,19}$/.test(text))
        return text;

    let regex = new RegExp(`^<${prefix}(\\d{1,19})>$`)
    return text.match(regex)?.[1] ?? null;
}

/**
 * Extracts channel ID from mention.
 * 
 * @param text - Text containing mention.
 * @returns Extracted ID.
 * @public
 */
export function parseChannelMention(text: string) {
    return parseMention(text, "#");
}

/**
 * Extracts user ID from mention.
 * 
 * @param text - Text containing mention.
 * @returns Extracted ID.
 * @public
 */
export function parseUserMention(text: string) {
    return parseMention(text, "@") ?? parseMention(text, "@!");
}

/**
 * Extracts role ID from mention.
 * 
 * @param text - Text containing mention.
 * @returns Extracted ID.
 * @public
 */
export function parseRoleMention(text: string) {
    return parseMention(text, "@&");
}

/** @internal */
export function _getValueOrThrowInitError<T>(value: T | undefined, instance: { init: Function }) {
    if (value === undefined)
        throw new Error(`${instance.init.name}() was not called before use of ${instance.constructor.name} instance.`);
    return value;
}

/**
 * Skips string past specified parts and removes leading whitespace.
 * 
 * @param text - String to skip in.
 * @param parts - Parts to skip.
 * @returns String with skipped parts.
 * 
 * @internal
 */
export function _skipStringParts(text: string, ...parts: string[]) {
    for (let part of parts)
        text = text.slice(text.indexOf(part) + part.length + 1 /* possible quote symbol */).trimStart();

    return text;
}

/** @public */
export type DistributiveOmit<T, K extends keyof any> = T extends any
    ? Omit<T, K>
    : never;

/** @public */
export type DeeplyNestedMap<V> = Map<string, V | DeeplyNestedMap<V>>;

/** @public */
export type UnionToIntersectionRecursive<T> = {
    [K in keyof T]: T[K] extends {} ? UnionToIntersection<T[K]> : UnionToIntersectionRecursive<T[K]>;
}
