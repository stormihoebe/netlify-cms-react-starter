import React from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { slugify } from '../util/url'

export default ({ tenant, topic, getDocument }) => {
  const { logo, color } = tenant
  const { chapters, title, description, image } = topic
  return (
    <div>
      TenantLogo: {logo}
      <PageHeader
        title={title}
        subtitle={description}
        backgroundImage={image}
      />
      <h1>{color}</h1>
      CHAPTERS
      {chapters.map(({ chapter: c }) => {
        const chapter = getDocument('chapters', 'title', c)
        return (
          <Link key={chapter.title} to={slugify(`/${title}/${chapter.title}/`)}>
            <div>{chapter.title}</div>
          </Link>
        )
      })}
    </div>
  )
}
