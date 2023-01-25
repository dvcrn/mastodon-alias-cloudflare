# Mastodon custom domain alias on Cloudflare workers

Mini script to quickly add support for setting `you@yourdomain.com` as search alias to your main mastodon profile, running on Cloudflare workers

![screenshot](screenshot.png)

## Config & Deploy

Copy the content of index.js into a new Cloudflare worker or run `wrangler publish`

The first line configures the account redirects:

```js
const accountConfig = {
  "dvcrn@d.sh": "dvcrn@mas.to",
};
```

This will resolve search queries for `dvcrn@d.sh` (assuming the worker is running on d.sh) to return account information for `dvcrn@mas.to`

Then go to Cloudflare and set a new URL for your worker like so (worker needs to be able to respond to requests to `https://yourdomain.com/.well-known/webfinger?resource=acct:dvcrn@d.sh`)

![screenshot2](screenshot2.png)

## What this actually does

It generates a JSON that points to your target account, and that's about it :) Check out https://d.sh/.well-known/webfinger?resource=acct:dvcrn@d.sh to get an idea. 

```json
{
    "subject": "acct:dvcrn@mas.to",
    "aliases": [
        "https://mas.to/@dvcrn",
        "https://mas.to/users/dvcrn"
    ],
    "links": [
        {
            "rel": "http://webfinger.net/rel/profile-page",
            "type": "text/html",
            "href": "https://mas.to/@dvcrn"
        },
        {
            "rel": "self",
            "type": "application/activity+json",
            "href": "https://mas.to/users/dvcrn"
        },
        {
            "rel": "http://ostatus.org/schema/1.0/subscribe",
            "template": "https://mas.to/authorize_interaction?uri={uri}"
        }
    ]
}
```

## License

MIT