from decimal import Decimal

import graphene
import jwt
import magic
from constance import config
from django.conf import settings
from eth_account.messages import encode_defunct
from graphene_file_upload.scalars import Upload
from graphql import GraphQLError
from web3 import Web3

from app.dynamic_preferences_registry import Collected5, Collected10
from app.models import Profile, WithdrawRequest, Artwork, Token, Auction, AuctionBid, ClaimableToken
from app.schema.types import ProfileType, ArtworkType
from lofcrypto.crypto import ethereum, ADDRESSES
from lofcrypto.decorators import login_required
from lofcrypto.utils import validate_nonce, global_preferences


class SignInMutation(graphene.Mutation):
    class Arguments:
        nonce = graphene.String(required=True)
        signature = graphene.String(required=True)

    token = graphene.String()

    @classmethod
    def mutate(cls, root, info, nonce, signature):
        validate_nonce(nonce)
        address = ethereum.recover_message('SignIn:{}'.format(nonce), signature)
        token = jwt.encode({'address': address}, settings.SECRET_KEY, algorithm="HS256").decode()
        Profile.objects.get_or_create(address=ethereum.web3.toChecksumAddress(address), defaults={'name': ''})
        return SignInMutation(token=token)


class UpdateProfileMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        username = graphene.String()
        email = graphene.String()
        bio = graphene.String()
        twitch = graphene.String()
        instagram = graphene.String()
        twitter = graphene.String()
        onlyfans = graphene.String()
        avatar = Upload()
        remove_avatar = graphene.Boolean()
        cover = Upload()
        remove_cover = graphene.Boolean()

    profile = graphene.Field(ProfileType, required=True)

    @classmethod
    @login_required
    def mutate(cls, root, info, name, username, email, bio, twitch, instagram, twitter, onlyfans, remove_avatar, remove_cover, avatar=None, cover=None):
        address = info.context.profile.address
        if username and username.lower() == 'me':
            raise GraphQLError('Invalid username')
        if Profile.objects.filter(username__iexact=username).exclude(address__iexact=address).exists():
            raise GraphQLError('Username is already in use')
        if Profile.objects.filter(email__iexact=email).exclude(address__iexact=address).exists():
            raise GraphQLError('Email is already in use')

        profile, _ = Profile.objects.get_or_create(address=address)
        profile.name = name
        profile.username = username or None
        profile.email = email or None
        profile.bio = bio or None
        profile.twitch = twitch or None
        profile.instagram = instagram or None
        profile.twitter = twitter or None
        profile.onlyfans = onlyfans or None
        if remove_avatar:
            profile.avatar = None
        elif avatar:
            profile.avatar = avatar
        if remove_cover:
            profile.cover = None
        elif cover:
            profile.cover = cover
        profile.save()
        return UpdateProfileMutation(profile=profile)


class RequestWithdrawMutation(graphene.Mutation):
    class Arguments:
        amount = graphene.Decimal(required=True)
        currency = graphene.String(required=True)
        address = graphene.String(required=True)

    ok = graphene.Boolean()

    @classmethod
    @login_required
    def mutate(cls, root, info, amount, currency, address):
        profile = info.context.profile

        if not ethereum.validate_address(address):
            raise GraphQLError('Invalid address')

        if currency == 'bnb':
            if amount > profile.balance_bnb:
                raise GraphQLError('Insufficient balance')
            if amount <= 0:
                raise GraphQLError('Invalid amount')
            profile.balance_bnb -= amount
            profile.save(update_fields=('balance_bnb',))
        elif currency == 'lof':
            if amount > profile.balance_lof:
                raise GraphQLError('Insufficient balance')
            if amount <= 0:
                raise GraphQLError('Invalid amount')
            profile.balance_lof -= amount
            profile.save(update_fields=('balance_lof',))
        WithdrawRequest.objects.create(profile=profile, amount=amount, currency=currency,
                                       address=ethereum.normalize_address(address))
        return RequestWithdrawMutation(ok=True)


