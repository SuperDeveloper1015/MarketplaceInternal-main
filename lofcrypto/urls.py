from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_file_upload.django import FileUploadGraphQLView

from app.views import sumsub_endpoint, MetaView

urlpatterns = [
    path('_meta/<int:token_id>', MetaView.as_view()),
    path('graphql', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    path('admin/', admin.site.urls),
    path('_sumsub_callback/', csrf_exempt(sumsub_endpoint)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
