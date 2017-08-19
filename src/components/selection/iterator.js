'use strict'

const React = require('react')
const { Iterator } = require('../iterator')
const { DropTarget } = require('react-dnd')
const { arrayOf, bool, func, number, shape, string } = require('prop-types')
const { DND } = require('../../constants')
const { move } = require('../../common/util')


class SelectionIterator extends Iterator {
  get iteration() { return this.props.selections }

  get classes() {
    return {
      'drop-target': this.isSortable,
      'over': this.props.isOver,
      'selection': true,
      [this.orientation]: true
    }
  }

  get isSortable() {
    return !this.props.isDisabled && this.size > 1
  }

  isActive(selection) {
    return this.props.active === selection
  }

  handleDropSelection = ({ id, to, offset }) => {
    const { onSort, photo } = this.props
    const order = move(photo.selections, id, to, offset)
    onSort({ photo: photo.id, selections: order })
  }

  connect(element) {
    return this.isSortable ? this.props.dropTarget(element) : element
  }

  map(fn) {
    this.idx = {}
    const { isSortable, isVertical } = this

    return this.props.selections.map((selection, index) => {
      this.idx[selection] = index

      return fn({
        selection,
        cache: this.props.cache,
        getAdjacent: this.getAdjacent,
        isActive: this.isActive(selection.id),
        isDisabled: this.props.isDisabled,
        isLast: index === this.props.selections.length - 1,
        isSortable,
        isVertical,
        photo: this.props.photo,
        onContextMenu: this.props.onContextMenu,
        onDropSelection: this.handleDropSelection,
        onItemOpen: this.props.onItemOpen,
        onSelect: this.props.onSelect
      })
    })
  }

  static propTypes = {
    active: number,
    dropTarget: func,
    isDisabled: bool.isRequired,
    isOver: bool,
    photo: shape({
      id: number.isRequired
    }).isRequired,
    selections: arrayOf(shape({
      id: number.isRequired
    })).isRequired,
    cache: string.isRequired,
    size: number.isRequired,
    onContextMenu: func.isRequired,
    onItemOpen: func.isRequired,
    onSelect: func.isRequired,
    onSort: func.isRequired
  }

  static asDropTarget() {
    return DropTarget(DND.SELECTION, DropTargetSpec, DropTargetCollect)(this)
  }
}


const DropTargetSpec = {
  drop({ photo }, monitor) {
    if (monitor.didDrop()) return

    const { id } = monitor.getItem()
    const { selections } = photo
    const to = selections[selections.length - 1]

    if (id !== to) {
      return { id, to, offset: 1 }
    }
  }
}

const DropTargetCollect = (connect, monitor) => ({
  dropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true })
})


module.exports = {
  SelectionIterator
}