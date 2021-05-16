import { Material } from 'three';
import { Uniforms, Varyings, AllMaterialProps } from './internal';
export interface MaterialConstructor {
    new (...args: any[]): GenericMaterial;
}
export declare type ComponentMaterialProps = AllMaterialProps & {
    varyings?: Varyings;
    uniforms?: Uniforms;
    from?: MaterialConstructor;
};
export interface GenericMaterial extends Material {
    [key: string]: any;
}
export declare type ComponentMaterial = (props: ComponentMaterialProps) => GenericMaterial;
