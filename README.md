# node-js-getting-started
<!-- A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone git@github.com:heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy) -->


## Start
1. Opret en gratis [Heroku konto](https://signup.heroku.com/signup/dc)
1. Installer [Node.js & npm](https://nodejs.org/en/download/)  lokalt
1. Download [Heroku CLI](https://devcenter.heroku.com/toolbelt-downloads/windows64) (windows 64bit).


##  Set up
1. Åben kommandoprompt (cmd)
1. Change direction til ønskede mappe
```
$ cd C:\Users\frede\Documents\RTS\Webserver\
```
3. Log ind på din Heroku konto i kommandoprompt
``` 
$ heroku login
Enter your Heroku credentials.
Email: 4027010@rts-365.dk
Password:
```

### Tjek om alt er installeret korrekt.

- Eksemplet virker kun med Node v8 eller højere.
```
$ node --version
v8.9.4
```
- Se om npm er med, ellers installer den nyeste version.
```
$ npm --version
5.6.0
```
- Se om git er installeret, ellers gerinstaller Heroku CLI og prøv igen.
```
$ git --version
git version 2.8.1.windows.1
```

## Clone et repository
1. Clone det ønskede repository
1. Change direction til den nyoprettede mappe
```
$ git clone https://github.com/FrederikDahlin/heroku-server.git
$ cd heroku-server
```

## Deploy

1. Opret en app på Heroku som klargører Heroku til at modtage source koden.
```
$ heroku create
Creating sharp-rain-871... done, stack is cedar-14
http://sharp-rain-871.herokuapp.com/ | https://git.heroku.com/sharp-rain-871.git
Git remote heroku added
```
2. "Deploy" koden
```
$ git push heroku master
Counting objects: 488, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (367/367), done.
Writing objects: 100% (488/488), 231.85 KiB | 115.92 MiB/s, done.
Total 488 (delta 86), reused 488 (delta 86)
remote: Compressing source files... done.
remote: Building source:
remote:
remote: -----> Node.js app detected
remote:
remote: -----> Creating runtime environment
remote:
remote:        NPM_CONFIG_LOGLEVEL=error
remote:        NODE_VERBOSE=false
remote:        NODE_ENV=production
remote:        NODE_MODULES_CACHE=true
remote:
remote: -----> Installing binaries
remote:        engines.node (package.json):  8.11.1
remote:        engines.npm (package.json):   unspecified (use default)
remote:
remote:        Resolving node version 8.11.1...
remote:        Downloading and installing node 8.11.1...
remote:        Using default npm version: 5.6.0
       ....
remote: -----> Build succeeded!
remote: -----> Discovering process types
remote:        Procfile declares types -> web
remote:
remote: -----> Compressing...
remote:        Done: 19M
remote: -----> Launching...
remote:        Released v3
remote:        http://sharp-rain-871.herokuapp.com deployed to Heroku
remote:
remote: Verifying deploy... done.
To https://git.heroku.com/nameless-savannah-4829.git
 * [new branch]      master -> master
```

3. Scale serveren en gang op så den kører
```
$ heroku ps:scale web=1
```

4. Åben webhotellet
```
$ heroku open
```

## Logs
1. Brug logging kommandoen til at se info om den kørende app
```
$ heroku logs --tail
2011-03-10T10:22:30-08:00 heroku[web.1]: State changed from created to starting
2011-03-10T10:22:32-08:00 heroku[web.1]: Running process with command: `node index.js`
2011-03-10T10:22:33-08:00 heroku[web.1]: Listening on 18320
2011-03-10T10:22:34-08:00 heroku[web.1]: State changed from starting to up
```
## Definer en Procfile
_Kan jeg ikke forklar_
> The Procfile in the example app you deployed looks like this:
```
web: node index.js
```

> This declares a single process type, web, and the command needed to run it. The name web is important here. It declares that this process type will be attached to the HTTP routing stack of Heroku, and receive web traffic when deployed.

> Procfiles can contain additional process types. For example, you might declare one for a background worker process that processes items off of a queue.

## Scale appen
-  Appen kører på én enkel web dyno
>"Think of a dyno as a lightweight container that runs the command specified in the Procfile."

- Tjek hvor mange dynos kører med _ps_ kommandoen:
```
$ heroku ps
=== web (Free): `node index.js`
web.1: up 2014/04/25 16:26:38 (~ 1s ago)
```

> "Scaling an application on Heroku is equivalent to changing the number of dynos that are running."


### Test scale appen
```
$ heroku ps:scale web=0
```
- Scale op igen
```
$ heroku ps:scale web=1
```




## App lokalt
- Kør appen lokalt
```
$ heroku local web
[OKAY] Loaded ENV .env File as KEY=VALUE Format
1:23:15 PM web.1 |  Node app is running on port 3000
```

- Åben http://localhost:3000, appen burde køre lokalt
    - Ctrl + C for at stoppe serven


## Push lokale ændringer
Efter der er blevet lavet ændringer lokalt, push filerne.

1. Tilføj de ændrede filer til det lokale git repository
```
$ git add .
```
1. Commit ændringerne
```
$ git commit -m "initial commit"
```
1. Push
```
$ git push heroku master
```


## Console
- Start console
```
$ heroku run bash
Running `bash` attached to terminal... up, run.3052
~ $ ls
Procfile  README.md  composer.json  composer.lock  vendor  views  web
~ $ exit
exit
```


