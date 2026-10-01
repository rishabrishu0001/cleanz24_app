import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "playstore_assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

LOGO_PATH = "public/images/cleanz24_logo.jpg"
BG_COLOR = (47, 143, 72) # Primary brand green #2F8F48

# 1. GENERATE APP ICON (512 x 512 PNG)
def create_app_icon():
    size = 512
    icon = Image.new("RGBA", (size, size), (*BG_COLOR, 255))
    
    if os.path.exists(LOGO_PATH):
        logo = Image.open(LOGO_PATH).convert("RGBA")
        # Scale logo to ~82% width
        target_w = int(size * 0.82)
        scale = target_w / logo.width
        target_h = int(logo.height * scale)
        scaled_logo = logo.resize((target_w, target_h), Image.LANCZOS)
        
        pos_x = (size - target_w) // 2
        pos_y = (size - target_h) // 2
        icon.paste(scaled_logo, (pos_x, pos_y), scaled_logo)
    
    out_path = os.path.join(OUTPUT_DIR, "app_icon_512x512.png")
    icon.save(out_path, "PNG", optimize=True)
    print(f"Created: {out_path} ({size}x{size})")

# 2. GENERATE FEATURE GRAPHIC (1024 x 500 PNG)
def create_feature_graphic():
    w, h = 1024, 500
    
    # Create smooth gradient canvas
    banner = Image.new("RGBA", (w, h))
    draw = ImageDraw.Draw(banner)
    
    # Emerald green rich gradient
    for y in range(h):
        r = int(22 + (47 - 22) * (y / h))
        g = int(101 + (143 - 101) * (y / h))
        b = int(52 + (72 - 52) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
        
    # Draw soft glowing background accent circles
    accent = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    accent_draw = ImageDraw.Draw(accent)
    accent_draw.ellipse((w - 260, -80, w + 180, 360), fill=(255, 255, 255, 20))
    accent_draw.ellipse((-80, h - 220, 280, h + 140), fill=(255, 255, 255, 15))
    banner = Image.alpha_composite(banner, accent)

    # Place Hero image or logo
    if os.path.exists(LOGO_PATH):
        logo = Image.open(LOGO_PATH).convert("RGBA")
        target_w = 460
        scale = target_w / logo.width
        target_h = int(logo.height * scale)
        scaled_logo = logo.resize((target_w, target_h), Image.LANCZOS)
        
        pos_x = (w - target_w) // 2
        pos_y = 110
        banner.paste(scaled_logo, (pos_x, pos_y), scaled_logo)
        
    # Add Tagline text
    draw = ImageDraw.Draw(banner)
    tagline = "DOORSTEP LAUNDRY, DRY CLEANING & CAR SPA"
    sub_tagline = "Express 24-Hr Turnaround | 100% Eco-Safe Fabric Care"
    
    # Use default or fallback font
    try:
        font_large = ImageFont.truetype("arial.ttf", 26)
        font_small = ImageFont.truetype("arial.ttf", 18)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
        
    # Draw badge pill at bottom
    pill_w, pill_h = 660, 48
    pill_x = (w - pill_w) // 2
    pill_y = 390
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=24, fill=(255, 255, 255, 240))
    
    # Text in pill
    text_bbox = draw.textbbox((0, 0), tagline, font=font_large)
    text_w = text_bbox[2] - text_bbox[0]
    draw.text((pill_x + (pill_w - text_w) // 2, pill_y + 8), tagline, fill=(21, 128, 61), font=font_large)

    out_path = os.path.join(OUTPUT_DIR, "feature_graphic_1024x500.png")
    banner.save(out_path, "PNG", optimize=True)
    print(f"Created: {out_path} ({w}x{h})")

if __name__ == "__main__":
    create_app_icon()
    create_feature_graphic()
