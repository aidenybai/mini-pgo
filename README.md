### Reading:

- https://gist.github.com/aidenybai/3b67f9907762725d6031b433445a288b
- https://million.dev/lint
- https://old.million.dev/blog/lint
- https://github.com/3perf/react-workshop-ra
- https://www.figma.com/board/H7agLtzkyNhMx4YqBKmBiE/React-Debugging-Flowchart-(Smashing%2C-Jun-2023)?node-id=0-1&t=fBUsMVmRPsRZ46ni-0

### Setup

```bash
npm i -g pnpm
```

Open two terminals:

#### Terminal 1:

```bash
pnpm i
cd agent
# look at /agent/src/server.mjs
pnpm start # runs the server (stop + start to restart)
```

#### Terminal 2:

```bash
pnpm i
cd demo
pnpm dev
# open localhost:5173/__inspect to see source diffs
```