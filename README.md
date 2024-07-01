## Reading list:

### React perf optimization

- https://gist.github.com/aidenybai/3b67f9907762725d6031b433445a288b
- https://www.figma.com/board/H7agLtzkyNhMx4YqBKmBiE/React-Debugging-Flowchart-(Smashing%2C-Jun-2023)?node-id=0-1&t=fBUsMVmRPsRZ46ni-0
- https://github.com/coryhouse/reactjsconsulting/issues/77
- https://3perf.com/content/ (library of content)
- https://github.com/kurtextrem/awesome-performance-patches


### Million Lint internals

- https://million.dev/lint
- https://old.million.dev/blog/lint
- https://github.com/millionjs/million-lint-benchmark (THIS CONTAINS ANSWERS TO https://github.com/3perf/react-workshop-ra)

## Task

## Setup

```bash
npm i -g pnpm
```

Open two terminals:

### Terminal 1:

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
