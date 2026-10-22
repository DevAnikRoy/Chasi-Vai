"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { videos } from "@/data/videos";

function embedSrc(id: string, autoplay: boolean, muted: boolean) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (autoplay) params.set("autoplay", "1");
  if (muted) params.set("mute", "1");
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export default function ChannelPlayer({ reduced }: { reduced: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(videos[0].id);
  const [seen, setSeen] = useState(false);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    const node = stage.current;
    if (!node || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const current = videos.find((video) => video.id === active) ?? videos[0];
  const playing = picked || (seen && !reduced);

  return (
    <div className="watch">
      <div className="player" ref={stage}>
        {playing ? (
          <iframe
            key={`${current.id}-${picked ? "sound" : "mute"}`}
            src={embedSrc(current.id, true, !picked)}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" className="player-poster" onClick={() => setPicked(true)}>
            <Image src={`https://i.ytimg.com/vi/${current.id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 900px) 100vw, 62vw" />
            <span>ভিডিও চালান</span>
          </button>
        )}
      </div>
      <div className="watch-list" aria-label="চ্যানেলের ভিডিও">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            className="watch-item"
            aria-pressed={video.id === current.id}
            onClick={() => {
              setActive(video.id);
              setPicked(true);
            }}
          >
            <Image className="watch-thumb" src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" width={320} height={180} />
            <strong>{video.title}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
