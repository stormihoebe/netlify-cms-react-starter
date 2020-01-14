import React from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { slugify } from '../util/url'

export default ({
  tenant: { logo },
  chapter,
  getDocument,
  selectedModule,
  topic,
}) => {
  const { title, description, image, modules } = chapter
  return (
    <div>
      tenantLogo: {logo}
      <PageHeader
        title={title}
        subtitle={description}
        backgroundImage={image}
      />
      CURRENTLY SELECTED MODULE:
      {selectedModule ? (
        <Link to={slugify(`/${topic.title}/${title}/`)}>
          <div>{selectedModule.title}: Click to close module</div>
        </Link>
      ) : (
        'NO MODULE SELECTED'
      )}
      <h1>Available MODULES:</h1>
      {modules &&
        modules.map(({ module: m }) => {
          const mod = getDocument('modules', 'uid', m)

          return (
            <Link
              key={mod.title}
              to={slugify(`/${topic.title}/${title}/${mod.title}`)}
            >
              <div>{mod.title}</div>
            </Link>
          )
        })}
    </div>
  )
}
