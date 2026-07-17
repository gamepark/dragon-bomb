import { DragonCard } from '@gamepark/dragon-bomb/material/DragonCard'
import { MaterialType } from '@gamepark/dragon-bomb/material/MaterialType'
import { CardDescription, MaterialContentProps } from '@gamepark/react-game'
import { DragonCardPowerBadge } from './DragonCardPowerBadge'
import back from '../images/cards/dragon/DragonBack.jpg'
import body3 from '../images/cards/dragon/DragonBody3.jpg'
import body4a from '../images/cards/dragon/DragonBody4a.jpg'
import body4b from '../images/cards/dragon/DragonBody4b.jpg'
import body5 from '../images/cards/dragon/DragonBody5.jpg'
import body11a from '../images/cards/dragon/DragonBody11a.jpg'
import body11b from '../images/cards/dragon/DragonBody11b.jpg'
import body12a from '../images/cards/dragon/DragonBody12a.jpg'
import body12b from '../images/cards/dragon/DragonBody12b.jpg'
import body13 from '../images/cards/dragon/DragonBody13.jpg'
import body15a from '../images/cards/dragon/DragonBody15a.jpg'
import body15b from '../images/cards/dragon/DragonBody15b.jpg'
import body16a from '../images/cards/dragon/DragonBody16a.jpg'
import body16b from '../images/cards/dragon/DragonBody16b.jpg'
import body17a from '../images/cards/dragon/DragonBody17a.jpg'
import body17b from '../images/cards/dragon/DragonBody17b.jpg'
import body18a from '../images/cards/dragon/DragonBody18a.jpg'
import body18b from '../images/cards/dragon/DragonBody18b.jpg'
import body23 from '../images/cards/dragon/DragonBody23.jpg'
import body25 from '../images/cards/dragon/DragonBody25.jpg'
import head from '../images/cards/dragon/DragonHead.jpg'
import tail from '../images/cards/dragon/DragonTail.jpg'
import { DragonCardHelp } from './help/DragonCardHelp'

class DragonCardDescription extends CardDescription<number, MaterialType, number, DragonCard> {
  width = 6.6
  height = 10
  borderRadius = 0.3
  help = DragonCardHelp

  images = {
    [DragonCard.Tail]: tail,
    [DragonCard.Head]: head,
    [DragonCard.Body3]: body3,
    [DragonCard.Body4a]: body4a,
    [DragonCard.Body4b]: body4b,
    [DragonCard.Body5]: body5,
    [DragonCard.Body11a]: body11a,
    [DragonCard.Body11b]: body11b,
    [DragonCard.Body12a]: body12a,
    [DragonCard.Body12b]: body12b,
    [DragonCard.Body13]: body13,
    [DragonCard.Body15a]: body15a,
    [DragonCard.Body15b]: body15b,
    [DragonCard.Body16a]: body16a,
    [DragonCard.Body16b]: body16b,
    [DragonCard.Body17a]: body17a,
    [DragonCard.Body17b]: body17b,
    [DragonCard.Body18a]: body18a,
    [DragonCard.Body18b]: body18b,
    [DragonCard.Body23]: body23,
    [DragonCard.Body25]: body25
  }

  backImage = back

  content = (props: MaterialContentProps<DragonCard>) =>
    this.contentWithBackChildren({
      ...props,
      children: (
        <>
          {props.children}
          <DragonCardPowerBadge itemIndex={props.itemIndex} />
        </>
      )
    })
}

export const dragonCardDescription = new DragonCardDescription()
