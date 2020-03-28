/**

For each polygon, if the line is too long, split at the mid-point with the opposite corner

**/
function meshelate (vertices, srcIndices, maxLength = Infinity, dim = 2) {
  const il = srcIndices.length
  const indices = []

  let a, b, c, bI, vl
  let i = 0
  while (i < il) {
    const stack = [srcIndices[i++], srcIndices[i++], srcIndices[i++]]

    while (stack.length) {
      // we have to compare 3 lines
      for (let i = 0; i < 3; i++) {
        // grab the first three from the stack
        a = stack[i]
        bI = (i + 1) % 3
        b = stack[bI]
        // if line too long, split and start over
        if (isTooLong(a, b, vertices, maxLength, dim)) {
          c = stack[(i + 2) % 3]
          for (let i = 0; i < dim; i++) vertices.push((vertices[b * dim + i] + vertices[a * dim + i]) / 2)
          // split
          vl = (vertices.length - 2) / dim
          stack[bI] = vl
          stack.push(vl, b, c)
          // start over
          continue
        }
      }

      // store the current triangle
      indices.push(stack.shift(), stack.shift(), stack.shift())
    }
  }

  return { vertices, indices }
}

function isTooLong (a, b, vertices, maxLength, dim) {
  let length = 0
  let diff

  for (let i = 0; i < dim; i++) {
    diff = vertices[b * dim + i] - vertices[a * dim + i]
    length += diff * diff
  }

  return Math.sqrt(length) >= maxLength
}

exports.default = exports.meshelate = meshelate
