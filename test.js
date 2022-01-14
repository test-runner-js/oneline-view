import OnelineView from '@test-runner/oneline-view'
import Tom from '@test-runner/tom'

const view = new OnelineView({ viewShowStarts: true })

{ /* main report */
  async function start () {
    await view.init()
    console.log('Main report:')
    view.start(10)
    const root = new Tom('root')
    const parent = root.group('parent')
    const test = parent.test('main test 1', () => 1)
    await test.run()
    view.testStart(test)
    view.testSkip(test)
    const test2 = parent.test('main test 2', () => 2)
    await test2.run()
    view.testPass(test2)
    const test3 = parent.test('main test 3', () => { throw new Error('broken') })
    try {
      await test3.run()
    } catch (err) {
      view.testFail(test3, err)
    }

    const todo = parent.todo('main: a todo')
    view.testTodo(todo)
  }

  start().catch(console.error)
}

{ /* no root group, context data: pass */
  async function start () {
    await view.init()
    const test = new Tom('test 1', function () {
      this.data = {
        something: 'one',
        yeah: true
      }
    })
    await test.run()
    view.testPass(test)
  }

  start().catch(console.error)
}

{ /* no root group, context data: fail */
  async function start () {
    await view.init()
    const test = new Tom('context data: fail', function () {
      this.data = {
        something: 'one',
        yeah: true
      }
      throw new Error('broken')
    })
    try {
      await test.run()
    } catch (err) {
      view.testFail(test, err)
    }
  }

  start().catch(console.error)
}

{ /* deep tree, multiple parents: pass and fail */
  async function start () {
    await view.init()
    const tom = new Tom('root')
    const level1 = tom.group('level 1')
    const level2 = level1.group('level 2')
    const test = level2.test('deep tree', function () {})
    const test2 = level2.test('deep tree fail', function () {
      throw new Error('broken')
    })

    await test.run()
    view.testPass(test)

    try {
      await test2.run()
    } catch (err) {
      view.testFail(test2, err)
    }
  }

  start().catch(console.error)
}

console.log('Footer: pass colour')
view.end({
  start: 10000,
  end: 20000,
  pass: 10,
  fail: 0,
  skip: 0,
  ignore: 0,
  timeElapsed: function () {
    return this.end - this.start
  }
})

console.log('Footer: fail colour')
view.end({
  start: 10000,
  end: 20000,
  pass: 0,
  fail: 10,
  skip: 0,
  ignore: 0,
  timeElapsed: function () {
    return this.end - this.start
  }
})

console.log('Footer: skip colour')
view.end({
  start: 10000,
  end: 20000,
  pass: 0,
  fail: 0,
  skip: 10,
  ignore: 0,
  timeElapsed: function () {
    return this.end - this.start
  }
})
