const { meshelate } = require('./lib')

const v = [0, 0, 3, 0, 3, 4] // 3-4-5 triangle
const i = [0, 1, 2]

console.time('test')
const { vertices, indices } = meshelate(v, i, 5)
console.timeEnd('test')

console.log('vertices', vertices)
console.log('indices', indices)
