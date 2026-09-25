# -*- coding: utf-8 -*-
"""
Apex Racing - asset build.

Takes the raw sources (team photo dumps, PDF-extracted logos, SolidWorks renders)
and writes optimised, correctly named files into public/assets/.

Run:  python tools/build_assets.py
Sources live outside the repo; see ASSET_MANIFEST.md for where each one came from.
"""
import os
import json
from PIL import Image, ImageFilter, ImageOps, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "assets")

SRC = {
    "zip": r"D:\Apex Site\_incoming\APEX MAIN ",
    "pdfimg": r"D:\Apex Site\_incoming\_pdfimg",
    "cut": r"C:\Users\Admin\AppData\Local\Temp\claude\D--Apex-Site\a6d99c8c-a738-46a1-96cc-5ece4815fde4\scratchpad\cut",
    "old": r"C:\Users\Admin\AppData\Local\Temp\claude\D--Apex-Site\a6d99c8c-a738-46a1-96cc-5ece4815fde4\scratchpad\oldsite\assets\img",
}


def ensure(*p):
    d = os.path.join(OUT, *p)
    os.makedirs(d, exist_ok=True)
    return d


def trim_alpha(im, pad=8):
    """Crop to the non-transparent bounding box, keeping a little breathing room."""
    bbox = im.split()[-1].getbbox()
    if not bbox:
        return im
    x0, y0, x1, y1 = bbox
    return im.crop((max(0, x0 - pad), max(0, y0 - pad),
                    min(im.width, x1 + pad), min(im.height, y1 + pad)))


def trim_white(im, thresh=248, pad=0):
    """Instagram exports carry white letterbox bars. Cut them off."""
    g = im.convert("L")
    mask = g.point(lambda v: 0 if v >= thresh else 255)
    bbox = mask.getbbox()
    if not bbox:
        return im
    x0, y0, x1, y1 = bbox
    return im.crop((max(0, x0 - pad), max(0, y0 - pad),
                    min(im.width, x1 + pad), min(im.height, y1 + pad)))


def save_webp(im, path, quality=82, widths=None):
    """
    Write one webp, or a responsive set when widths is given.

    Every requested width always gets a file, even when the source is smaller:
    the markup emits a fixed srcset, and a missing entry would 404.
    """
    if widths is None:
        im.save(path, "WEBP", quality=quality, method=6)
        return [path]
    base, _ = os.path.splitext(path)
    written = []
    for w in widths:
        target = min(w, im.width)
        r = im if target == im.width else im.resize(
            (target, round(im.height * target / im.width)), Image.LANCZOS)
        p = base + "-" + str(w) + ".webp"
        r.save(p, "WEBP", quality=quality, method=6)
        written.append(p)
    return written


def save_png(im, path):
    im.save(path, "PNG", optimize=True)
    return path


# ---------------------------------------------------------------- brand marks

def build_brand():
    d = ensure("brand")
    pdf = SRC["pdfimg"]

    # phoenix badge, red and orange on black, lifted from the 2026 proposal
    ph = Image.open(os.path.join(pdf, "prop2026z_p01_x59_602x602.png")).convert("RGBA")
    ph = ph.resize((512, 512), Image.LANCZOS)
    save_png(ph, os.path.join(d, "phoenix-badge.png"))
    for s in (32, 48, 180, 192):
        ph.resize((s, s), Image.LANCZOS).save(os.path.join(d, "phoenix-" + str(s) + ".png"), optimize=True)

    # same badge keyed off its black plate, for use over photography
    rgb = ph.convert("RGB")
    lum = rgb.convert("L").point(lambda v: min(255, int(v * 3.2)))
    tr = rgb.convert("RGBA")
    tr.putalpha(lum)
    save_png(trim_alpha(tr, 2), os.path.join(d, "phoenix-mark.png"))

    # APEX RACING wordmark, white on black
    wm = Image.open(os.path.join(pdf, "prop2026z_p01_x58_305x156.png")).convert("RGB")
    wm = wm.resize((wm.width * 3, wm.height * 3), Image.LANCZOS)
    lum = wm.convert("L")
    out = Image.new("RGBA", wm.size, (255, 255, 255, 255))
    out.putalpha(lum.point(lambda v: min(255, int(v * 1.35))))
    save_png(trim_alpha(out, 4), os.path.join(d, "wordmark.png"))

    # SSN institution mark, white on black
    ssn = Image.open(os.path.join(pdf, "prop2026z_p01_x61_252x109.png")).convert("RGB")
    ssn = ssn.resize((ssn.width * 4, ssn.height * 4), Image.LANCZOS)
    lum = ssn.convert("L")
    s = Image.new("RGBA", ssn.size, (255, 255, 255, 255))
    s.putalpha(lum.point(lambda v: min(255, int(v * 1.5))))
    save_png(trim_alpha(s, 4), os.path.join(d, "ssn.png"))

    # Razorpay QR, straight from the proposal
    qr = Image.open(os.path.join(pdf, "prop2026z_p01_x62_820x820.png")).convert("L")
    qr = ImageOps.autocontrast(qr).resize((640, 640), Image.NEAREST)
    save_png(qr.convert("RGB"), os.path.join(d, "razorpay-qr.png"))
    print("  brand ok")


