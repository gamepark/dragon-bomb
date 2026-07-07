import { FirecrackerCard } from '@gamepark/dragon-bomb/material/FirecrackerCard'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { CardDescription } from '@gamepark/react-game'
import back from '../images/cards/firecracker/FirecrackerBack.jpg'
import doubleFirecracker1 from '../images/cards/firecracker/DoubleFirecracker_1.jpg'
import doubleFirecracker2 from '../images/cards/firecracker/DoubleFirecracker_2.jpg'
import doubleFirecracker3 from '../images/cards/firecracker/DoubleFirecracker_3.jpg'
import doubleFirecracker4 from '../images/cards/firecracker/DoubleFirecracker_4.jpg'
import doubleFirecracker5 from '../images/cards/firecracker/DoubleFirecracker_5.jpg'
import firecracker5_1 from '../images/cards/firecracker/Firecracker5_1.jpg'
import firecracker5_2 from '../images/cards/firecracker/Firecracker5_2.jpg'
import firecracker5_3 from '../images/cards/firecracker/Firecracker5_3.jpg'
import firecracker5_4 from '../images/cards/firecracker/Firecracker5_4.jpg'
import firecracker5_5 from '../images/cards/firecracker/Firecracker5_5.jpg'
import firecracker6_1 from '../images/cards/firecracker/Firecracker6_1.jpg'
import firecracker6_2 from '../images/cards/firecracker/Firecracker6_2.jpg'
import firecracker6_3 from '../images/cards/firecracker/Firecracker6_3.jpg'
import firecracker6_4 from '../images/cards/firecracker/Firecracker6_4.jpg'
import firecracker6_5 from '../images/cards/firecracker/Firecracker6_5.jpg'
import firecracker7_1 from '../images/cards/firecracker/Firecracker7_1.jpg'
import firecracker7_2 from '../images/cards/firecracker/Firecracker7_2.jpg'
import firecracker7_3 from '../images/cards/firecracker/Firecracker7_3.jpg'
import firecracker7_4 from '../images/cards/firecracker/Firecracker7_4.jpg'
import firecracker7_5 from '../images/cards/firecracker/Firecracker7_5.jpg'
import firecracker8_1 from '../images/cards/firecracker/Firecracker8_1.jpg'
import firecracker8_2 from '../images/cards/firecracker/Firecracker8_2.jpg'
import firecracker8_3 from '../images/cards/firecracker/Firecracker8_3.jpg'
import firecracker8_4 from '../images/cards/firecracker/Firecracker8_4.jpg'
import firecracker8_5 from '../images/cards/firecracker/Firecracker8_5.jpg'
import firecracker9_1 from '../images/cards/firecracker/Firecracker9_1.jpg'
import firecracker9_2 from '../images/cards/firecracker/Firecracker9_2.jpg'
import firecracker9_3 from '../images/cards/firecracker/Firecracker9_3.jpg'
import firecracker9_4 from '../images/cards/firecracker/Firecracker9_4.jpg'
import firecracker9_5 from '../images/cards/firecracker/Firecracker9_5.jpg'
import firecracker10_1 from '../images/cards/firecracker/Firecracker10_1.jpg'
import firecracker10_2 from '../images/cards/firecracker/Firecracker10_2.jpg'
import firecracker10_3 from '../images/cards/firecracker/Firecracker10_3.jpg'
import firecracker10_4 from '../images/cards/firecracker/Firecracker10_4.jpg'
import firecracker10_5 from '../images/cards/firecracker/Firecracker10_5.jpg'
import rocket1 from '../images/cards/firecracker/Rocket_1.jpg'
import rocket2 from '../images/cards/firecracker/Rocket_2.jpg'
import rocket3 from '../images/cards/firecracker/Rocket_3.jpg'
import rocket4 from '../images/cards/firecracker/Rocket_4.jpg'
import rocket5 from '../images/cards/firecracker/Rocket_5.jpg'
import stringOfFirecrackers1 from '../images/cards/firecracker/StringOfFirecrackers_1.jpg'
import stringOfFirecrackers2 from '../images/cards/firecracker/StringOfFirecrackers_2.jpg'
import stringOfFirecrackers3 from '../images/cards/firecracker/StringOfFirecrackers_3.jpg'
import stringOfFirecrackers4 from '../images/cards/firecracker/StringOfFirecrackers_4.jpg'
import stringOfFirecrackers5 from '../images/cards/firecracker/StringOfFirecrackers_5.jpg'
import { FirecrackerCardHelp } from './help/FirecrackerCardHelp'

