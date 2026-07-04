import { DragonBombOptionsSpec } from '@gamepark/dragon-bomb/DragonBombOptions'
import { DragonBombRules } from '@gamepark/dragon-bomb/DragonBombRules'
import { DragonBombSetup } from '@gamepark/dragon-bomb/DragonBombSetup'
import { GameProvider } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="dragon-bomb"
      Rules={DragonBombRules}
      optionsSpec={DragonBombOptionsSpec}
      GameSetup={DragonBombSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
