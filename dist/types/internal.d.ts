/// <reference types="react" />
import { MaterialProps, ShadowMaterialProps, SpriteMaterialProps, RawShaderMaterialProps, ShaderMaterialProps, PointsMaterialProps, MeshPhysicalMaterialProps, MeshStandardMaterialProps, MeshPhongMaterialProps, MeshToonMaterialProps, MeshNormalMaterialProps, MeshLambertMaterialProps, MeshDepthMaterialProps, MeshDistanceMaterialProps, MeshBasicMaterialProps, MeshMatcapMaterialProps, LineDashedMaterialProps, LineBasicMaterialProps } from '@react-three/fiber';
export declare type ProxyProps<Child extends string | string[]> = {
    children: Child;
};
export declare type ProxyComponent = <Child extends string[] | string>(props: ProxyProps<Child>) => JSX.Element;
export declare type ExtensionsType = {
    value?: string;
    replaceChunk: boolean;
};
export declare type GLProp = {
    value?: number | string | boolean | THREE.Texture | THREE.Vector2 | THREE.Vector3 | THREE.Vector4 | Array<number> | Float32Array | THREE.Color | THREE.Quaternion | THREE.Matrix3 | THREE.Matrix4 | Int32Array | THREE.CubeTexture;
    type: string;
};
export declare type Uniforms = {
    [key: string]: GLProp;
};
export declare type Varyings = {
    [key: string]: Omit<GLProp, 'value'>;
};
export declare type ChildProps = {
    chunkName: string;
    shaderType: string;
};
export declare type ExtensionShaderObject = {
    [key: string]: ExtensionsType;
};
export declare type ExtensionShadersObject = {
    vert: ExtensionShaderObject & {
        head: string;
    };
    frag: ExtensionShaderObject & {
        head: string;
    };
    common: string;
};
export declare type AllMaterialProps = MaterialProps & ShadowMaterialProps & SpriteMaterialProps & RawShaderMaterialProps & ShaderMaterialProps & PointsMaterialProps & MeshPhysicalMaterialProps & MeshStandardMaterialProps & MeshPhongMaterialProps & MeshToonMaterialProps & MeshNormalMaterialProps & MeshLambertMaterialProps & MeshDepthMaterialProps & MeshDistanceMaterialProps & MeshBasicMaterialProps & MeshMatcapMaterialProps & LineDashedMaterialProps & LineBasicMaterialProps;
