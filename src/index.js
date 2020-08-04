/* global token, ui, actor, game */
import get from 'lodash/get'

import { hasClass } from './utils/actor'
import { martialArtsDie } from './utils/classes/monk'
import { spend } from './utils/actor/resource'

const toggleMacro = true
const breathingTechniquesMacroName = 'Breathing Techniques'
const breathingTechniquesTokenIconPath = 'modules/game-icons-net/whitetransparent/cross-flare.svg'
const breathingTechniquesMacroOffIconPath = null // '../icons/svg/breathing_techniques_off.svg'

function zoroasterData(actor) {
  const classObject = hasClass(actor, ['mnk', 'Monk'], ['Way of the Zoroaster'])
  if (!classObject) return ui.notifications.error('Select a <b>Way of the Zoroaster Monk</b> token')

  const breathingTechniquesFeat = actor.items.find((i) => i.name === 'Breathing Techniques')
  if (!breathingTechniquesFeat) return ui.notifications.error('Could not find a <b>Breathing Techniques</b> feat.')

  const isMaster = get(breathingTechniquesFeat, 'data.data.flags.obsidian.effects', []).find((e) => get(e, 'name') === 'Master') !== undefined

  return {
    master: isMaster,
    items: {
      breathingTechniques: breathingTechniquesFeat,
      monk: classObject,
    },
  }
}

function main() {
  if (token) {
    const {
      master,
      items: { breathingTechniques },
    } = zoroasterData(actor) || {}

    if (master) return ui.notifications.error('Breathing Techniques not implemented for <b>masters</b>.')

    const active = get(breathingTechniques, 'data.flags.zoroasterMacro.active', false)
    const die = martialArtsDie(actor)

    console.log('ACTIVE', active)

    const carryingCapacity = '???' // TODO: How to to this?

    if (!active) {
      // ACTIVATE breathing state
      const hadKiPoints = spend(actor, 'Ki Points', { preventNegativeResource: true })
      if (!hadKiPoints) return ui.notifications.warn('No <b>Ki Points</b> left.')

      const oldStrengthValue = get(actor, 'data.data.abilities.str.value')

      const O_oldACBase = get(actor, 'data.flags.obsidian.attributes.ac.base', 10)
      const O_ACMod1 = get(actor.data, `data.abilities.${get(actor.data, 'flags.obsidian.attributes.ac.ability1')}.mod`, 0)
      const O_ACMod2 = get(actor.data, `data.abilities.${get(actor.data, 'flags.obsidian.attributes.ac.ability2')}.mod`, 0)

      breathingTechniques.update({
        'flags.zoroasterMacro.active': true,
        'flags.zoroasterMacro.oldStrengthValue': oldStrengthValue,
        'flags.zoroasterMacro.oldACBase': O_oldACBase,
      })

      actor.update({
        'data.abilities.str.value': oldStrengthValue + die,
        'data.attributes.ac.value': O_oldACBase + O_ACMod1 + O_ACMod2 + 1,
        'flags.obsidian.attributes.ac.base': O_oldACBase + 1,
      })
    } else {
      // DEACTIVATE breathing state
      const oldStrengthValue = get(breathingTechniques, 'data.flags.zoroasterMacro.oldStrengthValue')

      const O_oldACBase = get(breathingTechniques, 'data.flags.zoroasterMacro.oldACBase', 10)
      const O_ACMod1 = get(actor.data, `data.abilities.${get(actor.data, 'flags.obsidian.attributes.ac.ability1')}.mod`, 0)
      const O_ACMod2 = get(actor.data, `data.abilities.${get(actor.data, 'flags.obsidian.attributes.ac.ability2')}.mod`, 0)

      breathingTechniques.update({ 'flags.zoroasterMacro': null })

      actor.update({
        'data.abilities.str.value': oldStrengthValue,
        'data.attributes.ac.value': O_oldACBase + O_ACMod1 + O_ACMod2,
        'flags.obsidian.attributes.ac.base': O_oldACBase,
      })
    }

    // toogle token ICON
    token.toggleEffect(breathingTechniquesTokenIconPath).then((toggleResult) => {
      if (toggleResult === active) token.toggleEffect(breathingTechniquesTokenIconPath)
    })

    if (!toggleMacro) return

    //toggle macro icon and name, if macro name is correct and stop rage icon path is defined
    let breathingTecniquesMacro = game.macros.getName(breathingTechniquesMacroName)

    //check for name of macro in its "off" form
    if (breathingTecniquesMacro === null || breathingTecniquesMacro === undefined) {
      breathingTecniquesMacro = game.macros.getName(`${breathingTechniquesMacroName} (Deactivate)`)
    }

    if (breathingTecniquesMacro === null || breathingTecniquesMacro === undefined)
      return ui.notifications.warn(`"<b>${breathingTechniquesMacroName}</b>" macro not found.`)

    breathingTecniquesMacro.update({
      name: active ? breathingTechniquesMacroName : `${breathingTechniquesMacroName} (Deactivate)`,
    })
  }
}

main()
