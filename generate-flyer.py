#!/usr/bin/env python3
"""Generate a promotional PDF flyer for Make It Funny Tour"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image
import os

# Page setup
WIDTH, HEIGHT = letter  # 8.5 x 11 inches
OUTPUT = "make-it-funny-flyer.pdf"
IMG_DIR = "images"

# Colors
BG = HexColor("#0a0a0a")
ACCENT = HexColor("#ff3c00")
ACCENT_DIM = HexColor("#ff6b3d")
TEXT = HexColor("#f0f0f0")
TEXT_DIM = HexColor("#888888")
CARD_BG = HexColor("#161616")
BORDER = HexColor("#222222")

def draw_rounded_rect(c, x, y, w, h, r, fill=None, stroke=None):
    """Draw a rounded rectangle"""
    p = c.beginPath()
    p.moveTo(x + r, y)
    p.lineTo(x + w - r, y)
    p.arcTo(x + w - r, y, x + w, y + r, r)
    p.lineTo(x + w, y + h - r)
    p.arcTo(x + w, y + h - r, x + w - r, y + h, r)
    p.lineTo(x + r, y + h)
    p.arcTo(x + r, y + h, x, y + h - r, r)
    p.lineTo(x, y + r)
    p.arcTo(x, y + r, x + r, y, r)
    p.close()
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.drawPath(p, fill=1 if fill else 0, stroke=1 if stroke else 0)
    else:
        c.drawPath(p, fill=1 if fill else 0, stroke=0)

def add_circular_image(c, img_path, cx, cy, radius):
    """Add a circular cropped image"""
    try:
        img = Image.open(img_path)
        # Make square crop from center
        w, h = img.size
        size = min(w, h)
        left = (w - size) // 2
        top = (h - size) // 2
        img = img.crop((left, top, left + size, top + size))
        img = img.resize((300, 300), Image.LANCZOS)

        # Create circular mask
        from PIL import ImageDraw
        mask = Image.new("L", (300, 300), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, 300, 300), fill=255)

        # Apply mask
        output = Image.new("RGBA", (300, 300), (0, 0, 0, 0))
        img = img.convert("RGBA")
        output.paste(img, (0, 0), mask)

        # Save temp and draw
        temp_path = "/tmp/circular_temp.png"
        output.save(temp_path)

        img_reader = ImageReader(temp_path)
        diameter = radius * 2
        c.drawImage(img_reader, cx - radius, cy - radius, diameter, diameter, mask='auto')
        os.remove(temp_path)
    except Exception as e:
        # Draw placeholder circle
        c.setFillColor(HexColor("#1a1a1a"))
        c.circle(cx, cy, radius, fill=1, stroke=0)

def generate_flyer():
    c = canvas.Canvas(OUTPUT, pagesize=letter)

    # === BACKGROUND ===
    c.setFillColor(BG)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)

    # === ACCENT LINE AT TOP ===
    c.setFillColor(ACCENT)
    c.rect(0, HEIGHT - 6, WIDTH, 6, fill=1, stroke=0)

    # === HEADER AREA ===
    y = HEIGHT - 50

    # "YOUR SENSITIVITY TESTED" small tag
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(WIDTH / 2, y, "YOUR SENSITIVITY TESTED PRESENTS")

    # Main title
    y -= 55
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 52)
    c.drawCentredString(WIDTH / 2, y, "MAKE IT")

    y -= 55
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 52)
    c.drawCentredString(WIDTH / 2, y, "FUNNY")

    # Decorative line
    y -= 20
    c.setStrokeColor(ACCENT)
    c.setLineWidth(2)
    line_w = 80
    c.line(WIDTH / 2 - line_w, y, WIDTH / 2 + line_w, y)

    # Date & Time
    y -= 30
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(WIDTH / 2, y, "FRIDAY, APRIL 25, 2026")

    y -= 22
    c.setFillColor(TEXT_DIM)
    c.setFont("Helvetica", 12)
    c.drawCentredString(WIDTH / 2, y, "6:30 PM \u2013 8:00 PM EST")

    # Venue
    y -= 22
    c.setFillColor(ACCENT_DIM)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(WIDTH / 2, y, "5501 Gulf Blvd, St Pete Beach, FL 33706")

    # === LINEUP SECTION ===
    y -= 40
    c.setFillColor(TEXT_DIM)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(WIDTH / 2, y, "\u2014\u2014\u2014  THE LINEUP  \u2014\u2014\u2014")

    # Artist data
    artists = [
        ("Pritesh Damani", "CTO by day. No approval needed by night.", "pritesh.png"),
        ("Andrey Polston", "Homeless. Nothing to lose up there.", "andrey.png"),
        ("Rahul Gupta", "Real estate mogul. Still gets roasted.", "rahul.jpeg"),
        ("David Caruso", "DalMoro's owner. Fresh pasta, zero filter.", None),
        ("James Garner", "Just trying his luck. More guts than you.", "james.jpeg"),
        ("Abby Ritchie", "Retired attorney. Jokes till Jesus calls.", "abby.png"),
        ("Rahul Bhalla", "Surgeon. Empty nester. Found a mic instead.", "rahulbhalla.JPG"),
    ]

    # Layout: 4 columns x 2 rows
    cols = 4
    rows = 2
    card_w = 125
    card_h = 160
    img_radius = 30
    gap_x = 12
    gap_y = 12

    total_w = cols * card_w + (cols - 1) * gap_x
    start_x = (WIDTH - total_w) / 2

    y -= 25  # top of first row

    for i, (name, bio, img_file) in enumerate(artists):
        col = i % cols
        row = i // cols

        cx = start_x + col * (card_w + gap_x)
        cy = y - row * (card_h + gap_y)

        # Card background
        draw_rounded_rect(c, cx, cy - card_h, card_w, card_h, 10, fill=CARD_BG, stroke=BORDER)

        # Circular photo
        img_cx = cx + card_w / 2
        img_cy = cy - 10 - img_radius

        if img_file:
            img_path = os.path.join(IMG_DIR, img_file)
            if os.path.exists(img_path):
                add_circular_image(c, img_path, img_cx, img_cy, img_radius)
            else:
                c.setFillColor(HexColor("#1a1a1a"))
                c.circle(img_cx, img_cy, img_radius, fill=1, stroke=0)
                c.setFillColor(TEXT_DIM)
                c.setFont("Helvetica-Bold", 18)
                initials = "".join(w[0] for w in name.split())
                c.drawCentredString(img_cx, img_cy - 6, initials)
        else:
            # Placeholder with initials
            c.setFillColor(HexColor("#1a1a1a"))
            c.circle(img_cx, img_cy, img_radius, fill=1, stroke=0)
            c.setStrokeColor(BORDER)
            c.setLineWidth(1)
            c.circle(img_cx, img_cy, img_radius, fill=0, stroke=1)
            c.setFillColor(TEXT_DIM)
            c.setFont("Helvetica-Bold", 18)
            initials = "".join(w[0] for w in name.split())
            c.drawCentredString(img_cx, img_cy - 6, initials)

        # Name
        name_y = img_cy - img_radius - 16
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 9.5)
        c.drawCentredString(img_cx, name_y, name)

        # Bio
        bio_y = name_y - 12
        c.setFillColor(TEXT_DIM)
        c.setFont("Helvetica", 6.5)
        # Word wrap bio into card width
        words = bio.split()
        lines = []
        current_line = ""
        for word in words:
            test = current_line + " " + word if current_line else word
            if c.stringWidth(test, "Helvetica", 6.5) < card_w - 16:
                current_line = test
            else:
                lines.append(current_line)
                current_line = word
        if current_line:
            lines.append(current_line)

        for j, line in enumerate(lines[:2]):
            c.drawCentredString(img_cx, bio_y - j * 11, line)

    # === BOTTOM SECTION ===
    bottom_y = y - rows * (card_h + gap_y) - 20

    # Tagline
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 13)
    c.drawCentredString(WIDTH / 2, bottom_y, "One night. No filter. No safety net.")

    bottom_y -= 18
    c.setFillColor(TEXT_DIM)
    c.setFont("Helvetica", 10)
    c.drawCentredString(WIDTH / 2, bottom_y, "Just us and a microphone.")

    # Website
    bottom_y -= 35
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(WIDTH / 2, bottom_y, "yoursensitivitytested.com")

    # Small footer
    bottom_y -= 20
    c.setFillColor(TEXT_DIM)
    c.setFont("Helvetica", 8)
    c.drawCentredString(WIDTH / 2, bottom_y, "We're not professional comedians. We just don't care.")

    # === ACCENT LINE AT BOTTOM ===
    c.setFillColor(ACCENT)
    c.rect(0, 0, WIDTH, 6, fill=1, stroke=0)

    c.save()
    print(f"Flyer saved to {OUTPUT}")

if __name__ == "__main__":
    generate_flyer()
