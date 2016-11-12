const Promise = require('bluebird')
const fse = require('fs-extra')

const { promisyOpts } = require('./config')

/**
 * @typedef {function(Buffer,number):Promise<Buffer>} MapIterator
 */

/**
 * @typedef {function(number[]):void} Logger
 */

/**
 * @typedef {{mapper:MapIterator,logger:Logger}} BatchTestOpts
 */

/**
 * Batch run each test
 *
 * @param {BatchTestOpts} opts
 * @returns {function(Buffer[]):Promise<void>}
 */
function batchTest(opts){
  return buffers=>
    Promise
      .map(buffers,opts.mapper,promisyOpts)
      .then(opts.logger,e=>console.error(e))
}
let fileCounter = 0
/**
 * @typedef {function(function(Buffer):void):void} Resolver
 */

/**
 * @typedef {function(string,Buffer):Resolver} Writer
 */

/**
 *
 * @param {Writer} func
 * @param {string} fileName
 * @return onEachBuffer
 */
function mapper(func,fileName) {
  /**
   *
   * @func onEachBuffer
   * @param {Buffer} item
   * @param {number} index
   */
  function onEachBuffer(item,index) {
    const fullFilename = `${fileName}[${++fileCounter}][${index}].tmp`
    return new Promise(func(fullFilename,item))
  }
  return onEachBuffer
}

/**
 *
 * @param {string} usedPath
 */
function testEnviroment(usedPath) {
  try {
    fse.ensureDirSync(usedPath)
  }
  catch (err) {
    console.error(`Ensure dir error`,err)
  }
}

module.exports = { batchTest, mapper, testEnviroment }