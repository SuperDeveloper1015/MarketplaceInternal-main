import json
from pprint import pprint

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views import View

from app.models import Profile, Token


def sumsub_endpoint(request: HttpRequest):
    print(request.headers)
    data = json.loads(request.body)
    user_id = data['externalUserId']
    profile = Profile.objects.get(pk=user_id)
    profile.verified = True
    profile.save()
    return HttpResponse('OK')


class MetaView(View):
    def get(self, request: HttpRequest, *args, **kwargs):
        token_id = kwargs['token_id']
        token = get_object_or_404(Token, token_id=token_id)
        artwork = token.artwork

        image = None
        if artwork.original_file:
            image = request.build_absolute_uri(artwork.original_file.url)

        return JsonResponse({
            'name': artwork.title,
            'description': artwork.description,
            'image': image,
            'external_url': request.build_absolute_uri('/artworks/{}'.format(artwork.id)),
            'attributes': {
                'id': artwork.id,
                'author': artwork.creator.name,
                'copy': token.copy,
                'total_copies': artwork.copies,
            }
        })
