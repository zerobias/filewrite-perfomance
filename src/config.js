const dirName = './writetest'

const fileNames = {
  sync:`${dirName}/fileSync`,
  async:`${dirName}/fileAsync`
}

const generatorOpts = {
  fileLength:2e7,
  fileAmount:8,
  iterations:40
}

const promisyOpts = {
  concurrency: 1
}

const charOpts = {
  range:75,
  asciiBias:48,
  wordsSplit:800
}

module.exports = { dirName, fileNames, generatorOpts, charOpts, promisyOpts }