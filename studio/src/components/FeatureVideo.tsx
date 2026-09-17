/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useRef, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

type Props = {
  src?: string;
  poster?: string;
  alt?: string;
};

function siteAssetPath(source: string | undefined) {
  if (!source) return "";
  if (/^(?:[a-z]+:|\/\/)/i.test(source)) return source;
  return source.startsWith("/")
    ? source
    : `/${source.replace(/^(?:\.\.?\/)+/, "")}`;
}

export default function FeatureVideo({ src, poster, alt }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const resolvedSrcPath = useBaseUrl(siteAssetPath(src));
  const resolvedPosterPath = useBaseUrl(siteAssetPath(poster));
  const resolvedSrc = src ? resolvedSrcPath : undefined;
  const resolvedPoster = poster ? resolvedPosterPath : undefined;

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
    } else {
      v.pause();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        background: "#000",
        borderRadius: 12,
        overflow: "hidden",
        margin: "1.5rem 0",
      }}
    >
      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        poster={resolvedPoster}
        aria-label={alt}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          background: "#000",
        }}
      >
        <source src={resolvedSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <button
          onClick={handlePlay}
          aria-label="Play video"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            border: "2px solid rgba(255,255,255,0.9)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s, background 0.2s",
            zIndex: 2,
          }}
        >
          <svg
            width={36}
            height={36}
            viewBox="0 0 24 24"
            fill="white"
            style={{ marginLeft: 4 }}
            aria-hidden="true"
          >
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        </button>
      )}
    </div>
  );
}

