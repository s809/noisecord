export function traverseTree<V>(path: string[],
    root: ReadonlyMap<string, V>,
    getDescendants: (value: V) => Map<string, V> | null | undefined,
    allowPartialResolve: boolean = false): V | null {
    let result;

    let list: ReadonlyMap<string, V> | null | undefined = root;
    do {
        const found: V | undefined = list.get(path[0]);
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
 * @param text Text containing mention.
 * @returns Extracted ID.
 */
export function parseMention(text: string, prefix: string): string | null {
    if (/^\d{17,19}$/.test(text))
        return text;

    let regex = new RegExp(`^<${prefix}(\\d{17,19})>$`)
    return text.match(regex)?.[1] ?? null;
}

/**
 * Extracts channel ID from mention.
 * 
 * @param text Text containing mention.
 * @returns Extracted ID.
 */
export function parseChannelMention(text: string) {
    return parseMention(text, "#");
}

/**
 * Extracts user ID from mention.
 * 
 * @param text Text containing mention.
 * @returns Extracted ID.
 */
export function parseUserMention(text: string) {
    return parseMention(text, "@") ?? parseMention(text, "@!");
}

/**
 * Extracts role ID from mention.
 * 
 * @param text Text containing mention.
 * @returns Extracted ID.
 */
export function parseRoleMention(text: string) {
    return parseMention(text, "@&");
}

export type DistributiveOmit<T, K extends keyof any> = T extends any
    ? Omit<T, K>
    : never;

export type DeeplyNestedMap<V> = Map<string, V | DeeplyNestedMap<V>>;
