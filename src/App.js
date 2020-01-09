import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Helmet from 'react-helmet'

import ScrollToTop from './components/ScrollToTop'
import Meta from './components/Meta'
import TopicLandingPage from './views/topic_landing_page'
import Blog from './views/Blog'
import SinglePost from './views/SinglePost'
import NoMatch from './views/NoMatch'
import Nav from './components/Nav'
import Footer from './components/Footer'
import GithubCorner from './components/GithubCorner'
import ServiceWorkerNotifications from './components/ServiceWorkerNotifications'
import data from './data.json'
import { slugify } from './util/url'
import { documentHasTerm, getCollectionTerms } from './util/collection'

const RouteWithMeta = ({ component: Component, ...props }) => (
  <Route
    {...props}
    render={routeProps => (
      <Fragment>
        <Meta {...props} />
        <Component {...routeProps} {...props} />
      </Fragment>
    )}
  />
)

class App extends Component {
  state = {
    data,
  }

  getDocument = (collection, key, value) => {
    return (
      this.state.data[collection] &&
      this.state.data[collection].filter(page => page[key] === value)[0]
    )
  }
  getDocuments = collection => this.state.data[collection] || []

  render() {
    const globalSettings = this.getDocument('settings', 'name', 'global')
    const {
      siteTitle,
      siteUrl,
      siteDescription,
      socialMediaCard,
      headerScripts,
    } = globalSettings

    const posts = this.getDocuments('posts').filter(
      post => post.status !== 'Draft'
    )
    const categoriesFromPosts = getCollectionTerms(posts, 'categories')
    const postCategories = this.getDocuments('postCategories').filter(
      category => categoriesFromPosts.indexOf(category.name.toLowerCase()) >= 0
    )
    const CURRENT_TENANT = 'asdf'
    const DEFAULT_TOPIC = 'life-insurance'
    return (
      <Router>
        <div className="React-Wrap">
          <ScrollToTop />
          <ServiceWorkerNotifications reloadOnUpdate />
          <GithubCorner url="https://github.com/Jinksi/netlify-cms-react-starter" />
          <Helmet
            defaultTitle={siteTitle}
            titleTemplate={`${siteTitle} | %s`}
          />
          <Meta
            headerScripts={headerScripts}
            absoluteImageUrl={
              socialMediaCard &&
              socialMediaCard.image &&
              siteUrl + socialMediaCard.image
            }
            twitterCreatorAccount={
              socialMediaCard && socialMediaCard.twitterCreatorAccount
            }
            twitterSiteAccount={
              socialMediaCard && socialMediaCard.twitterSiteAccount
            }
          />

          <Nav />

          <Switch>
            <RouteWithMeta
              path="/"
              exact
              component={TopicLandingPage}
              tenant={this.getDocument('tenants', 'name', CURRENT_TENANT)}
              topic={this.getDocument('topics', 'name', DEFAULT_TOPIC)}
              getDocument={this.getDocument}
            />
            {this.getDocuments('topics').map(topic => {
              const path = slugify(`/${topic.title}`)
              return (
                <RouteWithMeta
                  key={path}
                  path={path}
                  exact
                  component={TopicLandingPage}
                  tenant={this.getDocument('tenants', 'name', CURRENT_TENANT)}
                  topic={this.getDocument('topics', 'name', topic.name)}
                  getDocument={this.getDocument}
                />
              )
            })}
            <RouteWithMeta
              path="/blog/"
              exact
              component={Blog}
              fields={this.getDocument('pages', 'name', 'blog')}
              posts={posts}
              postCategories={postCategories}
            />
            {posts.map((post, index) => {
              const path = slugify(`/blog/${post.title}`)
              const nextPost = posts[index - 1]
              const prevPost = posts[index + 1]
              return (
                <RouteWithMeta
                  key={path}
                  path={path}
                  exact
                  component={SinglePost}
                  fields={post}
                  nextPostURL={nextPost && slugify(`/blog/${nextPost.title}/`)}
                  prevPostURL={prevPost && slugify(`/blog/${prevPost.title}/`)}
                />
              )
            })}

            {postCategories.map(postCategory => {
              const slug = slugify(postCategory.title)
              const path = slugify(`/blog/category/${slug}`)
              const categoryPosts = posts.filter(post =>
                documentHasTerm(post, 'categories', slug)
              )
              return (
                <RouteWithMeta
                  key={path}
                  path={path}
                  exact
                  component={Blog}
                  fields={this.getDocument('pages', 'name', 'blog')}
                  posts={categoryPosts}
                  postCategories={postCategories}
                />
              )
            })}

            <Route render={() => <NoMatch siteUrl={siteUrl} />} />
          </Switch>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default App
