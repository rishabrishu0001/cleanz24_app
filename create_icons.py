import os
from PIL import Image, ImageDraw

LOGO_PATH = 'public/images/cleanz24_logo.jpg'
RES_PATH = 'android/app/src/main/res'
BG_COLOR = (47, 143, 72) # #2F8F48

logo = Image.open(LOGO_PATH).convert('RGBA')

# Mipmap densities and their standard launcher icon sizes
# (folder, launcher_size, foreground_size)
DENSITIES = [
    ('mipmap-mdpi', 48, 108),
    ('mipmap-hdpi', 72, 162),
    ('mipmap-xhdpi', 96, 216),
    ('mipmap-xxhdpi', 144, 324),
    ('mipmap-xxxhdpi', 192, 432),
]

def make_square_icon(size):
    # Full green background with scaled logo centered
    canvas = Image.new('RGBA', (size, size), (*BG_COLOR, 255))
    # Logo scaled to ~88% width
    scale = (size * 0.88) / logo.width
    new_w = int(logo.width * scale)
    new_h = int(logo.height * scale)
    scaled_logo = logo.resize((new_w, new_h), Image.LANCZOS)
    x = (size - new_w) // 2
    y = (size - new_h) // 2
    canvas.paste(scaled_logo, (x, y), scaled_logo)
    return canvas

def make_round_icon(size):
    sq = make_square_icon(size)
    # Apply circular mask
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    result = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    result.paste(sq, (0, 0), mask)
    return result

def make_foreground_icon(size):
    # Android adaptive icon foreground: safe area is center ~66% diameter
    # Transparent canvas
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    scale = (size * 0.70) / logo.width
    new_w = int(logo.width * scale)
    new_h = int(logo.height * scale)
    scaled_logo = logo.resize((new_w, new_h), Image.LANCZOS)
    x = (size - new_w) // 2
    y = (size - new_h) // 2
    canvas.paste(scaled_logo, (x, y), scaled_logo)
    return canvas

print("Generating Android Launcher Icons...")
for folder, l_size, fg_size in DENSITIES:
    dest_dir = os.path.join(RES_PATH, folder)
    os.makedirs(dest_dir, exist_ok=True)
    
    # 1. Square launcher icon
    sq = make_square_icon(l_size)
    sq.save(os.path.join(dest_dir, 'ic_launcher.png'), 'PNG')
    
    # 2. Round launcher icon
    rnd = make_round_icon(l_size)
    rnd.save(os.path.join(dest_dir, 'ic_launcher_round.png'), 'PNG')
    
    # 3. Adaptive foreground icon
    fg = make_foreground_icon(fg_size)
    fg.save(os.path.join(dest_dir, 'ic_launcher_foreground.png'), 'PNG')
    
    print(f"Generated {folder}: launcher {l_size}px, fg {fg_size}px")

# Splash screens
SPLASH_DIRS = [
    ('drawable', 480, 800),
    ('drawable-land-mdpi', 480, 320),
    ('drawable-land-hdpi', 800, 480),
    ('drawable-land-xhdpi', 1280, 720),
    ('drawable-land-xxhdpi', 1600, 960),
    ('drawable-land-xxxhdpi', 1920, 1280),
    ('drawable-port-mdpi', 320, 480),
    ('drawable-port-hdpi', 480, 800),
    ('drawable-port-xhdpi', 720, 1280),
    ('drawable-port-xxhdpi', 960, 1600),
    ('drawable-port-xxxhdpi', 1280, 1920),
]

print("Generating Splash Screens...")
for folder, w, h in SPLASH_DIRS:
    dest_dir = os.path.join(RES_PATH, folder)
    os.makedirs(dest_dir, exist_ok=True)
    canvas = Image.new('RGBA', (w, h), (*BG_COLOR, 255))
    # Scale logo to ~60% of width
    scale = (w * 0.60) / logo.width
    new_w = int(logo.width * scale)
    new_h = int(logo.height * scale)
    scaled_logo = logo.resize((new_w, new_h), Image.LANCZOS)
    x = (w - new_w) // 2
    y = (h - new_h) // 2
    canvas.paste(scaled_logo, (x, y), scaled_logo)
    canvas.save(os.path.join(dest_dir, 'splash.png'), 'PNG')
    print(f"Generated {folder}/splash.png ({w}x{h})")

print("Icons and Splash screens generated successfully!")
