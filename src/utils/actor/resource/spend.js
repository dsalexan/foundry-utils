/* global duplicate */

export default function spend(actor, resourceName, { value = 1, preventNegativeResource = false }) {
  let hasAvailableResource = false
  let newResources = duplicate(actor.data.data.resources)
  let obj = {}

  // Look for Resources under the Core macroActor data
  let resourceKey = Object.keys(actor.data.data.resources)
    .filter((k) => actor.data.data.resources[k].label === `${resourceName}`)
    .shift()

  if (resourceKey && (actor.data.data.resources[resourceKey].value > 0 || !preventNegativeResource)) {
    hasAvailableResource = true
    newResources[resourceKey].value -= value
    obj['data.resources'] = newResources
    actor.update(obj)
  }

  return hasAvailableResource
}
