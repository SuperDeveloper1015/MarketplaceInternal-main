import graphene
from constance import config
from django.core.cache import cache
from django.db.models import Q, QuerySet
from django.utils.crypto import get_random_string
from graphql import GraphQLError

from app.models import Profile, Artwork, Auction
from app.schema.types import ProfileType, InfoType, ArtworkType, IndexPageType, CreatorsIndexType, ArtworksIndexType
from lofcrypto.decorators import login_required
from lofcrypto.utils import SumSub


class Query(graphene.ObjectType):
    profile = graphene.Field(ProfileType, search=graphene.String(required=True))
    nonce = graphene.String(required=True)
    deposit_address = graphene.String(required=True)
    info = graphene.Field(InfoType)
    kyc_token = graphene.String(required=True)
    artwork = graphene.Field(ArtworkType, id=graphene.String(required=True))
    index_page = graphene.Field(IndexPageType)
    creators_index = graphene.Field(CreatorsIndexType, q=graphene.String(), page=graphene.Int())
    artworks_index = graphene.Field(ArtworksIndexType, q=graphene.String(), auction=graphene.Boolean(), page=graphene.Int())

    @classmethod
    def resolve_profile(cls, root, info, search):
        try:
            if search.startswith('@'):
                return Profile.objects.filter(username__iexact=search[1:]).first()
            elif search.startswith('0x'):
                return Profile.objects.get(address__iexact=search)
            else:
                raise GraphQLError('Invalid creator query')
        except Profile.DoesNotExist:
            raise GraphQLError('Creator not found')

    @classmethod
    def resolve_nonce(cls, root, info):
        nonce = get_random_string(length=10)
        cache.set('nonce:{}'.format(nonce), 1)
        return nonce

    @classmethod
    @login_required
    def resolve_deposit_address(cls, root, info):
        return info.context.profile.wallet_address

    @classmethod
    def resolve_info(cls, root, info):
        return {
            'lof_price': config.LOF_PRICE,
            'kyc_api': SumSub.api_host(),
        }

    @classmethod
    @login_required
    def resolve_kyc_token(cls, root, info):
        return SumSub().get_access_token(info.context.profile)

    @classmethod
    def resolve_artwork(cls, root, info, id):
        return Artwork.objects.get(pk=id)

    @classmethod
    def resolve_index_page(cls, root, info):
        return {
            'top_slider': Artwork.objects.filter(top_slider=True)[:10],
            'live_auctions': Artwork.objects.filter(tokens__auctions__state=Auction.State.RUNNING).distinct()[:10],
            'featured_artworks': Artwork.objects.filter(featured=True)[:10],
            'featured_creators': Profile.objects.filter(featured=True)[:10],
        }

    @classmethod
    def resolve_creators_index(cls, root, info, q, page=0):
        print('creain', q, page)
        qs = Profile.objects.filter(Q(name__icontains=q) | Q(username__icontains=q) | Q(bio__icontains=q), username__isnull=False).distinct()
        count = qs.count()
        page_start = 24 * page
        page_end = 24 * (page + 1)
        return {
            'has_more': count > page_end,
            'items': qs[page_start:page_end],
        }

    @classmethod
    def resolve_artworks_index(cls, root, info, q, auction, page=0):
        qs = Artwork.objects.filter(Q(title__icontains=q) | Q(description__icontains=q))  # type: QuerySet[Artwork]
        if auction:
            qs = qs.filter(tokens__auctions__state=Auction.State.RUNNING)
        qs = qs.distinct()
        count = qs.count()
        page_start = 50 * page
        page_end = 50 * (page + 1)
        return {
            'has_more': count > page_end,
            'items': qs[page_start:page_end],
        }
