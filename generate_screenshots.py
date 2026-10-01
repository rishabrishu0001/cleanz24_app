import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = "playstore_assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

LOGO_PATH = "public/images/cleanz24_logo.jpg"
HERO_PATH = "public/images/hero.jpg"
STORE_PATH = "public/images/storefront_hero.jpg"
DRY_PATH = "public/images/drycleaning.jpg"

def create_phone_screenshot(filename, title, subtitle, img_path, feature_badges):
    w, h = 1080, 1920
    canvas = Image.new("RGBA", (w, h), (249, 250, 251, 255))
    draw = ImageDraw.Draw(canvas)
    
    # 1. Top Header Banner
    header_h = 380
    for y in range(header_h):
        r = int(22 + (47 - 22) * (y / header_h))
        g = int(101 + (143 - 101) * (y / header_h))
        b = int(52 + (72 - 52) * (y / header_h))
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
        
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 52)
        font_sub = ImageFont.truetype("arial.ttf", 34)
        font_card_title = ImageFont.truetype("arialbd.ttf", 36)
        font_badge = ImageFont.truetype("arialbd.ttf", 28)
    except:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_card_title = ImageFont.load_default()
        font_badge = ImageFont.load_default()
        
    # Draw title and subtitle in header
    tb = draw.textbbox((0, 0), title, font=font_title)
    draw.text(((w - (tb[2] - tb[0])) // 2, 130), title, fill=(255, 255, 255), font=font_title)
    
    sb = draw.textbbox((0, 0), subtitle, font=font_sub)
    draw.text(((w - (sb[2] - sb[0])) // 2, 220), subtitle, fill=(220, 252, 231), font=font_sub)
    
    # 2. Main Visual Card (Phone app preview)
    card_x, card_y, card_w, card_h = 70, 340, 940, 1480
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=36, fill=(255, 255, 255), outline=(229, 231, 235), width=3)
    
    # Top bar inside card
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + 110], radius=36, fill=(240, 253, 244))
    draw.rectangle([card_x, card_y + 70, card_x + card_w, card_y + 110], fill=(240, 253, 244))
    
    # Brand logo inside card header
    if os.path.exists(LOGO_PATH):
        lg = Image.open(LOGO_PATH).convert("RGBA")
        lg_w = 260
        lg_h = int(lg.height * (lg_w / lg.width))
        lg = lg.resize((lg_w, lg_h), Image.LANCZOS)
        canvas.paste(lg, (card_x + 40, card_y + 25), lg)
        
    # Image in card body
    if img_path and os.path.exists(img_path):
        photo = Image.open(img_path).convert("RGBA")
        pw = card_w - 60
        ph = 640
        photo = photo.resize((pw, ph), Image.LANCZOS)
        canvas.paste(photo, (card_x + 30, card_y + 140))
        
    # Feature Badges
    badge_start_y = card_y + 830
    for idx, (b_title, b_desc) in enumerate(feature_badges):
        by = badge_start_y + (idx * 180)
        draw.rounded_rectangle([card_x + 40, by, card_x + card_w - 40, by + 140], radius=24, fill=(249, 250, 251), outline=(229, 231, 235), width=2)
        # Green icon circle
        draw.ellipse([card_x + 65, by + 35, card_x + 135, by + 105], fill=(34, 197, 94))
        draw.text((card_x + 88, by + 45), "✓", fill=(255, 255, 255), font=font_card_title)
        
        draw.text((card_x + 160, by + 30), b_title, fill=(17, 24, 39), font=font_card_title)
        draw.text((card_x + 160, by + 78), b_desc, fill=(107, 114, 128), font=font_badge)

    out_file = os.path.join(OUTPUT_DIR, filename)
    canvas.save(out_file, "PNG", optimize=True)
    print(f"Created screenshot: {out_file}")

create_phone_screenshot(
    "screenshot_1_home.png",
    "Doorstep Laundry & Car Spa",
    "Book In 60 Seconds | Delivered in 24 Hours",
    STORE_PATH,
    [
        ("Wash, Fold & Steam Ironing", "Everyday apparel cleaned with eco-friendly care"),
        ("Live Order Status Tracking", "Real-time updates from pickup to doorstep drop-off"),
        ("Authorized Studio Valets", "100% verified pickup & contactless doorstep delivery")
    ]
)

create_phone_screenshot(
    "screenshot_2_services.png",
    "Professional Fabric Care",
    "Suits, Sarees, Blankets & Shoes",
    DRY_PATH,
    [
        ("Dry Cleaning for Delicate Fabrics", "Specialized German organic solvent care for luxury wear"),
        ("Shoe Spa & Leather Detailing", "Deep cleaning and conditioning for all footwear"),
        ("Heavy Blankets & Curtains", "Antibacterial deep steam cleaning and sanitized packing")
    ]
)

create_phone_screenshot(
    "screenshot_3_carspa.png",
    "Doorstep Premium Car Spa",
    "High-Pressure Foam Wash & Interior Detailing",
    HERO_PATH,
    [
        ("Exterior Foam Wash & Wax", "Scratch-free wash with high gloss polymer finish"),
        ("Interior Deep Sanitization", "Vacuuming, dashboard polish, and upholstery freshening"),
        ("Waterless & Eco Solutions", "Environment-friendly care at your parking spot")
    ]
)