# ---------------------------------------------------------------- kart art

def key_black(im, gain=1.0, floor=10):
    """SolidWorks renders sit on pure black. Luminance becomes alpha."""
    rgb = im.convert("RGB")
    lum = rgb.convert("L")
    span = 255 - floor
    a = lum.point(lambda v: 0 if v <= floor else min(255, int((v - floor) * (255 / span) * gain)))
    a = a.filter(ImageFilter.MedianFilter(3))
    out = rgb.convert("RGBA")
    out.putalpha(a)
    return out


def livery(im, nose_frac=None, tail_frac=None):
    """
    Give a bare CAD render the team livery: graphite frame, red at the nose,
    a warm gold cast where the number panel sits.
    """
    im = im.convert("RGBA")
    r, g, b, a = im.split()
    lum = Image.merge("RGB", (r, g, b)).convert("L")
    base = ImageOps.colorize(lum, black=(14, 14, 17), mid=(58, 60, 68), white=(214, 218, 228))
    out = base.convert("RGBA")
    out.putalpha(a)

    def band(frac, black, mid, white):
        y0, y1 = int(im.height * frac[0]), int(im.height * frac[1])
        if y1 <= y0:
            return
        strip = out.crop((0, y0, im.width, y1))
        col = ImageOps.colorize(strip.convert("L"), black=black, mid=mid, white=white).convert("RGBA")
        col.putalpha(strip.split()[-1])
        out.paste(col, (0, y0))

    if nose_frac:
        band(nose_frac, (38, 3, 3), (168, 12, 12), (255, 120, 100))
    if tail_frac:
        band(tail_frac, (24, 18, 6), (120, 90, 24), (240, 208, 130))
    return out


def build_kart():
    d = ensure("kart")
    pdf, cut = SRC["pdfimg"], SRC["cut"]

    # hero: our FKDC 2025 EV kart, cut out of a paddock photo
    hero = trim_alpha(Image.open(os.path.join(cut, "kart05_front.png")).convert("RGBA"), 6)
    save_webp(hero, os.path.join(d, "hero-kart.webp"), quality=86, widths=[480, 760, 1040])
    save_png(hero.resize((760, round(hero.height * 760 / hero.width)), Image.LANCZOS),
             os.path.join(d, "hero-kart.png"))

    # the IC era Precisio kart, for Career Mode
    pre = trim_alpha(Image.open(os.path.join(cut, "precisio.png")).convert("RGBA"), 6)
    save_webp(pre, os.path.join(d, "precisio.webp"), quality=84, widths=[520, 900, 1400])

    # driver on track, for the Replay cards
    act = trim_alpha(Image.open(os.path.join(cut, "kart09_action.png")).convert("RGBA"), 6)
    save_webp(act, os.path.join(d, "driver.webp"), quality=84, widths=[440, 760])

    # SolidWorks top view becomes the kart that drives down the page
    top = key_black(Image.open(os.path.join(pdf, "gokart_p04_x27_1095x1806.png")), gain=1.25, floor=14)
    top = livery(trim_alpha(top, 4), nose_frac=(0.0, 0.085), tail_frac=(0.62, 0.78))
    top.thumbnail((460, 760), Image.LANCZOS)
    save_png(top, os.path.join(d, "kart-top.png"))

    # side view for the Paddock livery board
    side = key_black(Image.open(os.path.join(pdf, "gokart_p02_x17_1807x897.png")), gain=1.2, floor=14)
    side = livery(trim_alpha(side, 4))
    side.thumbnail((1400, 800), Image.LANCZOS)
    save_png(side, os.path.join(d, "kart-side.png"))

    # isometric render for the Garage
    iso = key_black(Image.open(os.path.join(pdf, "gokart_p05_x32_1638x1035.png")), gain=1.2, floor=14)
    iso = livery(trim_alpha(iso, 4))
    iso.thumbnail((1320, 900), Image.LANCZOS)
    save_png(iso, os.path.join(d, "kart-iso.png"))
    print("  kart ok")


