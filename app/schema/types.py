from decimal import Decimal

import graphene
from graphene_django import DjangoObjectType, DjangoListField
from sorl.thumbnail import get_thumbnail

from app.models import Profile, Artwork, Auction, AuctionBid, Token


class InfoType(graphene.ObjectType):
    lof_price = graphene.Decimal()
    kyc_api = graphene.String()


class CondensedProfileType(DjangoObjectType):
    @staticmethod
    def resolve_avatar(profile, info):
        return info.context.build_absolute_uri(get_thumbnail(profile.avatar, '128x128', crop='center').url) if profile.avatar else None

    @staticmethod
    def resolve_cover(profile, info):
        return info.context.build_absolute_uri(profile.cover.url) if profile.cover else None

    class Meta:
        model = Profile
        fields = 'id', 'address', 'username', 'name', 'avatar', 'bio', 'cover', 'moderation_approved_by_default'


class AuctionBidType(DjangoObjectType):
    profile = graphene.Field(CondensedProfileType)

    class Meta:
        model = AuctionBid
        fields = 'id', 'profile', 'amount', 'won',


class AuctionType(DjangoObjectType):
    owner = graphene.Field(CondensedProfileType)
    last_bid = graphene.Field(AuctionBidType)
    bids = DjangoListField(AuctionBidType)
    token = graphene.Field('app.schema.types.TokenType')

    @staticmethod
    def resolve_last_bid(auction, info):
        return auction.bids.last()

    @staticmethod
    def resolve_bids(auction, info):
        return auction.bids.all()

    class Meta:
        model = Auction
        fields = 'id', 'owner', 'start_price', 'last_bid', 'state', 'bids',


class ArtworkType(DjangoObjectType):
    creator = graphene.Field(CondensedProfileType)
    preview = graphene.String()
    is_video_preview = graphene.Boolean()
    token_ids = graphene.List(graphene.Int)
    auctions = DjangoListField(AuctionType)
    preview_image = graphene.String()
    prices = graphene.List(graphene.Decimal)

    @staticmethod
    def resolve_preview(artwork, info):
        if artwork.censored_file:
            return info.context.build_absolute_uri(artwork.censored_file.url)

    @staticmethod
    def resolve_preview_image(artwork, info):
        if artwork.preview_image:
            return info.context.build_absolute_uri(get_thumbnail(artwork.preview_image, '500x500', crop='center').url)
        if artwork.censored_file:
            return info.context.build_absolute_uri(get_thumbnail(artwork.censored_file, '500x500', crop='center').url)

    @staticmethod
    def resolve_is_video_preview(artwork, info):
        return artwork.censored_video

    @staticmethod
    def resolve_token_ids(artwork, info):
        return artwork.tokens.values_list('token_id', flat=True)

    @staticmethod
    def resolve_auctions(artwork, info):
        return Auction.objects.filter(token__artwork=artwork, state=Auction.State.RUNNING)

    class Meta:
        model = Artwork
        fields = 'id', 'preview', 'is_video_preview', 'title', 'description', 'copies', 'creator', 'processed', \
                 'moderation_passed', 'minted', 'token_ids', 'auctions', 'preview_image', 'prices'


class ProfileArtworksType(graphene.ObjectType):
    created = DjangoListField(ArtworkType)
    collected = DjangoListField(ArtworkType)
    auctions = DjangoListField(ArtworkType)


class TokenType(DjangoObjectType):
    artwork = graphene.Field(ArtworkType)

    class Meta:
        model = Token
        fields = 'token_id', 'artwork', 'copy',


class ProfileType(DjangoObjectType):
    artworks = graphene.Field(ProfileArtworksType)
    claimable = DjangoListField(TokenType)

    @staticmethod
    def resolve_avatar(profile, info):
        return info.context.build_absolute_uri(get_thumbnail(profile.avatar, '128x128', crop='center').url) if profile.avatar else None

    @staticmethod
    def resolve_cover(profile, info):
        return info.context.build_absolute_uri(profile.cover.url) if profile.cover else None

    @staticmethod
    def resolve_email(profile, info):
        if info.context.profile == profile:
            return profile.email
        return None

    @staticmethod
    def resolve_balance_bnb(profile, info):
        if info.context.profile == profile:
            return profile.balance_bnb
        return Decimal(0)

    @staticmethod
    def resolve_balance_lof(profile, info):
        if info.context.profile == profile:
            return profile.balance_lof
        return Decimal(0)

    @staticmethod
    def resolve_artworks(profile, info):
        created_qs = Artwork.objects.filter(creator=profile)
        collected_qs = Artwork.objects.filter(tokens__owner__iexact=profile.address)

        if profile != info.context.profile:
            if dbProfile.moderation_approved_by_default==False:
                created_qs = created_qs.filter(moderation_passed=True)
                collected_qs = collected_qs.filter(moderation_passed=True)

        return {
            'created': created_qs,
            'collected': collected_qs.distinct(),
            'auctions': Artwork.objects.filter(tokens__auctions__in=Auction.objects.filter(owner=profile, state=Auction.State.RUNNING)).distinct(),
        }

    @staticmethod
    def resolve_claimable(profile, info):
        if profile != info.context.profile:
            return []
        claimable = profile.claimable_tokens.filter(claimed=False).values_list('token_id')
        return Token.objects.filter(token_id__in=claimable)

    class Meta:
        model = Profile
        fields = 'id', 'address', 'username', 'name', 'bio', 'avatar', 'cover', 'twitch', 'instagram', 'twitter',\
                 'onlyfans', 'verified', 'email', 'balance_bnb', 'balance_lof', 'artworks', 'claimable', 'block_creation', 'moderation_approved_by_default'


class IndexPageType(graphene.ObjectType):
    top_slider = DjangoListField(ArtworkType)
    live_auctions = DjangoListField(ArtworkType)
    featured_artworks = DjangoListField(ArtworkType)
    featured_creators = DjangoListField(CondensedProfileType)


class CreatorsIndexType(graphene.ObjectType):
    has_more = graphene.Boolean()
    items = DjangoListField(CondensedProfileType)


class ArtworksIndexType(graphene.ObjectType):
    has_more = graphene.Boolean()
    items = DjangoListField(ArtworkType)
