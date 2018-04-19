const copyObj = obj => {
  let copy = {}

  if (typeof obj === 'object' && obj !== null) {
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = copyObj(obj[attr])
      }
    }
  } else {
    copy = obj
  }
  return copy
}

module.exports = copyObj
