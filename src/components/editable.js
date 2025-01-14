'use strict'

const React = require('react')
const { bool, func, number, oneOfType, string } = require('prop-types')
const { Input } = require('./input')
const { noop } = require('../common/util')
const cx = require('classnames')


class Editable extends React.PureComponent {
  componentWillUnmount() {
    this.prevFocus = null
  }

  get classes() {
    return ['editable', {
      active: this.isActive,
      disabled: this.props.isDisabled
    }]
  }

  get content() {
    return this.props.display || this.props.value
  }

  get isActive() {
    return this.props.isActive && !this.props.isDisabled
  }

  setInput = (input) => {
    this.input = input
  }

  focus = () => {
    if (this.input != null) this.input.focus()
  }

  handleBlur = (event) => {
    try {
      if (this.props.onBlur) {
        return this.props.onBlur(event)
      }
    } finally {
      this.restorePrevFocus()
    }
  }

  handleFocus = (event) => {
    this.prevFocus = event.relatedTarget
    if (this.props.onFocus) {
      return this.props.onFocus(event)
    }
  }

  handleCancel = (...args) => {
    try {
      if (this.props.onCancel) {
        return this.props.onCancel(...args)
      }
    } finally {
      this.restorePrevFocus()
    }
  }

  handleCommit = (value, hasChanged) => {
    try {
      if (hasChanged) {
        this.props.onChange(value)
      } else {
        this.props.onCancel(false, hasChanged)
      }
    } finally {
      this.restorePrevFocus()
    }
  }

  restorePrevFocus() {
    if (this.prevFocus != null) {
      this.prevFocus.focus()
      this.prevFocus = null
    }
  }

  renderContent() {
    return (
      <div className="truncate" title={this.props.title}>
        {this.content}
      </div>
    )
  }

  renderInput() {
    return (
      <Input
        ref={this.setInput}
        autofocus={this.props.autofocus}
        autoselect={this.props.autoselect}
        className="editable-control"
        completions={this.props.getCompletions(window.state)}
        isRequired={this.props.isRequired}
        placeholder={this.props.placeholder}
        tabIndex={this.props.tabIndex}
        type={this.props.type}
        resize={this.props.resize}
        value={this.props.value || ''}
        onBlur={this.handleBlur}
        onCancel={this.handleCancel}
        onCommit={this.handleCommit}
        onFocus={this.handleFocus}
        onKeyDown={this.props.onKeyDown}/>
    )
  }

  render() {
    return (
      <div className={cx(this.classes)}>
        {this.isActive ?
          this.renderInput() :
          this.renderContent()}
      </div>
    )
  }

  static propTypes = {
    autofocus: bool,
    autoselect: bool,
    getCompletions: func.isRequired,
    display: string,
    isActive: bool,
    isDisabled: bool,
    isRequired: bool,
    placeholder: string,
    resize: bool,
    tabIndex: number,
    title: string,
    type: string,
    value: oneOfType([string, number]),
    onBlur: func,
    onCancel: func.isRequired,
    onChange: func.isRequired,
    onFocus: func,
    onKeyDown: func
  }

  static defaultProps = {
    autofocus: true,
    autoselect: true,
    getCompletions: noop,
    onCancel: noop
  }
}

module.exports = {
  Editable
}
