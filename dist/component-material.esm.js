import React, { useRef, useMemo } from 'react';
import { MeshPhysicalMaterial } from 'three';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var VERT = 'vert';
var FRAG = 'frag';
var DEFAULT_VERT_CHUNK = 'project_vertex';
var DEFAULT_FRAG_CHUNK = 'dithering_fragment';

var getKeyValue = function getKeyValue(obj, key) {
  return obj[key];
};
var setKeyValue = function setKeyValue(obj, key, value) {
  return obj[key] = value;
};

function createMaterial(baseMaterial, uniforms, _onBeforeCompile) {
  if (baseMaterial === void 0) {
    baseMaterial = MeshPhysicalMaterial;
  }

  if (uniforms === void 0) {
    uniforms = {};
  }

  return /*#__PURE__*/function (_baseMaterial) {
    _inheritsLoose(ComponentMaterial, _baseMaterial);

    function ComponentMaterial(parameters) {
      var _this;

      if (parameters === void 0) {
        parameters = {};
      }

      _this = _baseMaterial.call(this, parameters) || this;
      var entries = Object.keys(uniforms);

      _this.setValues(parameters);

      entries.forEach(function (key) {
        setKeyValue(_assertThisInitialized(_this), "_" + key, {
          value: uniforms[key]
        });
        Object.defineProperty(_assertThisInitialized(_this), key, {
          get: function get() {
            return _this["_" + key].value;
          },
          set: function set(v) {
            return _this["_" + key].value = v;
          }
        });
      });
      return _this;
    }

    var _proto = ComponentMaterial.prototype;

    _proto.onBeforeCompile = function onBeforeCompile(shader) {
      var _this2 = this;

      var handler = {
        get: function get(target, key) {
          return getKeyValue(target, key);
        },
        set: function set(target, key, value) {
          setKeyValue(target, key, value); // Accoring to ProxyHandler, the set function should return a boolean.

          return true;
        }
      };
      var entries = Object.keys(uniforms);
      entries.forEach(function (key) {
        shader.uniforms[key] = _this2["_" + key];
      });
      var proxiedShader = new Proxy(shader, handler);

      if (_onBeforeCompile) {
        _onBeforeCompile(proxiedShader);
      }
    };

    return ComponentMaterial;
  }(baseMaterial);
}

function editShader(shader, extensions) {
  Object.entries(extensions).forEach(function (_ref) {
    var key = _ref[0],
        _ref$ = _ref[1],
        value = _ref$.value,
        replaceChunk = _ref$.replaceChunk;

    if (value && shader.includes(key)) {
      shader = shader.replace("#include <" + key + ">", "\n          " + (replaceChunk ? '' : "#include <" + key + ">") + "\n          " + value + "\n        ");
    }
  });
  return shader;
}

function editShaderHead(shader, head) {
  if (head && typeof head === 'string') {
    shader = "\n      " + head + "\n      " + shader + "\n    ";
  }

  return shader;
}

function addUniforms(shader, uniforms) {
  return Object.entries(uniforms).map(function (_ref2) {
    var key = _ref2[0],
        type = _ref2[1].type;
    return "uniform " + type + " " + key + ";";
  }).join(' ') + "\n    " + shader + "\n  ";
}

function addVarying(shader, varying) {
  return Object.entries(varying).map(function (_ref3) {
    var key = _ref3[0],
        type = _ref3[1].type;
    return "varying " + type + " " + key + ";";
  }).join(' ') + "\n    " + shader + "\n  ";
}

