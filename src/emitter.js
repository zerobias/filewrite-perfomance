const EventEmitter = require('events')

const { generatorOpts } = require('./config')

class Storage extends EventEmitter {
  constructor() {
    super()
    this.list = {
      sync:[],
      async:[]
    }
    const emitter = type=>(times)=>this.list[type].push(times)
    this.on('async',emitter('async'))
    this.on('sync',emitter('sync'))
  }
}

module.exports = new Storage