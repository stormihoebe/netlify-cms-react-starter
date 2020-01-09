import React from 'react'
import PageHeader from '../components/PageHeader'

export default ({ tenant: { logo }, chapter, getDocument }) => {
  const { title, description, image, modules } = chapter
  return (
    <div className="About">
      tenantLogo: {logo}
      <PageHeader
        title={title}
        subtitle={description}
        backgroundImage={image}
      />
      MODULES:
      {modules.map(({ module: m }) => {
        const mod = getDocument('modules', 'title', m)
        return <div key={mod.title}>{mod.title}</div>
      })}
    </div>
  )
}
