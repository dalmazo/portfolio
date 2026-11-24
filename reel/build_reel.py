"""Builds the Fortnite UI reel from reel/clips.csv.

Usage:  python reel/build_reel.py [--publish] [--cards-only]

  --cards-only  only render the title cards and caption overlays (no ffmpeg needed)
  --publish     copy the finished reel to public/videos/fortnite-reel.mp4

Needs Pillow (pip install pillow) and ffmpeg on PATH (winget install Gyan.FFmpeg).
"""

from __future__ import annotations

import csv
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

REEL = Path(__file__).resolve().parent
ROOT = REEL.parent
OUT = REEL / "out"
WORK = OUT / "work"

W, H, FPS = 1920, 1080, 60
INTRO_SECONDS, OUTRO_SECONDS = 2.5, 3.5
CLIP_FADE = 0.25

# Site palette (app/globals.css, contact card)
BG = (10, 10, 10)
CARD = (16, 16, 19)
FG = (245, 243, 238)
MUTED = (165, 163, 160)
ACCENT = (169, 188, 255)
SQUIRCLE_TOP, SQUIRCLE_BOTTOM = (199, 211, 255), (127, 149, 240)

FONTS = Path("C:/Windows/Fonts")
BOLD = FONTS / "segoeuib.ttf"
SEMIBOLD = FONTS / "seguisb.ttf"
REGULAR = FONTS / "segoeui.ttf"

NAME = "Rafael Dalmazo"
ROLE = "UI & Tools Technical Artist"
REEL_TITLE = "Fortnite UI Reel · 2023–2025"
CONTACT = ["dalmazo.rafael+jobs@gmail.com", "dalmazo.github.io/portfolio"]


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def cat_mark(size: int) -> Image.Image:
    """The squircle cat from app/icon.svg, drawn at 4x and scaled down for smooth edges."""
    s = size * 4
    k = s / 64

    gradient = Image.new("RGB", (s, s))
    gd = ImageDraw.Draw(gradient)
    for i in range(2 * s):
        t = i / (2 * s)
        color = tuple(round(a + (b - a) * t) for a, b in zip(SQUIRCLE_TOP, SQUIRCLE_BOTTOM))
        gd.line([(i, 0), (0, i)], fill=color, width=2)

    # Squircle mask: |x|^4 + |y|^4 <= 1
    mask = Image.new("L", (s, s), 0)
    md = ImageDraw.Draw(mask)
    pts = []
    for d in range(360):
        import math

        a = math.radians(d)
        c, n = math.cos(a), math.sin(a)
        x = math.copysign(abs(c) ** 0.5, c)
        y = math.copysign(abs(n) ** 0.5, n)
        pts.append((s / 2 + x * s / 2, s / 2 + y * s / 2))
    md.polygon(pts, fill=255)

    mark = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    mark.paste(gradient, (0, 0), mask)
    d = ImageDraw.Draw(mark)
    dark = (16, 16, 19, 255)
    light = SQUIRCLE_TOP + (255,)
    d.polygon([(14 * k, 34 * k), (16 * k, 12 * k), (29 * k, 24 * k)], fill=dark)
    d.polygon([(50 * k, 34 * k), (48 * k, 12 * k), (35 * k, 24 * k)], fill=dark)
    d.ellipse([13 * k, 21 * k, 51 * k, 53 * k], fill=dark)
    d.ellipse([21.7 * k, 32 * k, 27.3 * k, 40 * k], fill=light)
    d.ellipse([36.7 * k, 32 * k, 42.3 * k, 40 * k], fill=light)
    d.polygon([(29.5 * k, 43 * k), (34.5 * k, 43 * k), (32 * k, 46 * k)], fill=light)
    return mark.resize((size, size), Image.LANCZOS)


def card_background() -> Image.Image:
    """Dark background with the two soft glows from the contact card."""
    img = Image.new("RGB", (W, H), BG)
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W * 0.55, -H * 0.5, W * 1.4, H * 0.6], fill=(52, 60, 120))
    gd.ellipse([-W * 0.4, H * 0.55, W * 0.4, H * 1.5], fill=(70, 30, 58))
    glow = glow.filter(ImageFilter.GaussianBlur(220))
    return Image.blend(img, glow, 0.9)


