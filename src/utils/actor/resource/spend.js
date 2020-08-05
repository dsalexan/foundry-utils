/* global duplicate */

export default function spend(actor, resourceName, { value = 1, preventNegativeResource = false }) {
  let hasAvailableResource = false

  // Look for Resources under the Core macroActor data
  let resourceKey = Object.keys(actor.data.data.resources)
    .filter((k) => actor.data.data.resources[k].label === `${resourceName}`)
    .shift()

  if (resourceKey && (actor.data.data.resources[resourceKey].value - value >= 0 || !preventNegativeResource)) {
    hasAvailableResource = true
    actor.update({
      [`data.resources.${resourceKey}.value`]: actor.data.data.resources[resourceKey].value - value,
    })
  }

  return [hasAvailableResource, actor.data.data.resources[resourceKey]]
}