var ComponentMaterial = /*#__PURE__*/React.forwardRef(function ComponentMaterial(_ref4, ref) {
  var children = _ref4.children,
      _ref4$varyings = _ref4.varyings,
      varyings = _ref4$varyings === void 0 ? {} : _ref4$varyings,
      _ref4$uniforms = _ref4.uniforms,
      uniforms = _ref4$uniforms === void 0 ? {} : _ref4$uniforms,
      from = _ref4.from,
      props = _objectWithoutPropertiesLoose(_ref4, ["children", "varyings", "uniforms", "from"]);

  var uniformsRef = useRef(uniforms);
  var varyingsRef = useRef(varyings);

  var _uniforms = useMemo(function () {
    return Object.entries(uniforms).reduce(function (acc, _ref5) {
      var key = _ref5[0],
          value = _ref5[1].value;
      acc[key] = value;
      return acc;
    }, {});
  }, [uniforms]);

  var shaders = useMemo(function () {
    return React.Children.toArray(children).reduce(function (acc, child) {
      var _child$props;

      var shader = child == null ? void 0 : (_child$props = child.props) == null ? void 0 : _child$props.children;

      if (typeof shader === 'string') {
        var _child$props2;

        var replaceChunk = (child == null ? void 0 : (_child$props2 = child.props) == null ? void 0 : _child$props2.replaceChunk) || false;
        var _child$type = child.type,
            chunkName = _child$type.chunkName,
            shaderType = _child$type.shaderType;

        if ([VERT, FRAG].includes(shaderType)) {
          if (chunkName === 'Head') {
            acc[shaderType].head = acc[shaderType].head.concat("\n                  " + shader + "\n                ");
          } else {
            if (!acc[shaderType][chunkName]) {
              acc[shaderType][chunkName] = {
                value: '',
                replaceChunk: false
              };
            }

            acc[shaderType][chunkName].replaceChunk = replaceChunk;
            acc[shaderType][chunkName].value = acc[shaderType][chunkName].value.concat("\n                    " + shader + "\n                  ");
          }
        } else {
          acc.common = acc.common.concat("\n                " + shader + "\n              ");
        }
      }

      return acc;
    }, {
      vert: {
        head: ''
      },
      frag: {
        head: ''
      },
      common: ''
    });
  }, [children]);
  var material = useMemo(function () {
    var vert = shaders.vert,
        frag = shaders.frag,
        common = shaders.common;

    var vertHead = vert.head,
        vertBody = _objectWithoutPropertiesLoose(vert, ["head"]);

    var fragHead = frag.head,
        fragBody = _objectWithoutPropertiesLoose(frag, ["head"]);

    var _material = createMaterial(from, uniformsRef.current, function (shader) {
      shader.fragmentShader = editShaderHead(shader.fragmentShader, fragHead);
      shader.vertexShader = editShaderHead(shader.vertexShader, vertHead);
      shader.fragmentShader = editShaderHead(shader.fragmentShader, common);
      shader.vertexShader = editShaderHead(shader.vertexShader, common);
      shader.fragmentShader = addUniforms(shader.fragmentShader, uniformsRef.current);
      shader.vertexShader = addUniforms(shader.vertexShader, uniformsRef.current);
      shader.fragmentShader = addVarying(shader.fragmentShader, varyingsRef.current);
      shader.vertexShader = addVarying(shader.vertexShader, varyingsRef.current);
      shader.fragmentShader = editShader(shader.fragmentShader, fragBody);
      shader.vertexShader = editShader(shader.vertexShader, vertBody);
    });

    return new _material();
  }, [shaders, from]);
  return React.createElement("primitive", Object.assign({
    ref: ref,
    object: material,
    attach: "material"
  }, props, _uniforms));
});

function NullFunction() {
  return null;
} // -- VERTEX PROXY --


var vertHandler = {
  get: function get(_, name) {
    var Component = function Component(_ref) {
      var children = _ref.children;
      return children;
    };

    Object.defineProperty(Component, 'chunkName', {
      writable: true
    });
    Object.defineProperty(Component, 'shaderType', {
      writable: true
    });
    Component.chunkName = name === 'Body' ? DEFAULT_VERT_CHUNK : name;
    Component.shaderType = VERT;
    return Component;
  }
};
var vert = /*#__PURE__*/new Proxy(NullFunction, vertHandler); // -- FRAGMENT PROXY --

