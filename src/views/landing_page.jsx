import React from 'react'
import PageHeader from '../components/PageHeader'

export default ({ fields }) => {
  const { title, description, headerImage, color } = fields
  return (
    <div className="About">
      <PageHeader
        title={title}
        subtitle={description}
        backgroundImage={headerImage}
      />
      <h1>{color}</h1>
    </div>
  )
}
