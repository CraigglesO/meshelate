/**

For each polygon, if the line is too long, split at the mid-point with the opposite corner

**/
function meshelate (vertices, srcIndices, maxLength = Infinity, offset = 0, dim = 2) {
  const il = srcIndices.length
  const indices = []

  let a, b, c, bI, cI, vl, split
  let i = 0
  while (i < il) {
    const stack = [srcIndices[i++], srcIndices[i++], srcIndices[i++]]

    while (stack.length) {
      // we have to compare 3 lines
      split = false
      for (let j = 0; j < 3; j++) {
        // grab the first three from the stack
        a = stack[j]
        bI = (j + 1) % 3
        b = stack[bI]
        // if line too long, split and start over
        if (isTooLong(a, b, vertices, maxLength, offset, dim)) {
          cI = (j + 2) % 3
          c = stack[cI]
          for (let k = 0; k < dim; k++) vertices.push((vertices[(b - offset) * dim + k] + vertices[(a - offset) * dim + k]) / 2)
          // split
          vl = (vertices.length - 2) / dim
          // during split, we also rotate all by 1, so if the result was a-b-c, we would do c-a-b
          // still the same triangle, still same rotation, but this ensures we find the longest line
          // roughly 50% of the time
          stack[j] = c
          stack[bI] = a
          stack[cI] = vl
          stack.push(c, vl, b)
          split = true
          break
        }
      }
      if (split) continue

      // store the current triangle
      indices.push(stack.shift(), stack.shift(), stack.shift())
    }
  }

  return { vertices, indices }
}

function isTooLong (a, b, vertices, maxLength, offset, dim) {
  let length = 0
  let diff

  for (let i = 0; i < dim; i++) {
    diff = vertices[(b - offset) * dim + i] - vertices[(a - offset) * dim + i]
    length += diff * diff
  }

  return Math.sqrt(length) >= maxLength
}

exports.default = exports.meshelate = meshelate
