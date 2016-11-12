const Timer = require('hirestime')
const fs = require('fs')
const Promise = require('bluebird')
const { nthArg, pipe, modulo, __, equals, when } = require('ramda')
const fse = require('fs-extra')

const emitter = require('./emitter')
const { dirName, generatorOpts, fileNames,promisyOpts } = require('./config')
const { batchTest, mapper, testEnviroment } = require('./utils')
const bufferGenerator = require('./random-data')
const logResults = require('./stats')

const suite = {
  sync: {
    type:'sync',
    mapper:mapper(writerSync,fileNames.sync),
    logger:putIteration(`sync`)
  },
  async: {
    type:'async',
    mapper:mapper(writerAsync,fileNames.async),
    logger:putIteration(`async`)
  }
}
const randomItem = length=>()=>Math.floor(Math.random()*length)
function Batch(fileAmount) {
  return function*(buffers,nextIndex){
    for (let j=0;j<fileAmount;j++)
      yield buffers[nextIndex()]
  }
}
function DataStore(max){
  const batch = Batch(generatorOpts.fileAmount)
  return function*(buffers){
    const nextIndex = randomItem(buffers.length)
    for (let i=0;i<max;i++)
      yield [...batch(buffers,nextIndex)]
  }
}

function promisifyGenerator() {
  return new Promise(resolve=>{
    const buffers = bufferGenerator(generatorOpts.fileAmount,generatorOpts.fileLength)
    resolve(buffers)
  })
}

const batchPromise = (buffers)=>{
  return new Promise(e=>e(buffers))
    .tap(batchTest(suite.sync))
    .tap(batchTest(suite.async))
}

/**
 *
 * @returns {Promise<Buffer[]>}
 */
function writeTester() {
  testEnviroment(dirName)
  const dataStore = DataStore(generatorOpts.iterations)
  return promisifyGenerator()
    .then(dataStore)
    .map(batchPromise,promisyOpts)
    .then(()=>logResults(emitter.list))
}

/**
 * @param {string} text
 */
function putIteration(type) {
  function onResolve(resolve) {
    emitter.emit(type,resolve)
  }
  return onResolve
}


function writerAsync(filename,data) {
  return function (resolve){
    const timer = Timer()
    fs.writeFile(filename,data,onWriteEnd(timer,resolve))
  }
}

function writerSync(filename,data) {
  return function (resolve){
    const timer = Timer()
    fs.writeFileSync(filename,data)
    onWriteEnd(timer,resolve)()
  }
}


function onWriteEnd(timer,response){
  return function(err) {
    const time = timer()
    if(err) console.error(err)
    response(time)
  }
}


module.exports = writeTester