# ---------------------------------------------------------------- partners

PARTNERS = [
    ("atlaa-tech", "prop2026z_p01_x63_250x250.png"),
    ("sarvamangala", "prop2026z_p01_x64_551x130.png"),
    ("indra-foods", "prop2026z_p01_x65_448x231.png"),
    ("niyamita", "prop2026z_p01_x66_546x269.png"),
    ("jeeva-coffee", "prop2026z_p01_x68_410x356.png"),
    ("aditya", "prop2026z_p01_x70_372x328.png"),
    ("bharath", "prop2026z_p01_x71_410x277.png"),
]


def whiten_logo(im, size=(360, 200)):
    """
    Partner logos arrive as mixed light and dark rasters. Put each on a neutral
    white plate so they stay readable on our dark page, then centre it.
    """
    im = im.convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    im = trim_white(bg.convert("RGB"), thresh=250)
    im.thumbnail((size[0] - 24, size[1] - 24), Image.LANCZOS)
    plate = Image.new("RGB", size, (255, 255, 255))
    plate.paste(im, ((size[0] - im.width) // 2, (size[1] - im.height) // 2))
    return plate


def build_partners():
    d = ensure("partners")
    for slug, fn in PARTNERS:
        p = os.path.join(SRC["pdfimg"], fn)
        if not os.path.exists(p):
            print("  MISSING partner", slug)
            continue
        whiten_logo(Image.open(p)).save(os.path.join(d, slug + ".webp"), "WEBP", quality=90, method=6)
    # this one only survives on the old site
    extra = [("ibusinesslabs", os.path.join(SRC["old"], "sp5.png"))]
    for slug, p in extra:
        if os.path.exists(p):
            whiten_logo(Image.open(p)).save(os.path.join(d, slug + ".webp"), "WEBP", quality=90, method=6)
    print("  partners ok")


# ---------------------------------------------------------------- photography

GALLERY = [
    ("fkdc-kart-front", ("zip", "Comp\\1790347423207.png"), "garage",
     "The Apex Racing EV kart on its wheels in the FKDC paddock, number 05 on the nose plate."),
    ("fkdc-pit-work", ("zip", "Comp\\1790347396189.png"), "garage",
     "Three team members working on the steering column between sessions."),
    ("fkdc-wiring", ("zip", "Comp\\1790347385575.png"), "garage",
     "A team member routing the high voltage loom behind the battery box."),
    ("fkdc-welding", ("zip", "Comp\\1790347390499.png"), "garage",
     "Sparks off a grinder during a late chassis repair outside the shed."),
    ("fkdc-grid", ("zip", "Comp\\1790347399719.png"), "track",
     "The team gathered around the kart during scrutineering at Kari Motor Speedway."),
    ("fkdc-dusk", ("zip", "Comp\\1790347403162.png"), "track",
     "The kart silhouetted against a low sun at the end of a test day."),
    ("fkdc-driver-out", ("zip", "Comp\\1790347406689.png"), "track",
     "A driver in a full race suit and helmet beside the kart on track."),
    ("fkdc-paddock", ("zip", "Comp\\1790347416203.png"), "events",
     "Teams and spectators packed under the paddock awnings at FKDC."),
    ("fkdc-banner", ("zip", "Comp\\1790347380782.png"), "events",
     "The Apex Racing Team banner hung over the pit garage at FKDC 2025."),
    ("fkdc-crew", ("zip", "Comp\\1790347419857.png"), "crew",
     "The crew lined up in front of the pit lane after a session."),
    ("crew-pitwall", ("zip", "Follow up upload #1\\1790347240304.png"), "crew",
     "Team members piled together on the pit wall, laughing between runs."),
    ("crew-stand", ("zip", "Follow up upload #1\\1790347268991.png"), "crew",
     "Part of the crew sitting together at the circuit in team shirts."),
    ("driver-onboard", ("zip", "Follow up upload #2\\1790347287526.png"), "track",
     "Our driver mid corner, helmet up, hands crossed on the wheel."),
    ("skidpad-night", ("zip", "Follow up upload #2\\1790347299551.png"), "track",
     "The skid pad marked out with tyres, lit by a single floodlight at night."),
    ("kart-09-dark", ("zip", "Follow up #3\\1790347322563.png"), "garage",
     "Close crop of the number 09 panel on the kart nose, shot in near darkness."),
    ("driver-portrait", ("zip", "Follow up #3\\1790347326163.png"), "crew",
     "Black and white portrait of a driver in race overalls."),
    ("handshake", ("zip", "Follow up #3\\1790347329795.png"), "events",
     "Two team members shaking hands after a run, shot in black and white."),
    ("team-lineup", ("zip", "Follow up upload #4\\1790347333928.png"), "crew",
     "The full team gathered in front of the workshop with the kart."),
    ("garage-night", ("zip", "Follow up upload #4\\1790347337886.png"), "garage",
     "Work continuing on the kart under the shed roof late in the evening."),
    ("battery-fit", ("zip", "Follow up upload #4\\1790347341774.png"), "garage",
     "Several hands at once fitting hardware into the rear frame."),
    ("helmet-wheel", ("zip", "Follow up upload #4\\1790347345084.png"), "track",
     "A driver helmet and gloved hands on the steering wheel, seen from behind."),
    ("rolon-corner", ("zip", "Follow up upload #4\\1790347353494.png"), "track",
     "The kart on the far side of the circuit with the treeline behind it."),
    ("gkdc-kart", ("zip", "GKDC 2024\\1790346983134.png"), "events",
     "The kart on track at GKDC with the number board on its side pod."),
    ("gkdc-team", ("zip", "GKDC 2024\\1790346993551.png"), "events",
     "A large group of team members and volunteers under the GKDC paddock tent."),
    ("gkdc-garage", ("zip", "GKDC 2024\\1790347019855.png"), "garage",
     "The kart up on stands inside a corrugated workshop before the event."),
    ("gkdc-weld", ("zip", "GKDC 2024\\1790347024013.png"), "garage",
     "Welding sparks around the steering column during a build session."),
    ("ikr-team", ("zip", "IKR 2023\\1790347037924.png"), "events",
     "The IKR team photo with the kart, number 16, outside the college blocks."),
    ("ikr-build", ("zip", "IKR 2023\\1790347041688.png"), "garage",
     "The kart part built under a tarpaulin during the IKR season."),
    ("precisio-track", ("old", "IMG_4298.png"), "track",
     "The Precisio combustion kart, number 41, parked on the circuit apron."),
    ("precisio-pit", ("old", "IMG_2713.JPG"), "events",
     "The crew working on the Precisio kart in the pit garage."),
    ("precisio-grid", ("old", "IMG_3033.JPG"), "track",
     "Three karts side by side on track in front of the trackside hoardings."),
    ("precisio-crew", ("old", "IMG_2850 (1).JPG"), "crew",
     "The combustion era team crowded around the kart for a group photo."),
    ("cheque", ("pdfimg", "brochure_p10_x118_288x512.png"), "events",
     "Team members receiving a sponsorship cheque from a partner."),
    ("ssn-campus", ("pdfimg", "brochure_p13_x900_1959x1469.png"), "events",
     "A glass facade on the SSN College of Engineering campus."),
]


def build_gallery():
    d = ensure("gallery")
    meta = []
    for slug, (key, rel), tag, alt in GALLERY:
        p = os.path.join(SRC[key], rel)
        if not os.path.exists(p):
            print("  MISSING photo", slug, p)
            continue
        im = trim_white(Image.open(p).convert("RGB"), thresh=250)
        if max(im.size) > 2400:
            im.thumbnail((2400, 2400), Image.LANCZOS)
        save_webp(im, os.path.join(d, slug + ".webp"), quality=78, widths=[420, 860, 1440])
        meta.append({"slug": slug, "tag": tag, "alt": alt, "w": im.width, "h": im.height})
    os.makedirs(os.path.join(ROOT, "src", "content"), exist_ok=True)
    with open(os.path.join(ROOT, "src", "content", "gallery.json"), "w", encoding="utf8") as f:
        json.dump(meta, f, indent=2)
    print("  gallery ok (" + str(len(meta)) + " photos)")


# ---------------------------------------------------------------- engineering

TECH = [
    ("fea-front", "designrep_p03_x51_580x467.png"),
    ("fea-side", "designrep_p04_x59_580x467.png"),
    ("fea-rear", "designrep_p04_x61_580x467.png"),
    ("chassis-iso", "designrep_p02_x45_1408x717.png"),
    ("chassis-top", "designrep_p03_x50_1317x767.png"),
    ("ackermann", "designrep_p05_x73_499x416.png"),
    ("controller", "designrep_p07_x87_947x600.png"),
]


def build_tech():
    d = ensure("tech")
    for slug, fn in TECH:
        p = os.path.join(SRC["pdfimg"], fn)
        if not os.path.exists(p):
            print("  MISSING tech", slug)
            continue
        im = Image.open(p).convert("RGB")
        im.thumbnail((1200, 1200), Image.LANCZOS)
        im.save(os.path.join(d, slug + ".webp"), "WEBP", quality=80, method=6)
    print("  tech ok")


# ------------------------------------------------------------- share card

def build_og():
    """1200x630 card for WhatsApp, LinkedIn and X previews."""
    W, H = 1200, 630
    card = Image.new("RGB", (W, H), (8, 8, 10))

    # red floor glow behind the kart
    glow = Image.new("L", (W, H), 0)
    gd = ImageDraw.Draw(glow)
    gd.ellipse((W * 0.18, H * 0.58, W * 0.82, H * 1.15), fill=190)
    glow = glow.filter(ImageFilter.GaussianBlur(70))
    card = Image.composite(Image.new("RGB", (W, H), (150, 10, 10)), card, glow)

    # top light
    top = Image.new("L", (W, H), 0)
    ImageDraw.Draw(top).ellipse((-W * 0.2, -H * 0.7, W * 1.2, H * 0.55), fill=52)
    top = top.filter(ImageFilter.GaussianBlur(90))
    card = Image.composite(Image.new("RGB", (W, H), (255, 255, 255)), card, top)

    kart = Image.open(os.path.join(OUT, "kart", "hero-kart.png")).convert("RGBA")
    kart.thumbnail((int(W * 0.47), int(H * 0.84)), Image.LANCZOS)
    card.paste(kart, (W - kart.width - 40, H - kart.height - 24), kart)

    # scrim so the copy stays legible over the kart
    scrim = Image.new("L", (W, H), 0)
    ImageDraw.Draw(scrim).rectangle((0, 0, int(W * 0.56), H), fill=255)
    scrim = scrim.filter(ImageFilter.GaussianBlur(110))
    card = Image.composite(Image.new("RGB", (W, H), (7, 7, 9)), card, scrim.point(lambda v: int(v * 0.8)))

    wm = Image.open(os.path.join(OUT, "brand", "wordmark.png")).convert("RGBA")
    wm.thumbnail((330, 330), Image.LANCZOS)
    card.paste(wm, (64, 66), wm)

    def font(path, size):
        for p in (path, r"C:\Windows\Fonts\arialbd.ttf"):
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                continue
        return ImageFont.load_default()

    hud = font(r"C:\Windows\Fonts\ARIALNB.TTF", 21)
    big = font(r"C:\Windows\Fonts\ARIALNB.TTF", 64)

    d = ImageDraw.Draw(card)
    lines = [
        ("SSN COLLEGE OF ENGINEERING \u00B7 CHENNAI", (190, 190, 200)),
        ("P1 ACCELERATION \u00B7 FKDC 2025", (217, 162, 27)),
        ("6 kW PMSM \u00B7 60 V 120 Ah \u00B7 AISI 4130", (138, 138, 147)),
    ]
    y = 292
    for text, colour in lines:
        d.text((66, y), text, fill=colour, font=hud)
        y += 34

    d.rectangle((66, 414, 66 + 250, 418), fill=(209, 10, 10))
    d.text((66, 442), "ENGINEERED", fill=(244, 244, 245), font=big)
    d.text((66, 508), "BY STUDENTS.", fill=(244, 244, 245), font=big)

    card.save(os.path.join(OUT, "og.jpg"), "JPEG", quality=86, optimize=True)
    print("  og ok")


if __name__ == "__main__":
    print("building assets ->", OUT)
    build_brand()
    build_kart()
    build_partners()
    build_gallery()
    build_tech()
    build_og()
    print("done")
