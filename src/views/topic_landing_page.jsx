import React from 'react'
import PageHeader from '../components/PageHeader'

export default ({ tenant, topic, getDocument }) => {
  const { logo, color } = tenant
  const { chapters, title, description, image } = topic
  debugger
  return (
    <div className="About">
      TenantLogo: {logo}
      <PageHeader title={title} subtitle={description} backgroundImage={image} />
      <h1>{color}</h1>
      CHAPTERS
      {chapters.map(({ chapter: c }) => {
        const chapter = getDocument('chapters', 'title', c)
        return <div key={chapter.title}>{chapter.title}</div>
      })}
    </div>
  )
}
