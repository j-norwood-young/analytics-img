# Analytics IMG

Record Google Analytics hits from a third-party site through an embedded PNG

## Setup

`cp env-example .env`

Configure to your heart's desire

`npm i` (or `yarn` if you prefer)

## Running

npm run

## Usage

### Basic Usage

Simply append any page you'd like to impersonate. Eg. if running on localhost, embed this in your webpage:

```
<img src="http://localhost:4011/some-random-page" />
```

This will "hit" /some-random-page in Google Analytics.

### Iframe

To serve an iframe with the image embedded in the iframe, append `?iframe` to your url.

```
<iframe border="0" src="http://localhost:4011/some-random-page?iframe"></iframe>
```