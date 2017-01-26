'use strict'

const React = require('react')
const { PropTypes } = React
const { connect } = require('react-redux')
const { Field } = require('./field')
const { get } = require('../../common/util')


const Fields = (props) => {
  const { template, editing } = props

  return (
    <ol className="metadata-fields">{
      template.map(({ property }) =>
        <Field {...props}
          key={property.uri}
          property={property}
          isEditing={editing === property.uri}/>
      )
    }</ol>
  )
}

Fields.propTypes = {
  editing: PropTypes.string,
  isDisabled: PropTypes.bool,
  template: PropTypes.arrayOf(PropTypes.shape({
    property: PropTypes.object.isRequired
  })).isRequired,
  id: PropTypes.number.isRequired,
  data: PropTypes.object,
  onEdit: PropTypes.func,
  onEditCancel: PropTypes.func,
  onMetadataSave: PropTypes.func,
  onContextMenu: PropTypes.func
}


module.exports = {
  Fields: connect(
    (state, { id }) => ({
      data: state.metadata[id] || {},
      editing: get(state, `ui.edit.field.${id}`)
    })
  )(Fields)
}