def render_intro(path: Path) -> None:
    img = card_background()
    d = ImageDraw.Draw(img)
    mark = cat_mark(150)
    img.paste(mark, (W // 2 - 75, 300), mark)
    f_name, f_sub = font(BOLD, 112), font(SEMIBOLD, 44)
    d.text((W / 2, 560), NAME, font=f_name, fill=FG, anchor="mm")
    d.text((W / 2, 660), REEL_TITLE, font=f_sub, fill=ACCENT, anchor="mm")
    img.save(path)


def render_outro(path: Path) -> None:
    img = card_background()
    d = ImageDraw.Draw(img)
    mark = cat_mark(120)
    img.paste(mark, (W // 2 - 60, 250), mark)
    d.text((W / 2, 470), NAME, font=font(BOLD, 96), fill=FG, anchor="mm")
    d.text((W / 2, 560), ROLE, font=font(SEMIBOLD, 42), fill=ACCENT, anchor="mm")
    f_contact = font(REGULAR, 38)
    for i, line in enumerate(CONTACT):
        d.text((W / 2, 680 + i * 58), line, font=f_contact, fill=MUTED, anchor="mm")
    img.save(path)


def render_caption(title: str, detail: str, path: Path) -> None:
    """Transparent 1920x1080 overlay with a caption pill in the bottom-left corner.

    An empty title renders no caption, so several clips in a row can share the first one's.
    """
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if not title:
        img.save(path)
        return
    f_title, f_detail = font(SEMIBOLD, 40), font(REGULAR, 28)
    probe = ImageDraw.Draw(img)
    tw = probe.textlength(title, font=f_title)
    dw = probe.textlength(detail, font=f_detail) if detail else 0
    pad_x, bar = 34, 6
    box_w = int(max(tw, dw) + pad_x * 2 + bar + 18)
    box_h = 128 if detail else 80
    x0, y0 = 72, H - 72 - box_h

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [x0, y0 + 10, x0 + box_w, y0 + box_h + 10], radius=22, fill=(0, 0, 0, 120)
    )
    img = Image.alpha_composite(img, shadow.filter(ImageFilter.GaussianBlur(18)))

    d = ImageDraw.Draw(img)
    d.rounded_rectangle([x0, y0, x0 + box_w, y0 + box_h], radius=22, fill=CARD + (214,))
    d.rounded_rectangle(
        [x0, y0, x0 + box_w, y0 + box_h], radius=22, outline=FG + (40,), width=2
    )
    d.rounded_rectangle(
        [x0 + pad_x, y0 + 22, x0 + pad_x + bar, y0 + box_h - 22], radius=3, fill=ACCENT + (255,)
    )
    tx = x0 + pad_x + bar + 18
    d.text((tx, y0 + 16), title, font=f_title, fill=FG + (255,))
    if detail:
        d.text((tx, y0 + 78), detail, font=f_detail, fill=ACCENT + (255,))
    img.save(path)


def seconds(value: str) -> float:
    value = value.strip()
    if ":" in value:
        m, s = value.split(":", 1)
        return int(m) * 60 + float(s)
    return float(value)


def ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if not exe:
        sys.exit("ffmpeg not found. Install it with:  winget install Gyan.FFmpeg  (then open a new terminal)")
    return exe


def run(args: list[str]) -> None:
    result = subprocess.run(args, capture_output=True, text=True)
    if result.returncode != 0:
        sys.exit("ffmpeg failed:\n" + result.stderr[-2000:])


ENCODE = ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS)]
SILENT = ["-f", "lavfi", "-t", "{d}", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"]
AUDIO = ["-c:a", "aac", "-b:a", "192k", "-shortest"]


def still_segment(ff: str, image: Path, duration: float, out: Path) -> None:
    fade = f"fade=in:st=0:d=0.4,fade=out:st={duration - 0.5}:d=0.5"
    run([ff, "-y", "-loop", "1", "-t", str(duration), "-i", str(image),
         *[a.format(d=duration) for a in SILENT],
         "-vf", f"{fade},format=yuv420p", *ENCODE, *AUDIO, str(out)])


def clip_segment(
    ff: str, src: Path, start: float, end: float, caption: Path, out: Path,
    fade_in: bool = True, fade_out: bool = True,
) -> None:
    d = end - start
    # Fades to black only at the edges of a group; clips inside a group hard-cut.
    fades = ""
    if fade_in:
        fades += f",fade=in:st=0:d={CLIP_FADE}"
    if fade_out:
        fades += f",fade=out:st={d - CLIP_FADE}:d={CLIP_FADE}"
    graph = (
        f"[0:v]scale={W}:{H}:force_original_aspect_ratio=decrease,"
        f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=0x0a0a0a,setsar=1,fps={FPS}[v];"
        f"[1:v]format=rgba,fade=in:st=0.3:d=0.35:alpha=1,"
        f"fade=out:st={max(d - 0.7, 0.4)}:d=0.35:alpha=1[c];"
        f"[v][c]overlay=0:0{fades},format=yuv420p[out]"
    )
    run([ff, "-y", "-ss", str(start), "-t", str(d), "-i", str(src),
         "-loop", "1", "-t", str(d), "-i", str(caption),
         *[a.format(d=d) for a in SILENT],
         "-filter_complex", graph, "-map", "[out]", "-map", "2:a",
         *ENCODE, *AUDIO, str(out)])


def main() -> None:
    cards_only = "--cards-only" in sys.argv
    publish = "--publish" in sys.argv
    WORK.mkdir(parents=True, exist_ok=True)

    rows = list(csv.DictReader((REEL / "clips.csv").open(encoding="utf-8")))
    render_intro(WORK / "intro.png")
    render_outro(WORK / "outro.png")
    for i, row in enumerate(rows):
        render_caption(row["title"].strip(), row["detail"].strip(), WORK / f"caption-{i:02}.png")
    print(f"Rendered cards and {len(rows)} captions in {WORK}")
    if cards_only:
        return

    ff = ffmpeg()
    segments: list[Path] = []

    intro = WORK / "seg-intro.mp4"
    still_segment(ff, WORK / "intro.png", INTRO_SECONDS, intro)
    segments.append(intro)

    present = []
    for i, row in enumerate(rows):
        src = (REEL / row["file"].strip()).resolve()
        if src.exists():
            present.append((i, row, src))
        else:
            print(f"  skip  {row['file']} (not found yet)")

    # A row with a title starts a group; rows with an empty title continue it.
    starts_group = [k == 0 or bool(row["title"].strip()) for k, (_, row, _) in enumerate(present)]

    for k, (i, row, src) in enumerate(present):
        start, end = seconds(row["start"]), seconds(row["end"])
        out = WORK / f"seg-{i:02}.mp4"
        last_in_group = k == len(present) - 1 or starts_group[k + 1]
        clip_segment(ff, src, start, end, WORK / f"caption-{i:02}.png", out,
                     fade_in=starts_group[k], fade_out=last_in_group)
        segments.append(out)
        print(f"  ok    {row['file']}  {end - start:.1f}s  — {row['title']}")

    outro = WORK / "seg-outro.mp4"
    still_segment(ff, WORK / "outro.png", OUTRO_SECONDS, outro)
    segments.append(outro)

    listing = WORK / "segments.txt"
    listing.write_text("".join(f"file '{p.as_posix()}'\n" for p in segments), encoding="utf-8")
    joined = WORK / "joined.mp4"
    run([ff, "-y", "-f", "concat", "-safe", "0", "-i", str(listing), "-c", "copy", str(joined)])

    final = OUT / "fortnite-reel.mp4"
    music = REEL / "music.mp3"
    if music.exists():
        run([ff, "-y", "-i", str(joined), "-i", str(music), "-map", "0:v", "-map", "1:a",
             "-c:v", "copy", "-af", "afade=t=in:d=1", "-c:a", "aac", "-b:a", "192k",
             "-shortest", "-movflags", "+faststart", str(final)])
    else:
        run([ff, "-y", "-i", str(joined), "-c", "copy", "-movflags", "+faststart", str(final)])
    print(f"Reel: {final}")

    if publish:
        target = ROOT / "public" / "videos" / "fortnite-reel.mp4"
        shutil.copyfile(final, target)
        print(f"Published to {target}")


if __name__ == "__main__":
    main()
