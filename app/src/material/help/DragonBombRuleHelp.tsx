import { Trans } from 'react-i18next'

export const DragonBombRuleHelp = () => {
  return (
    <>
      <h2><Trans i18nKey="help.rule.title" /></h2>
      <p><Trans i18nKey="help.rule.intro" /></p>

      <h3><Trans i18nKey="help.rule.step1.title" /></h3>
      <p><Trans i18nKey="help.rule.step1.desc" /></p>

      <h3><Trans i18nKey="help.rule.step2.title" /></h3>
      <p><Trans i18nKey="help.rule.step2.desc1" /></p>
      <p><Trans i18nKey="help.rule.step2.desc2" /></p>

      <h3><Trans i18nKey="help.rule.step3.title" /></h3>
      <p><Trans i18nKey="help.rule.step3.desc" /></p>

      <h3><Trans i18nKey="help.rule.step4.title" /></h3>
      <p><Trans i18nKey="help.rule.step4.desc" /></p>

      <h3><Trans i18nKey="help.rule.end-of-game.title" /></h3>
      <p><Trans i18nKey="help.rule.end-of-game.desc" /></p>

      <h3><Trans i18nKey="help.rule.two-players.title" /></h3>
      <p><Trans i18nKey="help.rule.two-players.desc" /></p>
    </>
  )
}
