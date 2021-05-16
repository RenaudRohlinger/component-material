export declare const getKeyValue: <T, K extends keyof T>(obj: T, key: K) => T[K];
export declare const setKeyValue: <T, K extends keyof T>(obj: T, key: K, value: any) => T[K];
