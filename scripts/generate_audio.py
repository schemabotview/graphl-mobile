"""
Generate narration .wav from scene .tts files using ChatterboxTTS (local).

Layout (this repo):
    public/content/<topic>/tts/<stem>.tts  ->  public/content/<topic>/audio/<stem>.wav

Usage (inside the `chatterbox` conda env):
    python scripts/generate_audio.py --all
    python scripts/generate_audio.py public/content/apache-kafka/tts/kafka-topics.tts
    python scripts/generate_audio.py public/content/apache-kafka/tts/kafka-topics.tts --force

Mirrors the canonical generate_audio.py from the content repos; only the
path resolution (sibling audio/ dir per topic) and the --all walk differ.
"""

import argparse
import re
import sys
from pathlib import Path

import torch
import torchaudio as ta
from chatterbox.tts import ChatterboxTTS

REPO_ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = REPO_ROOT / "public" / "content"
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


def audio_dest(tts_file: Path) -> Path:
    """public/content/<topic>/tts/<stem>.tts -> public/content/<topic>/audio/<stem>.wav"""
    audio_dir = tts_file.parent.parent / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)
    return audio_dir / (tts_file.stem + ".wav")


def generate(tts_file: Path, model, device: str, force: bool) -> None:
    dest = audio_dest(tts_file)
    if dest.exists() and not force:
        print(f"Already exists: {dest.relative_to(REPO_ROOT)}  (use --force)")
        return

    text = tts_file.read_text(encoding="utf-8").strip()
    chunks = to_chunks(text)
    silence = torch.zeros(1, int(model.sr * 0.3))  # 300 ms between chunks

    print(f"Generating {tts_file.name} ({len(chunks)} chunks)")
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
    print(f"Saved: {dest.relative_to(REPO_ROOT)}\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate scene narration with ChatterboxTTS")
    parser.add_argument("tts_file", nargs="?", type=Path, help="Path to a .tts file")
    parser.add_argument("--all", action="store_true", help="Generate every public/content/*/tts/*.tts")
    parser.add_argument("--force", action="store_true", help="Regenerate even if the .wav exists")
    args = parser.parse_args()

    if args.all:
        targets = sorted(CONTENT_DIR.glob("*/tts/*.tts"))
    elif args.tts_file:
        f = args.tts_file if args.tts_file.is_absolute() else REPO_ROOT / args.tts_file
        targets = [f]
    else:
        parser.error("pass a .tts file or --all")

    targets = [t for t in targets if t.exists()]
    if not targets:
        print("No .tts files found")
        sys.exit(1)

    device = pick_device()
    print("Loading model...")
    model = ChatterboxTTS.from_pretrained(device=device)
    print("Model loaded\n")

    for t in targets:
        generate(t, model, device, args.force)


if __name__ == "__main__":
    main()
