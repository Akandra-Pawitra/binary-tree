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

  #addNode (arr, parentAddress, left = true) {
    const mid = Math.floor(arr.length / 2)
    // initialize tree, only run once
    if (parentAddress === undefined) {
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
        const child = this.#newNode(arr[0])
        const parent = this.#tree[parentAddress]
        left ? parent.left = child : parent.right = child
      } else {
        const child = this.#newNode(arr[mid])
        const parent = this.#tree[parentAddress]
        left ? parent.left = child : parent.right = child
        arr.splice(mid, 1)
        const leftArr = arr.splice(0, mid)
        if (leftArr.length) this.#addNode(leftArr, child)
        if (arr.length) this.#addNode(arr, child, false)
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

  print (address = this.#root, prefix = '', isLeft = true) {
    // node is root node by default
    const node = this.#tree[address]
    if (node.right !== null) {
      this.print(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false)
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`)
    if (node.left !== null) {
      this.print(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true)
    }
  }
}

const list = [0, 0, 6, 3, 8, 1, 4, 7, 5, 9, 2, 2, 4, 7, 9, 5, 1]
const a = new Tree(list)
a.buildTree()
a.print()
