const Timer = require('hirestime')
const { pipe, map, splitEvery, apply, join } = require('ramda')


const { charOpts } = require('./config')


/**
 * Generate number represents char in asii table @see charOpts
 * @func randomChar
 * @return {number} char number
 */
function randomChar() {
  const seed = Math.random()
  const char = seed*charOpts.range+charOpts.asciiBias
  return char
}


const batchConvert = pipe( splitEvery(charOpts.wordsSplit), map(apply(String.fromCharCode)), join('') )
/**
 * Generate random string
 * @func randomString
 * @param {number} strLength Generated string length
 * @return {string} Random string
 */
function randomString(strLength) {
  const emptyCharArray = Array(strLength).fill(' ')
  const filledCharArray = map(randomChar,emptyCharArray)
  const result = batchConvert(filledCharArray)
  return result
}


/**
 * @param {number} bufferLength Generated buffer length
 * @returns
 */
function getBuffer(bufferLength){
  const data = randomString(bufferLength)
  return Buffer.from(data)
}


/**
 * Generate a lot of random data
 * @func bufferGenerator
 * @param {number} amount Number of files
 * @param {number} length Length of each file
 * @returns Random buffers
 */
function bufferGenerator(amount,length) {
  /** @type {Buffer[]} */
  const data = []
  console.log(`Generate ${amount} file buffers ${length} length`)
  console.log(`It takes some time`)
  const timer = Timer()
  for(let i=0;i<amount;i++) {
    console.log(`file ${i}`)
    data.push(getBuffer(length))
  }
  const datagenTime = timer()
  console.log(`Generated in ${datagenTime} ms`)
  return data
}

module.exports = bufferGenerator