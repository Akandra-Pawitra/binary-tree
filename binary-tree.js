class Tree {
  #root = null
  #tree = []

  constructor (arr) {
    this.input = arr
  }

  #node (value) {
    // create new Node and return the address
    // const node = new Node(value)
    const newNode = {
      value,
      left: null,
      right: null
    }
    this.#tree.push(newNode)
    return this.#tree.indexOf(newNode)
  }

  #addNode (arr, treeAddress, isLeft = true) {
    const mid = Math.floor(arr.length / 2)
    // initialize tree, only run once
    if (treeAddress === undefined) {
      // initialize root (lv 0 node) pointer
      const root = this.#node(arr[mid])
      this.#root = root
      // splice mutate the array
      arr.splice(mid, 1)
      const leftArr = arr.splice(0, mid)
      // don't call recursion if array is empty
      if (leftArr.length) this.#addNode(leftArr, root)
      if (arr.length) this.#addNode(arr, root, false)
    } else {
      if (arr.length < 2) { // base case
        const leaf = this.#node(arr[0])
        const tree = this.#tree[treeAddress]
        isLeft ? tree.left = leaf : tree.right = leaf
      } else {
        const leaf = this.#node(arr[mid])
        const tree = this.#tree[treeAddress]
        isLeft ? tree.left = leaf : tree.right = leaf
        arr.splice(mid, 1)
        const leftArr = arr.splice(0, mid)
        if (leftArr.length) this.#addNode(leftArr, leaf)
        if (arr.length) this.#addNode(arr, leaf, false)
      }
    }
  }

  buildTree () {
    // doesn't accept undefined value
    let arr = []
    for (let i = 0; i < this.input.length; i++) {
      if (this.input[i] !== undefined) arr.push(this.input[i])
    }
    // remove duplicate and sort ascending
    arr = Array.from(new Set(this.input))
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
          const leaf = this.#node(value)
          tree.right = leaf
          break
        }
      } else if (value < tree.value) {
        if (tree.left !== null) {
          tree = this.#tree[tree.left]
          continue
        } else {
          const leaf = this.#node(value)
          tree.left = leaf
          break
        }
      }
    }
  }

  delete (value) {
    // I don't even know why or how this method work
    // find node and keep track the parent
    let node = this.#tree[this.#root]
    let parent = null
    let isLeft = true
    while (node.value !== value) {
      if (value > node.value) {
        parent = node
        node = this.#tree[node.right]
        isLeft = false
      } else if (value < node.value) {
        parent = node
        node = this.#tree[node.left]
        isLeft = true
      }
    }
    // case 1: node is a leaf
    const address = this.#tree.indexOf(node)
    if (node.right === null && node.left === null) {
      // because the pointer point to the index of the node
      // using splice will messed up with the pointer
      this.#tree[address] = undefined
      isLeft ? parent.left = null : parent.right = null
      // case 2: node has 1 child or branch
    } else if (node.right === null || node.left === null) {
      if (node.left !== null) {
        // node has left branch
        this.#tree[address] = undefined
        isLeft ? parent.left = node.left : parent.right = node.left
      } else {
        // node has right branch
        this.#tree[address] = undefined
        isLeft ? parent.left = node.right : parent.right = node.right
      }
      // case 3: node has 2 child or branch
    } else if (node.right !== null && node.left !== null) {
      /* find a node that its value if replacing the deleted
        node still satisfy binary tree criteria */
      let child = this.#tree[node.right]
      let nextNode = child.left
      /* set the child parent pointer to null,
        otherwise the tree will have cyclical pointer */
      let prevNode = null
      while (child.left !== null) {
        prevNode = child
        child = this.#tree[nextNode]
        nextNode = child.left
      }
      const childAddress = this.#tree.indexOf(child)
      if (prevNode === null) {
        child.left = node.left
      } else {
        // Not sure why setting prevNode.left to child.right work
        // But if it removed, the method will not work as intended
        prevNode.left = child.right
        child.right = node.right
        child.left = node.left
      }
      this.#tree[address] = undefined
      // in case node is lv 0 root node
      if (parent === null) {
        this.#root = childAddress
      } else {
        isLeft ? parent.left = childAddress : parent.right = childAddress
      }
    }
  }

  levelOrder (func = null) {
    // to pass a function, don't invoke it (adding () parentheses)
    // for example, console.log
    // or better, use function expression instead declaration
    const queue = []
    const result = []
    queue.push(this.#tree[this.#root])
    // loop until queue is empty
    while (queue.length) {
      // iterative breadth first
      result.push(queue[0])
      // if child exist, put in queue
      if (queue[0].left) queue.push(this.#tree[queue[0].left])
      if (queue[0].right) queue.push(this.#tree[queue[0].right])
      // remove first element (FIFO)
      queue.splice(0, 1)
    }
    if (func) {
      // pass node in result to function parameter
      for (let i = 0; i < result.length; i++) {
        const address = this.#tree.indexOf(result[i])
        const node = this.#tree[address]
        func(node)
      }
    } else {
      // return array of value
      for (let i = 0; i < result.length; i++) {
        result[i] = result[i].value
      }
      return result
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

// code below is for testing
// still manual, no auto test yet
const arr = []
for (let i = -10; i < 11; i += 2) if (!(i % 2)) arr.push(i)
const data = new Tree(arr)
data.buildTree()
// data.print()
// for (let i = -10; i < 11; i++) if (i % 2) data.insert(i)
// data.print()
// for (let i = -10; i < 11; i++) if (!(i % 3)) data.delete(i)
// data.print()
console.log(data.levelOrder())
data.levelOrder(console.log)