var fragHandler = {
  get: function get(_, name) {
    var Component = function Component(_ref2) {
      var children = _ref2.children;
      return children;
    };

    Object.defineProperty(Component, 'chunkName', {
      writable: true
    });
    Object.defineProperty(Component, 'shaderType', {
      writable: true
    });
    Component.chunkName = name === 'Body' ? DEFAULT_FRAG_CHUNK : name;
    Component.shaderType = FRAG;
    return Component;
  }
};
var frag = /*#__PURE__*/new Proxy(NullFunction, fragHandler);
function common(_ref3) {
  var children = _ref3.children;
  return children;
} // TODO
// // -- NOISE PROXY --
// const noise = {
//   snoise2: "glsl-noise/simplex/2d",
//   snoise3: "glsl-noise/simplex/3d",
//   snoise4: "glsl-noise/simplex/4d",
//   cnoise2: "glsl-noise/classic/2d",
//   cnoise3: "glsl-noise/classic/3d",
//   cnoise4: "glsl-noise/classic/4d",
//   pnoise2: "glsl-noise/periodic/2d",
//   pnoise3: "glsl-noise/periodic/3d",
//   pnoise4: "glsl-noise/periodic/4d",
// };
// const noiseHandler = {
//   get: function (_, name) {
//     const path = noise[name];
//     if (path) {
//       const pragma = `#pragma glslify: ${name} = require(${path})`;
//       const Component = () => null;
//       Object.defineProperty(Component, "shaderType", { writable: true });
//       Object.defineProperty(Component, "toolShader", { writable: true });
//       Component.shaderType = TOOL;
//       Component.toolShader = pragma;
//       return Component;
//     }
//     return null;
//   },
// };
// export const Noise = new Proxy(() => null, noiseHandler);
// // -- EASING PROXY --
// const easing = {
//   backInOut: "glsl-easings/back-in-out",
//   backIn: "glsl-easings/back-in",
//   backOut: "glsl-easings/back-out",
//   bounceInOut: "glsl-easings/bounce-in-out",
//   bounceIn: "glsl-easings/bounce-in",
//   bounceOut: "glsl-easings/bounce-out",
//   circularInOut: "glsl-easings/circular-in-out",
//   circularIn: "glsl-easings/circular-in",
//   circularOut: "glsl-easings/circular-out",
//   cubicInOut: "glsl-easings/cubic-in-out",
//   cubicIn: "glsl-easings/cubic-in",
//   cubicOut: "glsl-easings/cubic-out",
//   elasticInOut: "glsl-easings/elastic-in-out",
//   elasticIn: "glsl-easings/elastic-in",
//   elasticOut: "glsl-easings/elastic-out",
//   exponentialInOut: "glsl-easings/exponential-in-out",
//   exponentialIn: "glsl-easings/exponential-in",
//   exponentialOut: "glsl-easings/exponential-out",
//   linear: "glsl-easings/linear",
//   quadraticInOut: "glsl-easings/quadratic-in-out",
//   quadraticIn: "glsl-easings/quadratic-in",
//   quadraticOut: "glsl-easings/quadratic-out",
//   quarticInOut: "glsl-easings/quartic-in-out",
//   quarticIn: "glsl-easings/quartic-in",
//   quarticOut: "glsl-easings/quartic-out",
//   quinticInOut: "glsl-easings/quintic-in-out",
//   quinticIn: "glsl-easings/quintic-in",
//   quinticOut: "glsl-easings/quintic-out",
//   sineInOut: "glsl-easings/sine-in-out",
//   sineIn: "glsl-easings/sine-in",
//   sineOut: "glsl-easings/sine-out",
// };
// const easingHandler = {
//   get: function (_, name) {
//     const path = easing[name];
//     if (path) {
//       const pragma = `#pragma glslify: ${name} = require(${path})`;
//       const Component = () => null;
//       Object.defineProperty(Component, "shaderType", { writable: true });
//       Object.defineProperty(Component, "toolShader", { writable: true });
//       Component.shaderType = TOOL;
//       Component.toolShader = pragma;
//       return Component;
//     }
//     return null;
//   },
// };
// export const Ease = new Proxy(() => null, easingHandler);

var M = ComponentMaterial;
Object.defineProperties(ComponentMaterial, {
  Vert: {
    get: function get() {
      return vert;
    }
  },
  Frag: {
    get: function get() {
      return frag;
    }
  },
  Common: {
    get: function get() {
      return common;
    }
  }
});

export default M;
//# sourceMappingURL=component-material.esm.js.map
