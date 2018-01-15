import indexOf from 'lodash/indexOf'
import forEach from 'lodash/forEach'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import angular from 'angular'

class TransitionEnd {
  constructor (element) {
    this.element = element
    this.transitionEnd = this.whichTransitionEnd()
    this.callbacks = []
  }

  whichTransitionEnd () {
    let transitions = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd otransitionend',
      'transition': 'transitionend'
    }

    for (let t in transitions) {
      if (this.element.style[t] !== undefined) {
        return transitions[t]
      }
    }
  }

  one (callback, duration) {
    this.callbacks.push(callback)

    let $element = angular.element(this.element)

    $element
      .one(this.transitionEnd, callback)
      .one(this.transitionEnd, () => {
        this.tid && clearTimeout(this.tid)
      })

    if (duration > 0) {
      this.tid = setTimeout(() => $element.triggerHandler(this.transitionEnd), duration)
    }
  }

  on (callback) {
    this.callbacks.push(callback)
    angular.element(this.element).on(this.transitionEnd, callback)
  }

  off (callback) {
    let index = indexOf(this.callbacks, callback)
    index !== -1 && this.callbacks.splice(index, 1)
    angular.element(this.element).off(this.transitionEnd, callback)
  }

  removeAllListeners () {
    forEach(this.callbacks, (callback) => {
      angular.element(this.element).off(this.transitionEnd, callback)
    })

    this.callbacks.splice(0)
  }
}

const Cache = {
  list: [],
  getPosition (element) {
    return indexOf(this.list, element)
  },
  insert (element) {
    let positonElement = this.getPosition(element)

    if (positonElement === -1) {
      let instance = new TransitionEnd(element)

      this.list.push(element)
      this.list.push(instance)

      return instance
    }

    return this.list[positonElement + 1]
  },
  remove (element) {
    let positonElement = this.getPosition(element)

    if (positonElement !== -1) {
      // eslint-disable-next-line no-unused-vars
      let [_, instance] = this.list.splice(positonElement, 2)
      instance.removeAllListeners()
    }
  }
}

export default function (element, callback, duration) {
  if (!element) {
    throw new TypeError('You need to pass an element as parameter')
  }

  element = element instanceof angular.element || isArray(element) || element.length ? element[0] : element

  let instance = Cache.insert(element)
  isFunction(callback) && instance.one(callback, duration)

  instance.remove = function () {
    return Cache.remove(element)
  }

  return instance
}
