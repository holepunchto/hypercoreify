const crypto = require('hypercore-crypto')

module.exports = async function hypercoreify (store, blocks, opts = {}) {
  if (blocks.length !== 1) throw new Error('Only one block supported atm, yolo')

  const manifest = {
    version: 1,
    hash: 'blake2b',
    allowPatch: false,
    quorum: 0,
    signers: [],
    prologue: createPrologue(blocks),
    unencrypted: !!opts.unencrypted
  }

  const core = store.get({ manifest, active: opts.active, encryption: opts.encryption })

  await core.ready()
  if (core.length === 0) await core.append(blocks, { writable: true })

  return core
}

function createPrologue (blocks) {
  const block = blocks[0] // only one atm, yolo
  const hash = crypto.data(block)
  const node = { index: 0, size: block.byteLength, hash }
  const treeHash = crypto.tree([node])
  return { hash: treeHash, length: 1 }
}
