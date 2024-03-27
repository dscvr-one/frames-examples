# Getting started

This frame example display the current DSCVR user information.

This is a [Next.js](https://nextjs.org/) project that uses frames.js, [DSCVR frames adapter](https://docs.dscvr.one/build/frames/frame-concepts.html#frames-adapter) and [DSCVR API](https://docs.dscvr.one/build/dscvr-api/).

## Getting Started

First, install the package

```bash
pnpm install
```

Then, run the development server:

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

In this example a frame message is validated by the [DSCVR frame adapter](https://docs.dscvr.one/build/frames/frame-concepts.html#frames-adapter) to make sure is a DSCVR message, then the information for the current user and content is gathered using the [DSCVR API](https://docs.dscvr.one/build/dscvr-api/) and shown as a response.

To learn more about Frames visit our [documentation](https://docs.dscvr.one/).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
