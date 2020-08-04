/* global */

import { hasClass } from '../actor'

export function martialArtsDie(actor) {
  const monk = hasClass(actor, ['mnk', 'Monk'])
  if (!monk) return false

  return {
    1: 4,
    2: 4,
    3: 4,
    4: 4,
    5: 6,
    6: 6,
    7: 6,
    8: 6,
    9: 6,
    10: 6,
    11: 8,
    12: 8,
    13: 8,
    14: 8,
    15: 8,
    16: 8,
    17: 8,
    18: 10,
    19: 10,
    20: 10,
  }[monk.data.data.levels]
}
