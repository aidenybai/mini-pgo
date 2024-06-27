import '../../agent/src/client';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import { getRandomEntry } from './random';

function Entry({ message, img, username, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white flex p-2 rounded-lg items-center gap-3 text-black shadow-md"
    >
      <img
        src={img.src}
        alt={img.alt}
        className="h-24 w-24 rounded-lg"
        loading="lazy"
      />
      <div>
        <p className="font-semibold">{username}</p>
        <ReactMarkdown className="text-black/70">{message}</ReactMarkdown>
      </div>
    </div>
  );
}

function Feed() {
  const [posts, setPosts] = useState(() =>
    Array(2000)
      .fill(0)
      .map(() => getRandomEntry())
  );
  const [filter, setFilter] = useState('');

  const entries = posts
    .filter((entry) =>
      (entry.message + entry.username)
        .toLowerCase()
        .includes(filter.toLowerCase())
    )
    .map(({ id, message, username, img }) => (
      <Entry
        key={id}
        message={message}
        username={username}
        img={img}
        onClick={() => setFilter(message)}
      />
    ));
  return (
    <div className="relative bg-[#2e2e2e] p-7 rounded-lg h-screen overflow-auto flex flex-col gap-4 text-white">
      <div className="gap-2 sticky bg-black/90 rounded-lg p-2 top-0 flex items-center z-50">
        <p>[thecapybook]</p>
        <input
          onInput={(event) => setFilter(event.target.value)}
          value={filter}
          placeholder={`Search ${entries.length} posts...`}
          className="bg-[#111] rounded-lg text-white w-full"
        />
      </div>
      <div className="flex flex-col h-full gap-4">{entries}</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Feed />);
