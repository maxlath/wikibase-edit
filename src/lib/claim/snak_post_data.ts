import { newError } from '../error.js'
import datatypesToBuilderDatatypes from '../properties/datatypes_to_builder_datatypes.js'
import { singleClaimBuilders as builders } from './builders.js'
import { hasSpecialSnaktype } from './special_snaktype.js'

export default params => {
  const { action, data, datatype, value, instance } = params

  if (!datatype) throw newError('missing datatype', params)

  if (hasSpecialSnaktype(value)) {
    data.snaktype = value.snaktype
  } else {
    data.snaktype = 'value'
    const builderDatatype = datatypesToBuilderDatatypes(datatype) || datatype
    data.value = builders[builderDatatype](value, instance)
  }

  return { action, data }
}
