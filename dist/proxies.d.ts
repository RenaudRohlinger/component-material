/// <reference types="react" />
import { ProxyProps, ProxyComponent } from './types/internal';
import { fragmentChunks, vertexChunks, commonChunks } from './generated';
declare type ShaderProxyHelper<T extends string> = {
    [key in T]: any;
} & {
    Body: ProxyComponent;
    Head: ProxyComponent;
};
export declare const vert: ShaderProxyHelper<vertexChunks | commonChunks>;
export declare const frag: ShaderProxyHelper<fragmentChunks | commonChunks>;
export declare function common<Child extends string[] | string>({ children }: ProxyProps<Child>): JSX.Element;
export {};