class SwapMutation(graphene.Mutation):
    class Arguments:
        amount = graphene.Decimal(required=True)

    ok = graphene.Boolean()

    @classmethod
    @login_required
    def mutate(cls, root, info, amount):
        profile = info.context.profile

        bnb_amount = amount * config.LOF_PRICE
        if profile.balance_bnb < bnb_amount:
            raise GraphQLError('Insufficient funds')
        if amount <= 0:
            raise GraphQLError('Invalid amount')
        profile.balance_bnb -= bnb_amount
        profile.balance_lof += amount
        profile.save(update_fields=('balance_bnb', 'balance_lof'))
        return SwapMutation(ok=True)


class CreateArtworkMutation(graphene.Mutation):
    class Arguments:
        original_file = Upload(required=True)
        censored_file = Upload()
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        copies = graphene.Int(required=True)

    artwork = graphene.Field(ArtworkType)

    @classmethod
    @login_required
    def mutate(cls, root, info, original_file, title, description, copies, censored_file=None):
        original_type = magic.from_buffer(original_file.read(1024), mime=True)
        if original_type not in ['image/jpeg', 'image/png', 'image/gif', 'video/mp4']:
            raise GraphQLError('Invalid original file was uploaded')
        original_video = original_type.startswith('video')
        if original_file.size > ((20 if original_video else 8) * 10**20):
            raise GraphQLError('Original file size exceeds 10 MB')

        censored_video = False
        if censored_file:
            censored_type = magic.from_buffer(censored_file.read(1024), mime=True)
            if censored_type not in ['image/jpeg', 'image/png', 'image/gif', 'video/mp4']:
                raise GraphQLError('Invalid censored file was uploaded')
            censored_video = censored_type.startswith('video')
            if censored_file.size > ((20 if censored_video else 8) * 10**20):
                raise GraphQLError('Censored file size exceeds 10 MB')

        profile = info.context.profile

        if profile.block_creation:
            raise GraphQLError('You are not allowed to create artworks')

        artwork = Artwork.objects.create(creator=profile, original_file=original_file, censored_file=censored_file,
                                         title=title, description=description, copies=copies,
                                         original_video=original_video, censored_video=censored_video, moderation_passed=profile.moderation_approved_by_default)
        return cls(artwork=artwork)


class DeleteArtworkMutation(graphene.Mutation):
    class Arguments:
        artwork_id = graphene.ID()

    ok = graphene.Boolean()

    @classmethod
    @login_required
    def mutate(cls, root, info, artwork_id):
        try:
            artwork = Artwork.objects.get(creator=info.context.profile, minted=False, pk=artwork_id)
        except:
            raise GraphQLError('Artwork does not exist or is already minted')
        artwork.delete()
        return cls(ok=True)


class MintMutation(graphene.Mutation):
    class Arguments:
        artwork = graphene.ID()

    args = graphene.List(graphene.String)

    @classmethod
    @login_required
    def mutate(cls, root, info, artwork):
        try:
            artwork = Artwork.objects.get(pk=artwork, creator=info.context.profile, minted=False)
        except Artwork.DoesNotExist:
            raise GraphQLError('Artwork does not exist or is not mintable')

        uuid = '0x' + artwork.uuid.hex
        h = Web3.soliditySha3(['address', 'uint256', 'bytes32', 'address'], [artwork.creator.address, artwork.copies, uuid.ljust(66, '0'), ADDRESSES['nft']])
        msg = encode_defunct(h)
        signed = Web3().eth.account.sign_message(msg, config.SIGNER_PK)
        return cls(args=[str(artwork.copies), uuid, signed.signature.hex()])


class StartAuctionMutation(graphene.Mutation):
    class Arguments:
        token_id = graphene.Int()
        start_price = graphene.Decimal()

    ok = graphene.Boolean()

    @classmethod
    @login_required
    def mutate(cls, root, info, token_id, start_price):
        try:
            token = Token.objects.get(token_id=token_id)
        except Token.DoesNotExist:
            raise GraphQLError('Token not found')
        if start_price < 0:
            raise GraphQLError('Invalid starting price')
        Auction.objects.create(token=token, owner=info.context.profile, start_price=start_price)
        return cls(ok=True)


