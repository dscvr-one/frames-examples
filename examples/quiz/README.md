# Quiz

This frame example creates a quiz and for the first 500 winners it redirect's them to an NFT purchase link DSCVR and Farcaster users can participate.

It's an example on how to work with frames `post_redirect` scenario.

This is a [Next.js](https://nextjs.org/) project that uses frames.js, [DSCVR frames adapter](https://docs.dscvr.one/build/frames/frame-concepts.html#frames-adapter) and [DSCVR API](https://docs.dscvr.one/build/dscvr-api/).

It also uses Postgres database for storing the questions, but feel free to use whatever feels better.

## Getting Started

First, install the package

```bash
pnpm install
```

Set an environment variable called `POSTGRES_URL` with the connection string for the database.

```
POSTGRES_URL="postgres://default:..."
```

Run the setup SQL script that creates the DB structure

```bash
pnpm db:setup
```

Other scripts for working with the database are dropping the database `pnpm db:drop` or printing the contents of the tables `pnpm db:dump`

Finally, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result, a blank screen will be shown, but the html headers will show the frames information.

## Debug your changes

Since all of the action happens in the headers, go ahead an try our [DSCVR frame validator](https://dscvr.one/dev/frames):

1. Once the project is running on port 3000, run `npx localtunnel --port 3000`
2. Copy the provided url
3. Go to [DSCVR frame validator](https://dscvr.one/dev/frames)
4. Play with your frame!

## Learn More

In this example a frame message is validated by the [DSCVR frame adapter](https://docs.dscvr.one/build/frames/frame-concepts.html#frames-adapter) to make sure is a DSCVR message, then the username the current user and content is gathered using the [DSCVR API](https://docs.dscvr.one/build/dscvr-api/) and shown as a response. If the protocol is not for DSCVR then the message is validated against Farcaster, so both DSCVR users and Farcaster users can participate in the quiz.

To learn more about Frames visit our [documentation](https://docs.dscvr.one/).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
