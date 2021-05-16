import { ComponentMaterial } from './component-material';
import { frag, vert, common } from './proxies';
export * from './types/index';
export declare type MT = typeof ComponentMaterial & {
    Vert: typeof vert;
    Frag: typeof frag;
    Common: typeof common;
};
declare const _default: MT;
export default _default;
