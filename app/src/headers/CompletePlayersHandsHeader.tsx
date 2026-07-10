import { useTranslation } from 'react-i18next'

export const CompletePlayersHandsHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.complete-players-hands')}</>
}
