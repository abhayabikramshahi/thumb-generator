import React, { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: false });

export default function VideoThumbnailGenerator({ time = 2 }) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ffmpegReady, setFfmpegReady] = useState(false);

  useEffect(() => {
    const loadFfmpeg = async () => {
      await ffmpeg.load();
      setFfmpegReady(true);
    };
    loadFfmpeg();
  }, []);

  const generateThumbnail = async () => {
    if (!videoFile || !ffmpegReady) return;
    setLoading(true);

    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));
    await ffmpeg.run(
      "-i",
      "input.mp4",
      "-ss",
      `00:00:0${time}`,
      "-frames:v",
      "1",
      "thumbnail.png"
    );

    const data = ffmpeg.FS("readFile", "thumbnail.png");
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/png" })
    );

    setThumbnail(url);
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
      />
      <button onClick={generateThumbnail} disabled={!ffmpegReady || loading}>
        {loading ? "Generating..." : "Generate Thumbnail"}
      </button>
      {thumbnail && <img src={thumbnail} alt="Thumbnail" style={{ marginTop: 10 }} />}
    </div>
  );
}
