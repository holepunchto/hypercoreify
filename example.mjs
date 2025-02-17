import Corestore from 'corestore'
import hypercoreify from './index.js'

const store = new Corestore('./corestore')
const core = await hypercoreify(store, [Buffer.from('hello world')])

console.log(core)

console.log(core.core.header)
console.log(await core.get(0))