class FirecrackerCardDescription extends CardDescription<number, MaterialType, number, FirecrackerCard> {
  width = 6.3
  height = 8.8
  borderRadius = 0.3
  help = FirecrackerCardHelp

  images = {
    [FirecrackerCard.Firecracker5_1]: firecracker5_1,
    [FirecrackerCard.Firecracker5_2]: firecracker5_2,
    [FirecrackerCard.Firecracker5_3]: firecracker5_3,
    [FirecrackerCard.Firecracker5_4]: firecracker5_4,
    [FirecrackerCard.Firecracker5_5]: firecracker5_5,
    [FirecrackerCard.Firecracker6_1]: firecracker6_1,
    [FirecrackerCard.Firecracker6_2]: firecracker6_2,
    [FirecrackerCard.Firecracker6_3]: firecracker6_3,
    [FirecrackerCard.Firecracker6_4]: firecracker6_4,
    [FirecrackerCard.Firecracker6_5]: firecracker6_5,
    [FirecrackerCard.Firecracker7_1]: firecracker7_1,
    [FirecrackerCard.Firecracker7_2]: firecracker7_2,
    [FirecrackerCard.Firecracker7_3]: firecracker7_3,
    [FirecrackerCard.Firecracker7_4]: firecracker7_4,
    [FirecrackerCard.Firecracker7_5]: firecracker7_5,
    [FirecrackerCard.Firecracker8_1]: firecracker8_1,
    [FirecrackerCard.Firecracker8_2]: firecracker8_2,
    [FirecrackerCard.Firecracker8_3]: firecracker8_3,
    [FirecrackerCard.Firecracker8_4]: firecracker8_4,
    [FirecrackerCard.Firecracker8_5]: firecracker8_5,
    [FirecrackerCard.Firecracker9_1]: firecracker9_1,
    [FirecrackerCard.Firecracker9_2]: firecracker9_2,
    [FirecrackerCard.Firecracker9_3]: firecracker9_3,
    [FirecrackerCard.Firecracker9_4]: firecracker9_4,
    [FirecrackerCard.Firecracker9_5]: firecracker9_5,
    [FirecrackerCard.Firecracker10_1]: firecracker10_1,
    [FirecrackerCard.Firecracker10_2]: firecracker10_2,
    [FirecrackerCard.Firecracker10_3]: firecracker10_3,
    [FirecrackerCard.Firecracker10_4]: firecracker10_4,
    [FirecrackerCard.Firecracker10_5]: firecracker10_5,
    [FirecrackerCard.StringOfFirecrackers_1]: stringOfFirecrackers1,
    [FirecrackerCard.StringOfFirecrackers_2]: stringOfFirecrackers2,
    [FirecrackerCard.StringOfFirecrackers_3]: stringOfFirecrackers3,
    [FirecrackerCard.StringOfFirecrackers_4]: stringOfFirecrackers4,
    [FirecrackerCard.StringOfFirecrackers_5]: stringOfFirecrackers5,
    [FirecrackerCard.Rocket_1]: rocket1,
    [FirecrackerCard.Rocket_2]: rocket2,
    [FirecrackerCard.Rocket_3]: rocket3,
    [FirecrackerCard.Rocket_4]: rocket4,
    [FirecrackerCard.Rocket_5]: rocket5,
    [FirecrackerCard.DoubleFirecracker_1]: doubleFirecracker1,
    [FirecrackerCard.DoubleFirecracker_2]: doubleFirecracker2,
    [FirecrackerCard.DoubleFirecracker_3]: doubleFirecracker3,
    [FirecrackerCard.DoubleFirecracker_4]: doubleFirecracker4,
    [FirecrackerCard.DoubleFirecracker_5]: doubleFirecracker5
  }

  backImage = back
}

export const firecrackerCardDescription = new FirecrackerCardDescription()
