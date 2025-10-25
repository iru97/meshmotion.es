#!/usr/bin/env node

/**
 * Generate a simple test cube GLB file for immediate testing
 * Run with: node scripts/generate-test-cube.js
 */

const fs = require('fs')
const path = require('path')

// Simple GLB structure with a cube
const vertices = new Float32Array([
  // Front face
  -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
  // Back face
  -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,
  // Top face
  -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
  // Bottom face
  -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
  // Right face
  1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
  // Left face
  -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1,
])

const normals = new Float32Array([
  // Front
  0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
  // Back
  0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
  // Top
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  // Bottom
  0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
  // Right
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
  // Left
  -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
])

const indices = new Uint16Array([
  0, 1, 2, 0, 2, 3, // Front
  4, 5, 6, 4, 6, 7, // Back
  8, 9, 10, 8, 10, 11, // Top
  12, 13, 14, 12, 14, 15, // Bottom
  16, 17, 18, 16, 18, 19, // Right
  20, 21, 22, 20, 22, 23, // Left
])

// Create glTF JSON
const gltf = {
  asset: {
    version: '2.0',
    generator: '3D Next Viewer Test Generator',
  },
  scene: 0,
  scenes: [
    {
      nodes: [0],
    },
  ],
  nodes: [
    {
      mesh: 0,
      name: 'TestCube',
    },
  ],
  meshes: [
    {
      primitives: [
        {
          attributes: {
            POSITION: 0,
            NORMAL: 1,
          },
          indices: 2,
          material: 0,
        },
      ],
      name: 'Cube',
    },
  ],
  materials: [
    {
      pbrMetallicRoughness: {
        baseColorFactor: [0.8, 0.2, 0.2, 1.0],
        metallicFactor: 0.1,
        roughnessFactor: 0.7,
      },
      name: 'CubeMaterial',
    },
  ],
  accessors: [
    {
      bufferView: 0,
      componentType: 5126, // FLOAT
      count: 24,
      type: 'VEC3',
      max: [1, 1, 1],
      min: [-1, -1, -1],
    },
    {
      bufferView: 1,
      componentType: 5126, // FLOAT
      count: 24,
      type: 'VEC3',
    },
    {
      bufferView: 2,
      componentType: 5123, // UNSIGNED_SHORT
      count: 36,
      type: 'SCALAR',
    },
  ],
  bufferViews: [
    {
      buffer: 0,
      byteOffset: 0,
      byteLength: vertices.byteLength,
      target: 34962, // ARRAY_BUFFER
    },
    {
      buffer: 0,
      byteOffset: vertices.byteLength,
      byteLength: normals.byteLength,
      target: 34962, // ARRAY_BUFFER
    },
    {
      buffer: 0,
      byteOffset: vertices.byteLength + normals.byteLength,
      byteLength: indices.byteLength,
      target: 34963, // ELEMENT_ARRAY_BUFFER
    },
  ],
  buffers: [
    {
      byteLength: vertices.byteLength + normals.byteLength + indices.byteLength,
    },
  ],
}

// Convert to GLB format
const jsonString = JSON.stringify(gltf)
const jsonBuffer = Buffer.from(jsonString)
const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4
const jsonChunkLength = jsonBuffer.length + jsonPadding

// Binary data chunk
const binaryData = Buffer.concat([
  Buffer.from(vertices.buffer),
  Buffer.from(normals.buffer),
  Buffer.from(indices.buffer),
])
const binaryPadding = (4 - (binaryData.length % 4)) % 4
const binaryChunkLength = binaryData.length + binaryPadding

// GLB header
const glbHeader = Buffer.alloc(12)
glbHeader.writeUInt32LE(0x46546c67, 0) // 'glTF' magic
glbHeader.writeUInt32LE(2, 4) // version
glbHeader.writeUInt32LE(
  12 + 8 + jsonChunkLength + 8 + binaryChunkLength,
  8
) // total length

// JSON chunk header
const jsonChunkHeader = Buffer.alloc(8)
jsonChunkHeader.writeUInt32LE(jsonChunkLength, 0)
jsonChunkHeader.writeUInt32LE(0x4e4f534a, 4) // 'JSON' type

// Binary chunk header
const binaryChunkHeader = Buffer.alloc(8)
binaryChunkHeader.writeUInt32LE(binaryChunkLength, 0)
binaryChunkHeader.writeUInt32LE(0x004e4942, 4) // 'BIN\0' type

// Combine all parts
const glb = Buffer.concat([
  glbHeader,
  jsonChunkHeader,
  jsonBuffer,
  Buffer.alloc(jsonPadding, 0x20), // space padding
  binaryChunkHeader,
  binaryData,
  Buffer.alloc(binaryPadding, 0x00), // null padding
])

// Write to file
const outputDir = path.join(__dirname, '..', 'public', 'models', 'test')
const outputPath = path.join(outputDir, 'cube.glb')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

fs.writeFileSync(outputPath, glb)

console.log(`✅ Test cube generated: ${outputPath}`)
console.log(`   File size: ${glb.length} bytes`)
console.log(`   You can now drag & drop this file into the viewer to test!`)
