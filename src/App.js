import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Helmet from 'react-helmet'
import ScrollToTop from './components/scroll_top'
import Meta from './components/Meta'
import TopicLandingPage from './views/topic_landing_page'
import ChapterLandingPage from './views/chapter_landing_page'
import NoMatch from './views/NoMatch'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ServiceWorkerNotifications from './components/ServiceWorkerNotifications'
import data from './data.json'
import { slugify } from './util/url'
// const dotenv = require('dotenv')
// const result = dotenv.config()
// console.log(result)

// console.log(process.env)
const CURRENT_TENANT = 'my-tenant'
// const { CURRENT_TENANT } = process.env

const DEFAULT_TOPIC = 'life-insurance'

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
      socialMediaCard,
      headerScripts,
    } = globalSettings

    const currentTenant = this.getDocument('tenants', 'name', CURRENT_TENANT)
    const topics = this.getDocuments('topics')
    const defaultTopic = this.getDocument('topics', 'name', DEFAULT_TOPIC)
    return (
      <Router>
        <div className="React-Wrap">
          <ScrollToTop />
          <ServiceWorkerNotifications reloadOnUpdate />
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
              tenant={currentTenant}
              topic={defaultTopic}
              getDocument={this.getDocument}
            />
            {topics.map(topic => {
              const path = slugify(`/${topic.title}`)
              return (
                <Fragment key={path}>
                  <RouteWithMeta
                    key={path}
                    path={path}
                    exact
                    component={TopicLandingPage}
                    tenant={currentTenant}
                    topic={this.getDocument('topics', 'name', topic.name)}
                    getDocument={this.getDocument}
                  />
                  {topic.chapters.map(({ chapter: c }) => {
                    const chapter = this.getDocument('chapters', 'uid', c)
                    if (!chapter) {
                      return null
                    }
                    const chapterPath = slugify(
                      `/${topic.title}/${chapter.title}`
                    )
                    const chapterRouteProps = {
                      key: chapterPath,
                      path: chapterPath,
                      component: ChapterLandingPage,
                      tenant: currentTenant,
                      topic: topic,
                      chapter: chapter,
                      getDocument: this.getDocument,
                      selectedModule: null,
                    }
                    return (
                      // todo: Might be better to not make route module
                      // and add logic for parsing module
                      // based on url within the chapter component
                      <Fragment key={chapterPath}>
                        <RouteWithMeta {...chapterRouteProps} exact />
                        {chapter.modules.map(({ module: m }) => {
                          const mod = this.getDocument('modules', 'uid', m)
                          if (!mod) {
                            return null
                          }
                          const modPath = slugify(
                            `/${topic.title}/${chapter.title}/${mod.title}`
                          )
                          return (
                            <RouteWithMeta
                              {...chapterRouteProps}
                              key={modPath}
                              path={modPath}
                              selectedModule={mod}
                              exact
                            />
                          )
                        })}
                      </Fragment>
                    )
                  })}
                </Fragment>
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