class PlaceBidMutation(graphene.Mutation):
    class Arguments:
        auction_id = graphene.Int()
        amount = graphene.Decimal()

    ok = graphene.Boolean()

    @classmethod
    @login_required
    def mutate(cls, root, info, auction_id, amount):
        try:
            auction = Auction.objects.get(pk=auction_id, state=Auction.State.RUNNING)
        except Auction.DoesNotExist:
            raise GraphQLError('Auction not found')
        profile = info.context.profile
        if profile == auction.owner:
            raise GraphQLError('Cannot bid on own auction')
        last_bid = auction.bids.last()  # type: AuctionBid
        if last_bid and amount <= last_bid.amount or not last_bid and amount < auction.start_price:
            raise GraphQLError('Amount should be more than current bid')
        if amount <= 0:
            raise GraphQLError('Invalid amount')
        if amount > profile.balance_lof:
            raise GraphQLError('Insufficient funds')
        if last_bid:
            last_bid.profile.balance_lof += last_bid.amount
            last_bid.profile.save(update_fields=('balance_lof',))
        profile.balance_lof -= amount
        profile.save(update_fields=('balance_lof',))
        AuctionBid.objects.create(auction=auction, amount=amount, profile=profile)
        return cls(ok=True)


class CloseAuctionMutation(graphene.Mutation):
    class Arguments:
        auction_id = graphene.Int()

    ok = graphene.Boolean()

    @classmethod
    @login_required
    def mutate(cls, root, info, auction_id):
        try:
            auction = Auction.objects.get(pk=auction_id, state=Auction.State.RUNNING)
        except Auction.DoesNotExist:
            raise GraphQLError('Auction not found')
        profile = info.context.profile
        if profile != auction.owner:
            raise GraphQLError('Cannot close not owned auction')
        last_bid = auction.bids.last()  # type: AuctionBid
        if last_bid:
            last_bid.won = True
            last_bid.save(update_fields=('won',))
            ClaimableToken.objects.create(profile=last_bid.profile, token_id=auction.token.token_id)
            global_preferences[Collected5.key()] += last_bid.amount * Decimal('.05')
            global_preferences[Collected10.key()] += last_bid.amount * Decimal('.1')
            auction.owner.balance_lof += last_bid.amount * Decimal('.7')
            auction.owner.save()
            auction.token.artwork.creator.balance_lof += last_bid.amount * Decimal('.15')
            auction.token.artwork.creator.save()
        else:
            ClaimableToken.objects.create(profile=auction.owner, token_id=auction.token.token_id)
        auction.state = Auction.State.FINISHED
        auction.save(update_fields=('state',))
        return cls(ok=True)


class ClaimTokenMutation(graphene.Mutation):
    class Arguments:
        token_id = graphene.Int()

    args = graphene.List(graphene.String)

    @classmethod
    @login_required
    def mutate(cls, root, info, token_id):
        token = ClaimableToken.objects.filter(profile=info.context.profile, claimed=False, token_id=token_id).first()
        if not token:
            raise GraphQLError('Token was not found')

        h = Web3.soliditySha3(['address', 'uint256', 'address'], [info.context.profile.address, token.token_id, ADDRESSES['storage']])
        msg = encode_defunct(h)
        signed = Web3().eth.account.sign_message(msg, config.SIGNER_PK)
        return cls(args=[str(token.token_id), signed.signature.hex()])

class MintedTokensByArtworkMutation(graphene.Mutation):
    class Arguments:
        artwork = graphene.Int()
        minted_tokens = graphene.List(graphene.Int)
    ok = graphene.Boolean()
    @classmethod
    @login_required
    def mutate(cls, root, info, artwork, minted_tokens):
        artwork_object = Artwork.objects.get(pk=artwork)
        index = 1
        for token in minted_tokens:
            token_id = Token.objects.create(token_id= token,artwork_id=artwork_object.pk, owner=artwork_object.creator.pk, copy=index)
            index+=1

class Mutation(graphene.ObjectType):
    sign_in = SignInMutation.Field()
    update_profile = UpdateProfileMutation.Field()
    request_withdraw = RequestWithdrawMutation.Field()
    swap = SwapMutation.Field()
    create_artwork = CreateArtworkMutation.Field()
    delete_artwork = DeleteArtworkMutation.Field()
    mint = MintMutation.Field()
    start_auction = StartAuctionMutation.Field()
    close_auction = CloseAuctionMutation.Field()
    claim_token = ClaimTokenMutation.Field()
    place_bid = PlaceBidMutation.Field()
    minted_tokens = MintedTokensByArtworkMutation.Field()
