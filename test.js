const fs = require('fs')
const { meshelate } = require('./lib')
const { zeroClip } = require('zero-clip')

// const squares = [
//   [
//     [0, 0],
//     [4096, 0],
//     [4096, 4096],
//     [0, 4096],
//     [0, 0]
//   ],
//   [
//     [1024, 1024],
//     [1024, 3072],
//     [3072, 3072],
//     [3072, 1024],
//     [1024, 1024]
//   ]
// ]

// const data = zeroClip(squares)

const input = JSON.parse(fs.readFileSync('./features/holesTest.json', 'utf8'))
const allCoords = input.features[0].geometry.coordinates

const data = { vertices: [], indices: [] }

console.time('zero-clip')
allCoords.forEach(coords => {
  const d = zeroClip(coords, data.vertices.length / 2)
  data.vertices.push(...d.vertices)
  data.indices.push(...d.indices)
})
console.timeEnd('zero-clip')

console.log('vertices', data.vertices.length)
console.log('indices', data.indices.length)

console.time('meshelate')
const { vertices, indices } = meshelate(data.vertices, data.indices, 4096 / 16)
console.timeEnd('meshelate')

console.log('vertices', vertices.length)
console.log('indices', indices.length)

// const featureCollection = {
//   type: 'FeatureCollection',
//   features: []
// }
//
// for (let i = 0, il = indices.length; i < il; i += 3) {
//   const feature = {
//     type: 'Feature',
//     properties: {},
//     geometry: {
//       type: 'Polygon',
//       coordinates: [[
//         [vertices[indices[i] * 2] / 4096, vertices[indices[i] * 2 + 1] / 4096],
//         [vertices[indices[i + 1] * 2] / 4096, vertices[indices[i + 1] * 2 + 1] / 4096],
//         [vertices[indices[i + 2] * 2] / 4096, vertices[indices[i + 2] * 2 + 1] / 4096],
//         [vertices[indices[i] * 2] / 4096, vertices[indices[i] * 2 + 1] / 4096]
//       ]]
//     }
//   }
//
//   featureCollection.features.push(feature)
// }
//
// fs.writeFileSync('./out.json', JSON.stringify(featureCollection, null, 2))
