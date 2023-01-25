const accountConfig = {
  "dvcrn@d.sh": "dvcrn@mas.to",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const resource = url.searchParams.get("resource");

    // if no resource param, just bail and return 404
    if (!resource) {
      return new Response("", { status: 404 });
    }

    // split acct:foo@bar.to -> foo@bar.to
    const [_, account] = resource.split(":");

    if (!accountConfig[account]) {
      console.log("account not configured: ", account);
      return new Response("", { status: 404 });
    }

    // split foo@bar.to => [foo, bar.to]
    const [accName, domain] = accountConfig[account].split("@");

    const out = {
      subject: `acct:${accName}@${domain}`,
      aliases: [
        `https://${domain}/@${accName}`,
        `https://${domain}/users/${accName}`,
      ],
      links: [
        {
          rel: "http://webfinger.net/rel/profile-page",
          type: "text/html",
          href: `https://${domain}/@${accName}`,
        },
        {
          rel: "self",
          type: "application/activity+json",
          href: `https://${domain}/users/${accName}`,
        },
        {
          rel: "http://ostatus.org/schema/1.0/subscribe",
          template: `https://${domain}/authorize_interaction?uri={uri}`,
        },
      ],
    };

    return new Response(JSON.stringify(out), {
      headers: {
        "Content-Type": "application/jrd+json",
      },
    });
  },
};
