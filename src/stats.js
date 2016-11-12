const { median, mean, sum, map, pipe, zip, zipWith, apply } = require('ramda')

const wrapMedian = func=>pipe( map(func), median, e=>e.toFixed(2) )
const fullMedian = wrapMedian(median)
const meanMedian = wrapMedian(mean)
const sumMedian = wrapMedian(sum)
const inner = zipWith((a,b)=>a-b)
const differ = pipe(zip,map(apply(inner)), map(map(e=>e.toFixed(2))))
function logResults(list){

  const medians = map(fullMedian)(list)
  const means = map(meanMedian)(list)
  const sums = map(sumMedian)(list)
  const differs = differ(list.async,list.sync)
  const dif = {
    median:fullMedian(differs),
    mean:meanMedian(differs)
  }
  console.log(`---RESULTS---`)
  console.log(`Iterations ${differs.length}`)
  // console.log(`Full differ ${differs}`)
  console.log(`Dif mean ${dif.mean} median ${dif.median}`)
  console.log(`Mean sync ${means.sync} async ${means.async}`)
  console.log(`Median sync ${medians.sync} async ${medians.async}`)
  console.log(`Sum sync ${sums.sync} async ${sums.async}`)
}
module.exports = logResults