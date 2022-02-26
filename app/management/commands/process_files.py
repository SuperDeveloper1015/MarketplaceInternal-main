import logging
from pathlib import Path
from tempfile import TemporaryDirectory
from uuid import uuid4

import ffmpeg
from django.core.management import BaseCommand
from PIL import Image

from app.models import Artwork
from lofcrypto import settings


def resize_watermark(im: Image.Image, width: int, height: int):
    im_w, im_h = im.size
    if width < height:
        size_multiplier = (width / 4) / im_w
    else:
        size_multiplier = (height / 4) / im_h
    return im.resize((int(im_w * size_multiplier), int(im_h * size_multiplier)), Image.ANTIALIAS)


class Command(BaseCommand):
    def handle(self, *args, **options):
        while True:
            for artwork in Artwork.objects.filter(processed=False):  # type: Artwork
                wm = Image.open(settings.BASE_DIR / 'templates' / 'watermark.png')
                if not artwork.censored_file:
                    if artwork.original_video:
                        censored_filename = f'{uuid4()}.mp4'
                        thumbnail_filename = f'{uuid4()}.png'
                        probe = ffmpeg.probe(artwork.original_file.path)
                        video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
                        width = int(video_stream['width'])
                        height = int(video_stream['height'])
                        wm = resize_watermark(wm, width, height)
                        with TemporaryDirectory() as d:
                            wm.save(Path(d) / 'wm.png')
                            stream = ffmpeg.input(artwork.original_file.path)
                            stream = ffmpeg.trim(stream, start=0, end=3)
                            stream = ffmpeg.overlay(stream,
                                                    ffmpeg.input(str(Path(d) / 'wm.png')),
                                                    x=10,
                                                    y=height - wm.height - 10)
                            stream = ffmpeg.output(stream, str(Path(artwork.original_file.path).parent / censored_filename))
                            ffmpeg.run(stream)
                        artwork.censored_file = censored_filename
                        artwork.censored_video = True
                        stream = ffmpeg.input(str(Path(artwork.original_file.path).parent / censored_filename), ss=2.9)
                        stream = ffmpeg.output(stream, str(Path(artwork.original_file.path).parent / thumbnail_filename), vframes=1)
                        ffmpeg.run(stream)
                        artwork.preview_image = thumbnail_filename
                    else:
                        censored_filename = f'{uuid4()}.png'
                        im = Image.open(artwork.original_file.path)
                        wm = resize_watermark(wm, *im.size)
                        im.paste(wm, (10, im.height - wm.height - 10), wm)
                        im.save(Path(artwork.original_file.path).parent / censored_filename)
                        artwork.censored_file = censored_filename
                else:
                    if artwork.censored_video:
                        censored_filename = f'{uuid4()}.mp4'
                        thumbnail_filename = f'{uuid4()}.png'
                        probe = ffmpeg.probe(artwork.original_file.path)
                        video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
                        width = int(video_stream['width'])
                        height = int(video_stream['height'])
                        wm = resize_watermark(wm, width, height)
                        with TemporaryDirectory() as d:
                            wm.save(Path(d) / 'wm.png')
                            stream = ffmpeg.input(artwork.censored_file.path)
                            stream = ffmpeg.trim(stream, start=0, end=3)
                            stream = ffmpeg.overlay(stream,
                                                    ffmpeg.input(str(Path(d) / 'wm.png')),
                                                    x=10,
                                                    y=height - wm.height - 10)
                            stream = ffmpeg.output(stream, str(Path(artwork.censored_file.path).parent / censored_filename))
                            ffmpeg.run(stream)
                        artwork.censored_file = censored_filename
                        stream = ffmpeg.input(str(Path(artwork.censored_file.path).parent / censored_filename), ss=2.9)
                        stream = ffmpeg.output(stream, str(Path(artwork.original_file.path).parent / thumbnail_filename), vframes=1)
                        ffmpeg.run(stream)
                        artwork.preview_image = thumbnail_filename
                    else:
                        censored_filename = f'{uuid4()}.png'
                        im = Image.open(artwork.censored_file.path)
                        wm = resize_watermark(wm, *im.size)
                        im.paste(wm, (10, im.height - wm.height - 10), wm)
                        im.save(Path(artwork.censored_file.path).parent / censored_filename)
                        artwork.censored_file = censored_filename
                artwork.processed = True
                artwork.save()

                logging.warning(f'Artwork #{artwork.pk} processed')
