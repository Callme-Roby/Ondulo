"""Generate src/assets/blobs.ts from the Billy SVGs exported from Figma.

Billy is drawn with react-native-svg so that his outline can ripple: the
body path is split into its Bézier anchors, which BillyBlob moves over time.
Run from the repo root: python3 scripts/figma-blobs.py
"""
import json
import re

BLOBS = {
    'blobHome': 'blob-home.svg',
    'blobMinimoi': 'blob-minimoi.svg',
    'blobStep': 'blob-step.svg',
    'blobLaunch': 'blob-launch.svg',
    'blobSplash': 'blob-splash.svg',
    # Day 1 on the home screen ("Premier pas" frames): thirsty, then hydrated
    'blobThirsty': 'blob-thirsty.svg',
    'blobHydrated': 'blob-hydrated.svg',
}


def attrs(tag):
    return dict(re.findall(r'([\w-]+)="([^"]*)"', tag))


def num(s):
    return float(s)


def parse_body(d):
    """M x y (C x1 y1 x2 y2 x y)+ Z → start point and cubic segments."""
    tokens = re.findall(r'[MCZ]|-?\d*\.?\d+(?:e-?\d+)?', d)
    assert tokens[0] == 'M' and tokens[-1] == 'Z', d[:40]
    values = [num(t) for t in tokens if t not in 'MCZ']
    start, rest = values[:2], values[2:]
    assert len(rest) % 6 == 0
    segments = [rest[i:i + 6] for i in range(0, len(rest), 6)]
    return start, segments


def convert(name, file):
    svg = open(f'assets/figma/{file}').read()
    root = attrs(re.search(r'<svg[^>]*>', svg).group(0))
    gradients = {}
    for m in re.finditer(r'<radialGradient([^>]*)>(.*?)</radialGradient>', svg, re.S):
        a = attrs(m.group(1))
        matrix = [num(v) for v in re.search(r'matrix\(([^)]*)\)', a['gradientTransform']).group(1).split()]
        stops = []
        for s in re.finditer(r'<stop([^>]*)/>', m.group(2)):
            sa = attrs(s.group(1))
            stops.append([num(sa.get('offset', '0')), sa['stop-color']])
        gradients[a['id']] = {'matrix': matrix, 'stops': stops}
    blur = re.search(r'stdDeviation="([\d.]+)"', svg)
    shadow = re.search(r'<feGaussianBlur[^>]*/>\s*<feComposite[^>]*/>\s*<feColorMatrix[^>]*values="([^"]*)"', svg)
    shadow_rgba = None
    if blur and shadow:
        v = [num(x) for x in shadow.group(1).split()]
        shadow_rgba = [round(v[4] * 255), round(v[9] * 255), round(v[14] * 255), v[18]]

    # Each drop-shadow filter: blur and colour
    filters = {}
    for m in re.finditer(r'<filter id="([^"]+)"(.*?)</filter>', svg, re.S):
        f_blur = re.search(r'stdDeviation="([\d.]+)"', m.group(2))
        f_color = re.search(r'<feComposite[^>]*/>\s*<feColorMatrix[^>]*values="([^"]*)"', m.group(2))
        if f_blur and f_color:
            v = [num(x) for x in f_color.group(1).split()]
            filters[m.group(1)] = {'blur': num(f_blur.group(1)),
                                   'rgba': [round(v[4] * 255), round(v[9] * 255), round(v[14] * 255), v[18]]}

    # Paths in document order, with the opacity and innermost filter of their groups
    paths = []
    group_opacity = [1.0]
    group_filter = [None]
    for m in re.finditer(r'<(/?)(g|path)\b([^>]*?)(/?)>', svg):
        closing, tag, raw, selfclosing = m.groups()
        if tag == 'g':
            if closing:
                group_opacity.pop()
                group_filter.pop()
            elif not selfclosing:
                ga = attrs(raw)
                group_opacity.append(group_opacity[-1] * num(ga.get('opacity', '1')))
                f = re.match(r'url\(#(.*)\)', ga.get('filter', ''))
                group_filter.append(f.group(1) if f else group_filter[-1])
        else:
            paths.append((attrs(raw), group_opacity[-1], group_filter[-1]))
    gradient_ds = {a['d'] for a, _, _ in paths if re.match(r'url\(#', a.get('fill', ''))}

    body = None
    body_d = None
    body_fill = None
    layers = []
    overlays = []
    stroke = None
    face = []
    for a, opacity, filter_id in paths:
        fill = a.get('fill', '')
        paint = re.match(r'url\(#(.*)\)', fill or a.get('stroke', ''))
        if paint:
            if body is None:
                body, body_d = parse_body(a['d']), a['d']
            if 'stroke' in a:
                stroke = {'gradient': paint.group(1), 'width': num(a['stroke-width'])}
            elif a['d'] == body_d:
                layers.append(paint.group(1))
            else:
                # A second outline on top of the body (the "Blob heureux" ripple)
                o_start, o_segments = parse_body(a['d'])
                overlays.append({'start': o_start, 'segments': o_segments,
                                 'gradient': paint.group(1), 'opacity': opacity})
        elif fill and a['d'] in gradient_ds:
            continue  # flat base colour under a gradient fill of the same shape
        elif body is None and not face and fill:
            # Plain-coloured body (the thirsty Billy is a translucent white blob)
            body, body_d = parse_body(a['d']), a['d']
            body_fill = {'color': fill, 'opacity': num(a.get('fill-opacity', '1'))}
            # Its own shadow shows through the translucent fill (that is what greys him)
            if filter_id in filters:
                body_fill['shadow'] = filters[filter_id]
        else:
            part = {'d': a['d'], 'fill': fill}
            if 'stroke' in a:
                part.update({'fill': fill or 'none', 'stroke': a['stroke'],
                             'strokeWidth': num(a.get('stroke-width', '1'))})
            face.append(part)
    start, segments = body
    shape = {
        'width': num(root['width']),
        'height': num(root['height']),
        'start': start,
        'segments': segments,
        'layers': [gradients[g] for g in layers],
        'stroke': stroke and {'width': stroke['width'], **gradients[stroke['gradient']]},
        'face': face,
        'shadow': shadow_rgba and {'blur': num(blur.group(1)), 'rgba': shadow_rgba},
    }
    # Only on the blobs that need them, so the other shapes stay as they were
    if body_fill:
        shape['fill'] = body_fill
    if overlays:
        shape['overlays'] = [{'start': o['start'], 'segments': o['segments'],
                              'opacity': o['opacity'], **gradients[o['gradient']]} for o in overlays]
    return shape


out = ['// Generated by scripts/figma-blobs.py from the Billy SVGs in assets/figma; do not edit.', '',
       "import type { BlobShape } from '../components/blobShape';", '']
for name, file in BLOBS.items():
    out.append(f'export const {name}: BlobShape = {json.dumps(convert(name, file))};')
    out.append('')
open('src/assets/blobs.ts', 'w').write('\n'.join(out))
