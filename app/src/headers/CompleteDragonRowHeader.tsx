import { useTranslation } from 'react-i18next'

export const CompleteDragonRowHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.complete-dragon-row')}</>
}
