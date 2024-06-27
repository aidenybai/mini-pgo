import * as React from 'react';

let data = {};
let fileMap = {};

const DO_NOT_CHECK = Symbol('DO_NOT_CHECK');

export const isDifferent = (prev, next) => {
  if (prev && next && typeof prev === 'object' && typeof next === 'object') {
    if (Array.isArray(prev) && Array.isArray(next)) {
      if (prev.length !== next.length) {
        return true;
      }
      for (let i = 0; i < prev.length; i++) {
        if (isDifferent(prev[i], next[i])) {
          return true;
        }
      }
      return false;
    }
    for (const key in { ...prev, ...next }) {
      if (isDifferent(prev[key], next[key])) {
        return true;
      }
    }
  }
  return prev !== next;
};

export const reportFile = (id, file) => {
  fileMap[id] = file;
};

export const reportData = (loc, duration = 0, value = DO_NOT_CHECK) => {
  const current = data[loc];
  if (!current) {
    data[loc] = {
      count: 0,
      duration,
      prev: value,
    };
    return;
  }

  if (value === DO_NOT_CHECK || isDifferent(current.prev, value)) {
    current.count++;
    current.duration += duration;
  }
};

export const capture = (id, loc, value) => {
  fileMap[loc] = id;
  reportData(loc, 0, value);
  return value;
};

export const Capture = ({ loc, id, children }) => {
  fileMap[loc] = id;
  return (
    <React.Profiler
      key={children?.key || undefined}
      id={loc}
      onRender={(_id, _phase, duration) => reportData(loc, duration)}
    >
      {children}
    </React.Profiler>
  );
};

export const transport = () => {
  const body = JSON.stringify({
    data,
    fileMap,
  });
  data = {};
  fileMap = {};
  return fetch('http://localhost:6900/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
};

globalThis.__SECRET_INTERNALS__ = {
  data,
  fileMap,
  capture,
  Capture,
  transport,
};
