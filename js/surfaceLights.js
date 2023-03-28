const shapes = []
let fbo
let blurShader
let surface
function surfaceSetup() {
	surface = createGraphics(960, 540, WEBGL)
	for (let i = 0; i < 40; i++) {
		shapes.push(genShape())
	}
	fbo = new Framebuffer(surface)
  blurShader = surface.createShader(vert, frag)
}

function genShape() {
	const scale = max(20, randomGaussian(60, 40))
	return {
		position:  surface.createVector(
			randomGaussian(100, 960/5),
			-200,
			randomGaussian(0, 960/5)
		),
		verts: [0,1,2].map((i) => surface.createVector(
			scale * cos(TWO_PI*i/3 + randomGaussian(0, 0.4)),
			0,
			scale * sin(TWO_PI*i/3 + randomGaussian(0, 0.4))
		)),
		floorOffset:  surface.createVector(
			randomGaussian(-100, 80),
			400,
			randomGaussian(-50, 80),
		),
	}
}

function distort(position, time) {
	const noiseOffset = createVector(
		20*sin(0.01*position.x + time + 0.05*position.y),
		0,
		30*sin(20 + 0.02*position.x + time*0.8 + 0.07*position.y)
	)
	return position.copy().add(noiseOffset)
}

function drawSurface() {
	const eyeZ = (540/2) / tan(PI/6)
  const near = eyeZ/10
  const far = eyeZ*10
  surface.perspective(PI/3, 960/540, near, far)
	
  const blurIntensity = 0.06
	const targetDepth = 180 //400
	
	fbo.draw(() => {
    surface.clear()
    surface.push()
		surface.background('#0c2e6e')
		surface.clear()
    const context = surface.drawingContext
		context.disable(context.DEPTH_TEST)
		context.enable(context.BLEND)
		context.blendEquation(context.FUNC_ADD)
		context.blendFunc(context.SRC_ALPHA, context.DST_ALPHA)

		const time = millis()/1000

		surface.noStroke()
		
		surface.beginShape(TRIANGLE_STRIP)
		for (const [c, y] of [
			['#56b5e8', -540/2],
			['#0c2e6e', -540/8],
			['#0c2e6e', 540/2]
		]) {
			surface.fill(c)
			for (const x of [-960/2, 960/2]) {
				surface.vertex(x, y)
			}
		}
		surface.endShape()
		
		surface.translate(0, 0, -200)
		
		for (const { position, verts, floorOffset } of shapes) {

			surface.push()
			const distortedVerts = verts
				.map((v) => distort(v.copy().add(position), time))
			const floorVerts = distortedVerts
				.map((v) => v.copy().sub(position).mult(4).add(position).add(floorOffset))

			// shape on top
			surface.fill(254, 255, 217, 40)
			surface.beginShape(TRIANGLES)
			for (const { x, y, z} of distortedVerts) {
				surface.vertex(x, y, z)
			}
			surface.endShape()

			// shape on bottom
			surface.fill(254, 255, 217, 10)
			surface.beginShape(TRIANGLES)
			for (const { x, y, z } of floorVerts) {
				surface.vertex(x, y, z)
			}
			surface.endShape()

			// rays connecting them
			surface.beginShape(TRIANGLE_STRIP)
			for (let i = 0; i < 4; i++) {
				const idx = i % 3
				for (const [alpha, { x, y, z }] of [
					[6, distortedVerts[idx]],
					[0, floorVerts[idx]],
				]) {
					surface.fill(254, 255, 217, alpha)
					surface.vertex(x, y, z)
				}
			}
			surface.endShape()

			surface.pop()
		}
		surface.pop()
	})
	
	surface.clear()

  surface.push()

  surface.noStroke()
  surface.rectMode(CENTER)
  surface.shader(blurShader)
  surface._renderer.getTexture(fbo.depth).setInterpolation(
    surface._renderer.GL.NEAREST,
    surface._renderer.GL.NEAREST
  )
  blurShader.setUniform('uImg', fbo.color)
  blurShader.setUniform('uDepth', fbo.depth)
  blurShader.setUniform('uSize', [960, 540])
  // try replacing blurIntensity with 0 to see an unblurred version
  blurShader.setUniform('uIntensity', blurIntensity)
  blurShader.setUniform('uNumSamples', 25)
  blurShader.setUniform('uTargetZ', targetDepth)
  blurShader.setUniform('uNear', near)
  blurShader.setUniform('uFar', far)
  
  surface.rect(0, 0, 960, -540)
  surface.pop()

  image(surface, 0, 0, 960, 540)
}

// P5 manages its own WebGL textures normally, so that users don't
// have to worry about manually updating texture data on the GPU.
//
// However, if we're trying to use a framebuffer texture that we've
// drawn to via WebGL, we don't want to ever send data to it, since
// it gets content when we draw to it! So we need to make something
// that looks like a p5 texture but that never tries to update
// data in order to use framebuffer textures inside p5.
class RawTextureWrapper extends p5.Texture {
  constructor(renderer, obj, w, h) {
    super(renderer, obj)
    this.width = w
    this.height = h
    return this
  }
  
