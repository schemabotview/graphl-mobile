"""
Generate reel narration .wav from .tts using ChatterboxTTS (local).

Reel content lives in the per-topic content repos, not in this app:
    <CONTENT_ROOT>/<topic>/reels/<stem>.tts  ->  <CONTENT_ROOT>/<topic>/reels/<stem>.wav

CONTENT_ROOT defaults to ~/Projects (where the topic repos are cloned); override
with the GRAPHL_CONTENT_ROOT env var. After generating, commit + push the .wav
in the topic repo so it serves via raw.githubusercontent.com.

Usage (inside the `chatterbox` conda env):
    python scripts/generate_audio.py --all                 # every <root>/*/reels/*.tts
    python scripts/generate_audio.py --topic apache-kafka  # one topic
    python scripts/generate_audio.py /abs/path/to/x.tts --force
"""

import argparse
import os
import re
import sys
from pathlib import Path

import torch
import torchaudio as ta
from chatterbox.tts import ChatterboxTTS

CONTENT_ROOT = Path(os.environ.get("GRAPHL_CONTENT_ROOT", Path.home() / "Projects"))
MAX_CHUNK = 300


def pick_device() -> str:
    if torch.cuda.is_available():
        print("Using CUDA (NVIDIA GPU)")
        return "cuda"
    if torch.backends.mps.is_available():
        print("Using MPS (Apple Silicon)")
        return "mps"
    print("Using CPU (slower)")
    return "cpu"


def to_chunks(text: str) -> list[str]:
    """One chunk per non-empty line; long lines split on sentence boundaries.
    Blank lines (paragraph breaks) become inter-chunk silence -> natural pauses."""
    chunks: list[str] = []
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        if len(line) <= MAX_CHUNK:
            chunks.append(line)
            continue
        buf = ""
        for s in re.split(r"(?<=[.!?])\s+", line):
            if len(buf) + len(s) + 1 <= MAX_CHUNK:
                buf = (buf + " " + s).strip() if buf else s
            else:
                if buf:
                    chunks.append(buf)
                buf = s
        if buf:
            chunks.append(buf)
    return chunks


def rel(p: Path) -> str:
    try:
        return str(p.relative_to(CONTENT_ROOT))
    except ValueError:
        return str(p)


def generate(tts_file: Path, model, device: str, force: bool) -> None:
    dest = tts_file.with_suffix(".wav")  # sibling .wav in the same reels/ dir
    if dest.exists() and not force:
        print(f"Already exists: {rel(dest)}  (use --force)")
        return

    text = tts_file.read_text(encoding="utf-8").strip()
    chunks = to_chunks(text)
    silence = torch.zeros(1, int(model.sr * 0.3))  # 300 ms between chunks

    print(f"Generating {rel(tts_file)} ({len(chunks)} chunks)")
    segments = []
    for i, chunk in enumerate(chunks):
        print(f"  chunk {i + 1}/{len(chunks)}: {chunk[:60]}...")
        if device == "mps":
            torch.mps.empty_cache()  # prevent OOM on Apple Silicon
        try:
            segments.append(model.generate(chunk).cpu())
            segments.append(silence)
        except RuntimeError as e:
            print(f"  skipped: {e}")

    if not segments:
        print(f"  Error: no audio generated for {tts_file.name}")
        return

    ta.save(str(dest), torch.cat(segments, dim=-1), model.sr)
    print(f"Saved: {rel(dest)}\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate reel narration with ChatterboxTTS")
    parser.add_argument("tts_file", nargs="?", type=Path, help="Path to a .tts file")
    parser.add_argument("--topic", help="Topic repo name under CONTENT_ROOT, e.g. apache-kafka")
    parser.add_argument("--all", action="store_true", help="Every <root>/*/reels/*.tts")
    parser.add_argument("--force", action="store_true", help="Regenerate even if the .wav exists")
    args = parser.parse_args()

    if args.all:
        targets = sorted(CONTENT_ROOT.glob("*/reels/*.tts"))
    elif args.topic:
        targets = sorted((CONTENT_ROOT / args.topic / "reels").glob("*.tts"))
    elif args.tts_file:
        targets = [args.tts_file.resolve()]
    else:
        parser.error("pass a .tts file, --topic <name>, or --all")

    targets = [t for t in targets if t.exists()]
    if not targets:
        print(f"No .tts files found (CONTENT_ROOT={CONTENT_ROOT})")
        sys.exit(1)

    device = pick_device()
    print("Loading model...")
    model = ChatterboxTTS.from_pretrained(device=device)
    print("Model loaded\n")

    for t in targets:
        generate(t, model, device, args.force)


if __name__ == "__main__":
    main()
