import { MeshPhysicalMaterial, Shader } from 'three'

import { getKeyValue, setKeyValue } from './helpers/objects'
import { MaterialConstructor } from './types/index'
import { Uniforms } from './types/internal'

function createMaterial(
  baseMaterial: MaterialConstructor = MeshPhysicalMaterial,
  uniforms: Uniforms = {},
  onBeforeCompile?: (shader: Shader) => void
) {
  return class ComponentMaterial extends baseMaterial {
    constructor(parameters = {}) {
      super(parameters)
      const entries = Object.keys(uniforms)
      this.setValues(parameters)

      entries.forEach(key => {
        setKeyValue(this, `_${key}`, { value: uniforms[key] })
        Object.defineProperty(this, key, {
          get: () => this[`_${key}`].value,
          set: v => (this[`_${key}`].value = v),
        })
      })
    }

    onBeforeCompile(shader: Shader) {
      const handler = {
        get: function (target: Shader, key: keyof Shader) {
          return getKeyValue(target, key)
        },
        set: function (target: Shader, key: keyof Shader, value: any) {
          setKeyValue(target, key, value)
          // Accoring to ProxyHandler, the set function should return a boolean.
          return true
        },
      }

      const entries = Object.keys(uniforms)
      entries.forEach(key => {
        shader.uniforms[key] = this[`_${key}`]
      })

      const proxiedShader = new Proxy(shader, handler)

      if (onBeforeCompile) {
        onBeforeCompile(proxiedShader)
      }
    }
  }
}

export default createMaterial
