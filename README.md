# What is this

A lil' helper tool for people who use linear and are tired of coming up with branch names.

Run this sucker and all your work is done for you.

## Installation

1. Clone:

```
git clone git@github.com:the-witch-king/brancher.git
```

2. Theeeeen...

Quick n dirty:

```
npm i brancher-0.0.1.tgz -g
```

I want to do it all myself:

```
npm run build
npm pack
npm i <the tar file that was made> -g
```

## First time setup

### Get your linear api key

Go to linear. Go to your account > settings > api

Make a key!

### Config

```
brancher init
...follow prompt...
```

### Config is stored in the home

The config file lives at `$HOME/.linear-brancher`
If you ever want to poke at it yourself, go in there.
It holds 1 value right now, `api_key` (or `API_KEY`). 
It doesn't support mixed casing (get outta here with `api_KEY`).

## Usage

```
brancher IAC-420
```
