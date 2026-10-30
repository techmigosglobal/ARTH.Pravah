"""Optional source-media preparation. Requires existing system ffmpeg and Pillow.
Production builds consume the checked-in derivatives and need no Python or ffmpeg.
"""
from pathlib import Path
from PIL import Image
import json, subprocess

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
MODELS = {
    'aero': ('Aero', 'b5', 'Aero_ARTH.Pravah.mp4'),
    'apex': ('Apex', 'optimus', 'Apex_ARTH.Pravah.mp4'),
    'nova': ('Nova', 'aura', 'Nova_ARTH.Pravah.mp4'),
    'teja': ('Teja', 'double', 'Teja_ARTH.Pravah.mp4'),
    'vayu': ('Vayu', 'single', 'Vayu_ARTH.Pravah.mp4'),
    'vega': ('Vega', 'd5', 'Vega_ARTH.Pravah 2.mp4'),
}
manifest = {}
for slug, (folder, prefix, video) in MODELS.items():
    target = ASSETS / 'models' / slug
    target.mkdir(parents=True, exist_ok=True)
    for view in ['hero', 'front', 'side', 'back']:
        with Image.open(ROOT / folder / f'{prefix}_{view}.png') as im:
            im.convert('RGB').save(target / f'{view}.webp', quality=85, method=6)
    frames = ASSETS / 'frames' / slug
    frames.mkdir(parents=True, exist_ok=True)
    for old in frames.glob('frame-*.webp'):
        old.unlink()
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
                    '-ss', '3', '-i', str(ROOT / folder / video), '-t', '7', '-an', '-vf', 'fps=12,scale=960:540',
                    '-c:v', 'libwebp', '-quality', '76', '-threads', '2',
                    str(frames / 'frame-%04d.webp')], check=True)
    # Manifest is built from files that really exist, not a guessed sequence length.
    paths = sorted(frames.glob('frame-*.webp'))
    manifest[slug] = {'source': f'{folder}/{video}', 'sourceStartSeconds': 3, 'sampleFps': 12, 'width': 960, 'height': 540,
                      'frames': ['/' + p.relative_to(ROOT).as_posix() for p in paths],
                      'poster': '/' + paths[0].relative_to(ROOT).as_posix()}
    print(slug, len(paths), 'frames', flush=True)
(ASSETS / 'frames' / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
