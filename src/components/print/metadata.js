'use strict'

const React = require('react')
const cx = require('classnames')
const { FormattedMessage } = require('react-intl')
const { auto } = require('../../format')
const { TYPE } = require('../../constants')

const {
  arrayOf,
  bool,
  object,
  node,
  string
} = require('prop-types')


const MetadataField = ({ isExtra, label, text, type }) => (
  <li className={cx('metadata-field', { extra: isExtra })}>
    <label>{label}</label>
    <div className="value">{auto(text, type)}</div>
  </li>
)

MetadataField.propTypes = {
  isExtra: bool,
  label: node.isRequired,
  text: string,
  type: string.isRequired
}

const MetadataSection = ({ fields, title, tags }) => (
  <section>
    <h5 className="metadata-heading">
      <FormattedMessage id={title}/>
    </h5>
    <ol className="metadata-fields">
      {fields.map(f =>
        <MetadataField
          key={f.property.id}
          isExtra={f.isExtra}
          label={f.label || f.property.label}
          text={f.value.text}
          type={f.value.type || f.type}/>)}
      {tags && tags.length > 0 &&
        <MetadataField
          label={<FormattedMessage id="print.tags"/>}
          text={tags.join(', ')}
          type={TYPE.TEXT}/>}
    </ol>
  </section>
)

MetadataSection.propTypes = {
  fields: arrayOf(object),
  tags: arrayOf(string),
  title: string.isRequired
}

module.exports = {
  MetadataField,
  MetadataSection
}
