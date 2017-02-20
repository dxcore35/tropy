'use strict'

const React = require('react')
const { ItemIterable } = require('./iterable')
const { CoverImage } = require('./cover-image')
const { createClickHandler } = require('../util')
const cx = require('classnames')
const { bool, number } = React.PropTypes


class ItemTile extends ItemIterable {
  get classes() {
    return {
      ...super.classes,
      'tile': true,
      'click-catcher': true,
      'small': this.props.isSmall
    }
  }

  handleMouseDown = createClickHandler({
    onClick: this.handleSelect,
    onDoubleClick: this.handleOpen
  })

  render() {
    const { item, cache, size } = this.props

    return this.connect(
      <li
        ref={this.setContainer}
        className={cx(this.classes)}>
        <div className="tile-state">
          <CoverImage
            cache={cache}
            item={item}
            size={size}
            onMouseDown={this.handleMouseDown}
            onContextMenu={this.handleContextMenu}/>
        </div>
      </li>
    )
  }

  static propTypes = {
    ...ItemIterable.propTypes,
    isSmall: bool,
    size: number.isRequired
  }

  static defaultProps = {
    ...ItemIterable.defaultProps,
    size: 512
  }
}

module.exports = {
  ItemTile: ItemTile.wrap()
}
