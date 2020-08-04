import get from 'lodash/get'

export default function hasClass(actor, classes, subclasses) {
  return actor.items.find(
    (i) =>
      i.type === 'class' &&
      classes.includes(i.name) &&
      (!subclasses || subclasses.includes(get(i, 'data.data.subclass')))
  )
}