  _getTextureDataFromSource() {
    return this.src
  }
  
  init(tex) {
    const gl = this._renderer.GL
    this.glTex = tex

    this.glWrapS = this._renderer.textureWrapX
    this.glWrapT = this._renderer.textureWrapY

    this.setWrapMode(this.glWrapS, this.glWrapT)
    this.setInterpolation(this.glMinFilter, this.glMagFilter)
  }
  
  update() {
    return false
  }
}

class Framebuffer {
  constructor(canvas) {
    this._renderer = canvas._renderer
    
    const gl = this._renderer.GL
    const ext = gl.getExtension('WEBGL_depth_texture')
    
    const width = this._renderer.width
    const height = this._renderer.height
    const density = this._renderer._pInst._pixelDensity

    const colorTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width*density, height*density, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    // Create the depth texture
    const depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, width*density, height*density, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);

    const depthP5Texture = new RawTextureWrapper(this._renderer, depthTexture, width*density, height*density)
    this._renderer.textures.push(depthP5Texture)

    const colorP5Texture = new RawTextureWrapper(this._renderer, colorTexture, width*density, height*density)
    this._renderer.textures.push(colorP5Texture)

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    
    this.framebuffer = framebuffer
    this.depth = depthTexture
    this.color = colorTexture
  }
  
  draw(cb) {
    this._renderer.GL.bindFramebuffer(this._renderer.GL.FRAMEBUFFER, this.framebuffer)
    cb()
    this._renderer.GL.bindFramebuffer(this._renderer.GL.FRAMEBUFFER, null)
  }
}


const vert = `attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec2 aTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat3 uNormalMatrix;

  varying highp vec2 vVertTexCoord;

  void main(void) {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    vVertTexCoord = aTexCoord;
  }
`
const frag = `precision mediump float;
  varying highp vec2 vVertTexCoord;

  uniform sampler2D uImg;
  uniform sampler2D uDepth;
  uniform vec2 uSize;
  uniform float uIntensity;
  uniform int uNumSamples;
  uniform float uTargetZ;
  uniform float uNear;
  uniform float uFar;

  const int MAX_NUM_SAMPLES = 50;

  float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  float depthToZ(float depth) {
    float depthNormalized = 2.0 * depth - 1.0;
    return 2.0 * uNear * uFar / (uFar + uNear - depthNormalized * (uFar - uNear));
  }
	
	float getZ(vec2 coord) {
		float depth = (1. - coord.y) * -100. + 200.;
		return depth;
  }

  float calcBlur(float z, float pixelScale) {
    return clamp(abs(z - uTargetZ), 0.0, 0.5*pixelScale);
  }

  vec4 addFog(vec4 color, float z) {
    vec4 fogColor = vec4(0.05, 0.05, 0.05, 1.0);
    vec4 withFog = mix(color, fogColor, clamp(z / 1200. - 0.2, 0., 1.));
    return withFog;
  }

  float getBrightness(vec4 color) {
    float b = color.z;
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = pow(b, 0.8);
    b = clamp(b * 1.35, 0., 1.);
    return b;
  }

  void main() {
    float pixelScale = max(uSize.x, uSize.y);
    float total = 1.0;
    //float origZ = depthToZ(texture2D(uDepth, vVertTexCoord).x);
		float origZ = getZ(vVertTexCoord);
    vec4 color = addFog(texture2D(uImg, vVertTexCoord), origZ);
    float blurAmt = calcBlur(origZ, pixelScale);
    for (int i = 0; i < MAX_NUM_SAMPLES; i++) {
      if (i >= uNumSamples) break;
      float t = (float(i + 1) / float(uNumSamples));
      float angle = (t*4.0) * ${2 * Math.PI};
      float radius = 1.0 - (t*t*t); // Sample more on the outer edge
      angle += 1.*rand(gl_FragCoord.xy);
      vec2 offset = (vec2(cos(angle),sin(angle)) * radius * uIntensity * blurAmt)/pixelScale;
      //float z = depthToZ(texture2D(uDepth, vVertTexCoord + offset).x);
			float z = getZ(vVertTexCoord);
      float sampleBlur = calcBlur(z, pixelScale);

      //float weight = float(z >= origZ);
      float weight = float((z >= origZ) || (sampleBlur >= blurAmt*radius + 5.));
      //vec4 sample = addFog(texture2D(uImg, vVertTexCoord + offset), z);
			vec4 sample = texture2D(uImg, vVertTexCoord + offset);
      color += weight * sample;
      total += weight;
    }
    color /= total;
		gl_FragColor = color;
    //float brightness = getBrightness(color);
    //gl_FragColor = vec4(brightness, brightness, brightness, 1.0);
  }
  `


