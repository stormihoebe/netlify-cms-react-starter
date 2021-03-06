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
const { REACT_APP_CURRENT_TENANT: CURRENT_TENANT } = process.env
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

  routeMeta = () => {
    const topics = this.getDocuments('topics')
    const currentTenant = this.getCurrentTenant()
    return topics.reduce((acc, topic) => {
      const topicRoute = {
        key: topic.name,
        path: `/${topic.name}`,
        component: TopicLandingPage,
        tenant: currentTenant,
        topic: topic,
        getDocument: this.getDocument,
      }
      const chapterRoutes = !topic.chapters
        ? []
        : topic.chapters.reduce((chapAcc, { chapter: c }) => {
            const chapter = this.getDocument('chapters', 'uid', c)
            if (!chapter) {
              return chapAcc
            }
            const chapterPath = slugify(`/${topic.title}/${chapter.title}`)
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

            const moduleRoutes = !chapter.modules
              ? []
              : chapter.modules.map(({ module: m }) => {
                  const mod = this.getDocument('modules', 'uid', m)
                  if (!mod) {
                    return null
                  }
                  const modPath = slugify(
                    `/${topic.title}/${chapter.title}/${mod.title}`
                  )
                  return {
                    ...chapterRouteProps,
                    key: modPath,
                    path: modPath,
                    selectedModule: mod,
                  }
                })

            return [...chapAcc, chapterRouteProps, ...moduleRoutes]
          }, [])

      return [...acc, topicRoute, ...chapterRoutes]
    }, [])
  }

  getCurrentTenant = () => this.getDocument('tenants', 'name', CURRENT_TENANT)
  render() {
    const globalSettings = this.getDocument('settings', 'name', 'global')
    const {
      siteTitle,
      siteUrl,
      socialMediaCard,
      headerScripts,
    } = globalSettings

    const defaultTopic = this.getDocument('topics', 'name', DEFAULT_TOPIC)
    const routeMetaData = this.routeMeta()
    const currentTenant = this.getCurrentTenant()
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
            {routeMetaData.map((route, i) => {
              return <RouteWithMeta {...route} exact />
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
