<p align=center>
<img src="https://user-images.githubusercontent.com/12113222/32413609-ea673d3e-c24f-11e7-935b-0a2a86be0ee2.png">
</p>
<p align=center>
<a target="_blank" href="https://npmjs.org/package/nba-go" title="NPM version"><img src="https://img.shields.io/npm/v/nba-go.svg"></a>
<a target="_blank" href="https://travis-ci.org/xxhomey19/nba-go" title="Build Status"><img src="https://travis-ci.org/xxhomey19/nba-go.svg?branch=master"></a>
<a target="_blank" href="http://nodejs.org/download/" title="Node version"><img src="https://img.shields.io/badge/node.js-%3E=_6.0-green.svg"></a>
<a target="_blank" href="https://opensource.org/licenses/MIT" title="License: MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
<a target="_blank" href="http://makeapullrequest.com" title="PRs Welcome"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
</p>  


> The finest NBA CLI.  

Watch NBA live play-by-play, game preview, box score and player information on your console.  
Best CLI tool for those who are both **NBA fans** and **Engineers**.

All data comes from [stats.nba.com](http://stats.nba.com/) APIs.

## Install

In order to use nba-go, make sure that you have [Node](https://nodejs.org/) version 6.0.0 or higher.

```
$ npm install -g nba-go
```

Or in a Docker Container:

```
$ docker build -t nba-go:latest .
$ docker run -it nba-go:latest
```

By default, the docker container will run `nba-go game -t`, but you can
override this command at run time.  
For example:

```
$ docker run -it nba-go:latest nba-go player Curry -i
```

Or download the latest version [pkg](https://github.com/zeit/pkg) binaries in [releases](https://github.com/xxhomey19/nba-go/releases). It can be run on Linux, macOs and Windows.  
For example:

```
./nba-go-macos game -h
```

## Usage

`nba-go` provides two main commands.  

1. [`game` or `g`](#game)
2. [`player` or `p`](#player)

### Game

There are two things to do.  
1. [**Check schedule**](#check-schedule).  
2. Choose one game which you want to watch.  

Depending on the status of the game you chose, a different result will be shown. There are three kinds of statuses that may be displayed.

Status              | Example | Description
------------------- | ------- |-----------
[Pregame](#pregame) | <img alt="screen shot 2017-11-06 at 8 57 02 am" src="https://user-images.githubusercontent.com/12113222/32421167-8a3521d4-c2d0-11e7-9ae3-be1c0def1b71.png">         | It shows **when the game starts**. <br> Selecting this will show the comparison between two teams, including average points, field goal percents, average assists, etc.
[Live](#live)       | <img alt="screen shot 2017-11-06 at 8 56 50 am" src="https://user-images.githubusercontent.com/12113222/32421177-adc7ae5a-c2d0-11e7-9824-a4de7c40a5e4.png">         | It shows **live game clock**. <br> **Most powerful feature!** Selecting this will show the live page which includes scoreboard, play-by-play and box score.
[Final](#final)     | <img width="600" alt="screen shot 2017-11-06 at 8 56 14 am" src="https://user-images.githubusercontent.com/12113222/32421166-8a08dde0-c2d0-11e7-8a38-69f646786653.png">         | Selecting this will show scoreboard, detailed box score, etc.



#### Check schedule
In order to show the schedule on some days, `nba-go` provides the command `nba-go game` with some options.

#### Options

##### `-d <date>` or `--date <date>`
Enter a specific date to check the schedule on that day.  

```
$ nba-go game -d 2017/11/02
```

![game -d gif](https://user-images.githubusercontent.com/12113222/32413795-0e7d75c2-c254-11e7-8a77-eeabed3c11f2.gif)

##### `-y` or `--yesterday`
Check **yesterday's** schedule.  

```
$ nba-go game -y
```

![game -y gif](https://user-images.githubusercontent.com/12113222/32414094-8bd4ba98-c25a-11e7-84f0-4fc473dc7144.gif)

##### `-t` or `--today`
Check **today's** schedule.  

```
$ nba-go game -t
```

![game -t gif](https://user-images.githubusercontent.com/12113222/32414115-f1a1ad72-c25a-11e7-8c79-a8b9b1ee0599.gif)

##### `-T` or `--tomorrow`
Check **tomorrow's** schedule.  

```
$ nba-go game -T
```

![game -T gif](https://user-images.githubusercontent.com/12113222/32414142-7897dfe0-c25b-11e7-9acf-d50ade5379fd.gif)

##### `-n` or `--networks`
Display on schedule home team and away team television network information.

```
$ nba-go game -n
```

#### Pregame  
⭐️⭐️  
Check the detailed comparison data between two teams in the game.  

![pregame](https://user-images.githubusercontent.com/12113222/32414253-ad64df82-c25d-11e7-9076-4da800f3c701.gif)

#### Live  
⭐️⭐️⭐️   
**Best feature!** Realtime updated play-by-play, scoreboard and box score.  Turn on fullscreen mode for better experience.  
Btw, play-by-play is scrollable!.

![live](https://user-images.githubusercontent.com/12113222/32420915-3ca6b34a-c2cd-11e7-904d-bf41cc4b93f7.gif)

#### Final  
⭐️⭐️  
Check two teams' detailed scoreboard and box score.

![final](https://user-images.githubusercontent.com/12113222/32436783-1e7ad7b8-c320-11e7-97af-29d95732581c.gif)

#### Filter

Filter results to quickly jump to the info you care about

#### Options
##### `-f` or `--filter`

Currently only supports filtering the results by team but more options on the way

```
nba-go game --filter team=Detroit
```

### Player

Get player's basic information, regular season data and playoffs data.

**Note.** Must place **player's name** between `nba-go player` and options.

#### Options

##### `-i` or `--info`  
Get player's basic information.

```
$ nba-go player Curry -i
```
![player -i gif](https://user-images.githubusercontent.com/12113222/32416941-7cfc49e6-c28c-11e7-8a79-15601a44554e.gif)

##### `-r` or `--regular`  
Get player's basic information.

```
$ nba-go player Curry -r
```
![player -r gif](https://user-images.githubusercontent.com/12113222/32416897-bb82af9e-c28b-11e7-827f-0f0d67d80364.gif)

##### `-p` or `--playoffs`  
Get player's basic information.

```
$ nba-go player Curry -p
```
![player -p gif](https://user-images.githubusercontent.com/12113222/32500032-234e8fba-c40f-11e7-87c0-6e42a66a52dc.gif)

##### `-c` or `--compare`  
Get and compare the stats from multiple players. The better stat will be highlighted in green to make comparing easier.
When listing the multiple names they must be in quotes and seperated by commas. Can be combined with the -i, -r, and -p flags.

```
$ nba-go player "Lebron James, Stephen Curry, James Harden" -c -i -r -p
```
![player -c gif](https://user-images.githubusercontent.com/12113222/37696809-1fd54306-2d14-11e8-9261-4d9b6a08588a.gif)

#### Mixed them all
Get all data at the same time.
```
$ nba-go player Curry -i -r -p
```
![player mixed gif](https://user-images.githubusercontent.com/12113222/32416928-5054d48a-c28c-11e7-84d3-bc17681e1a5e.gif)

## Development

It's simple to run `nba-go` on your local computer.  
The following is step-by-step instruction.

```
$ git clone https://github.com/xxhomey19/nba-go.git
$ cd nba-go
$ yarn
$ NODE_ENV=development node bin/cli.js <command>
```

## Related repo:
 - [watch-nba](https://github.com/chentsulin/watch-nba)
 - [nba-color](https://github.com/xxhomey19/nba-color)

## License

MIT
