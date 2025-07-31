function getYears(forumConfig, stage) {
  if (!forumConfig) return
  const yearsDefault = forumConfig.filterYear.split(',')
  let year = forumConfig.filterYear.split(',')
  if (stage === 'votacion') year = yearsDefault.slice(-1)
  else if (stage === 'seguimiento') year = yearsDefault.filter(el => el !== yearsDefault.slice(-1)[0])
  return year
}

export default getYears

