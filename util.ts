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

export type Overwrite<T, U> = Omit<T, keyof U> & U;

export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type DistributiveOmit<T, K extends keyof any> = T extends any
    ? Omit<T, K>
    : never;

export type DeeplyNestedMap<V> = Map<string, V | DeeplyNestedMap<V>>;
