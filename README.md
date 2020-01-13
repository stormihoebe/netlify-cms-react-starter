### Requirements 
1. node version 10+ `nvm use 10`
1. yarn

This project was created using [Netlify CMS + React Starter # Netlify CMS + React Starter](https://github.com/Jinksi/netlify-cms-react-starter). Technologies Include:

- **[Create React App](https://github.com/facebookincubator/create-react-app)**
- **[React Router](https://github.com/ReactTraining/react-router)** for routing
- **[React Helmet](https://github.com/nfl/react-helmet)** for document titles, descriptions, meta
- **[React Snapshot](https://github.com/geelen/react-snapshot)** for pre-rendering to static html so it works without Javascript ⭐️
- **[Netlify CMS](https://github.com/netlify/netlify-cms)** for content management

## Developing

1.  Clone your repo to your local machine

2.  Install dependencies

`yarn` or `npm install`

3.  Run the development server

`yarn start` or `npm run start`

- CMS at [localhost:3000/admin](http://localhost:3000/admin) 
- Example microsite at [localhost:3000](http://localhost:3000/) 

## Working with the CMS

If you are adding or editing content locally in the CMS, a couple of things to note:

1.  Changes will be pushed to the remote repo.

1.  You will be prompted to enter your site's url, this is necessary for Netlify Identity to manage user login. This is stored in `localStorage`, so you might have to empty your browser cache if you are switching projects but remaining on `localhost:3000`.

1. Editing the CMS: The Netlify CMS configuration is located in `public/admin/config.yml`. This is where you will configure the pages, fields, posts and settings that are editable by the CMS. Find out more in the [Netlify CMS Docs](https://www.netlifycms.org/docs/#configuration).

### [Netlify Large Media](https://docs.netlify.com/large-media/setup/)
1. git-lfs `brew install git-lfs`
1. netlify cli `npm install netlify-cli -g` 
1. netlify large media plugin 
```
netlify plugins:install netlify-lm-plugin
netlify lm:install
```
1. link netlify account `netlify link`
[More Reading on Repository collaboration with Large Media](https://docs.netlify.com/large-media/repository-collaboration/#repository-forks)