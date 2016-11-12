# filewrite-perfomance

Simple perfomance test of node **fs.writeFile** and **fs.writeFileSync**.
Generate a lot of random files *(* **>10Gb** *on default settings!)* and sequentally write random parts on disk

## Configuration

>I will add CLI interface ASAP, but now module use *src/config.js* for testing settings

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

* ### generatorOpts
**fileLength**: Amount of random chars in every file.

**fileAmount**: Amount of generated files

**iterations**: Repeat write cycle for every file. Increase dump size

