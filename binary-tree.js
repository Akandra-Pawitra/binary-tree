class Node {
  constructor (value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

class Tree {
  #root = null
  #tree = []

  constructor (arr) {
    this.input = arr
  }

  #newNode (value) {
    // create new Node and return the address
    const node = new Node(value)
    this.#tree.push(node)
    return this.#tree.indexOf(node)
  }

  #addNode (arr, treeAddress, left = true) {
    const mid = Math.floor(arr.length / 2)
    // initialize tree, only run once
    if (treeAddress === undefined) {
      // initialize root (lv 0 node) pointer
      const root = this.#newNode(arr[mid])
      this.#root = root
      // splice mutate the array
      arr.splice(mid, 1)
      const leftArr = arr.splice(0, mid)
      // don't call recursion if array is empty
      if (leftArr.length) this.#addNode(leftArr, root)
      if (arr.length) this.#addNode(arr, root, false)
    } else {
      if (arr.length < 2) { // base case
        const leaf = this.#newNode(arr[0])
        const tree = this.#tree[treeAddress]
        left ? tree.left = leaf : tree.right = leaf
      } else {
        const leaf = this.#newNode(arr[mid])
        const tree = this.#tree[treeAddress]
        left ? tree.left = leaf : tree.right = leaf
        arr.splice(mid, 1)
        const leftArr = arr.splice(0, mid)
        if (leftArr.length) this.#addNode(leftArr, leaf)
        if (arr.length) this.#addNode(arr, leaf, false)
      }
    }
  }

  buildTree () {
    // remove duplicate and sort ascending
    let arr = Array.from(new Set(this.input))
    arr = arr.sort((a, b) => a - b)
    this.#addNode(arr)
    return this.#tree[this.#root]
  }

  find (value) {
    let node = this.#tree[this.#root]
    while (node.value !== value) {
      value > node.value
        ? node = this.#tree[node.right]
        : node = this.#tree[node.left]
    }
    const address = this.#tree.indexOf(node)
    return this.#tree[address]
  }

  insert (value) {
    let tree = this.#tree[this.#root]
    while (true) {
      // tree doesn't accept duplicate value
      if (value === tree.value) return console.log('Duplicate value')
      else if (value > tree.value) {
        // if tree pointer isn't null, follow the pointer
        if (tree.right !== null) {
          tree = this.#tree[tree.right]
          continue
        } else {
          // if it null, set the pointer to leaf address
          const leaf = this.#newNode(value)
          tree.right = leaf
          break
        }
      } else if (value < tree.value) {
        if (tree.left !== null) {
          tree = this.#tree[tree.left]
          continue
        } else {
          const leaf = this.#newNode(value)
          tree.left = leaf
          break
        }
      }
    }
  }

  print (address = this.#root, prefix = '', isLeft = true) {
    let node
    if (typeof address === 'object') {
      node = address
    } else {
      // in case user doesn't pass a node as the argument
      node = this.#tree[address]
    }
    if (node.right !== null) {
      this.print(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false)
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`)
    if (node.left !== null) {
      this.print(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true)
    }
  }
}

const list = []
const n = 20
for (let i = 0; i <= n; i += 1) {
  list.push(i)
}

const a = new Tree(list)
a.buildTree()
// a.print()
// for (let i = 0; i <= n; i++) if (i % 2) a.insert(i)
a.print(a.find(5))
