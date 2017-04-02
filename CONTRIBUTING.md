# Contributing

## Updating the demo app on Heroku
Follow the Heroku getting started docs to install the Heroku CLI. Next, run the following:

```
cd example/commonSetup
heroku create
heroku config:set IS_DEMO=true
git remote add heroku <repo url from output of previous command>
cd -
git subtree push --prefix example/commonSetup heroku master
```
