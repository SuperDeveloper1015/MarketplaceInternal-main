from uuid import uuid4

from django.db import models
from django.db.models import TextChoices, Min, Max, F
from django.db.models.functions import Coalesce
from eth_account import Account

from app.options import InternalOptions
from lofcrypto.crypto import ethereum


internal_options = InternalOptions()


class WithdrawCurrency(TextChoices):
    BNB = 'bnb'
    LOF = 'lof'


class Profile(models.Model):
    address = models.CharField(max_length=64, db_index=True)
    username = models.CharField(max_length=128, db_index=True, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    name = models.TextField()
    bio = models.TextField(null=True, blank=True)
    avatar = models.ImageField(null=True, blank=True)
    cover = models.ImageField(null=True, blank=True)
    twitch = models.CharField(max_length=64, null=True, blank=True)
    instagram = models.CharField(max_length=64, null=True, blank=True)
    twitter = models.CharField(max_length=64, null=True, blank=True)
    onlyfans = models.CharField(max_length=64, null=True, blank=True)
    verified = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    block_creation = models.BooleanField(default=False)
    moderation_approved_by_default = models.BooleanField(default=False)
    _wallet_pk = models.BinaryField(null=True, blank=True)
    _wallet_address = models.CharField(max_length=64, null=True, blank=True)
    balance_lof = models.DecimalField(default=0, max_digits=64, decimal_places=18)
    balance_bnb = models.DecimalField(default=0, max_digits=64, decimal_places=18)

    def _generate_wallet(self):
        self._wallet_pk = ethereum.create_pk()
        self._wallet_address = Account.from_key(self._wallet_pk).address
        self.save(update_fields=('_wallet_pk', '_wallet_address'))

    @property
    def wallet_pk(self):
        if not self._wallet_pk:
            self._generate_wallet()
        return self._wallet_pk

    @property
    def wallet_address(self):
        if not self._wallet_address:
            self._generate_wallet()
        return self._wallet_address

    def __str__(self):
        return self.name


class WithdrawRequest(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    amount = models.DecimalField(default=0, max_digits=64, decimal_places=18)
    currency = models.CharField(max_length=3, choices=WithdrawCurrency.choices)
    address = models.CharField(max_length=64)
    datetime = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(null=True)
    txid = models.CharField(max_length=66, null=True, blank=True)


class Artwork(models.Model):
    uuid = models.UUIDField(default=uuid4)
    minted = models.BooleanField(default=False)
    creator = models.ForeignKey(Profile, on_delete=models.CASCADE)
    title = models.CharField(max_length=128)
    description = models.TextField()
    original_file = models.FileField()
    censored_file = models.FileField(null=True, blank=True)
    processed = models.BooleanField(default=False)
    copies = models.PositiveBigIntegerField(default=1)
    original_video = models.BooleanField(default=False)
    censored_video = models.BooleanField(default=False)
    moderation_passed = models.BooleanField(null=True, blank=True)
    preview_image = models.ImageField(null=True, blank=True)
    featured = models.BooleanField(default=False, db_index=True)
    top_slider = models.BooleanField(default=False, db_index=True)

    @property
    def prices(self):
        res = list(set(item['max_price'] for item in
                       Auction.objects.filter(token__artwork=self, state=Auction.State.RUNNING)
                                      .values('token')
                                      .annotate(max_price=Coalesce(Max('bids__amount'), F('start_price')))))
        res.sort()

        if not res:
            return None
        if len(res) == 1:
            return [res[0]]
        return [res[0], res[-1]]

    @property
    def tokens(self):
        new_list = []
        for x in MintedTokensArtwork.objects.filter(artwork_id=pk):
            new_list.append(x.token_id)

        return new_list


class Token(models.Model):
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='tokens')
    owner = models.CharField(max_length=64, null=True, db_index=True)
    token_id = models.PositiveBigIntegerField()
    copy = models.PositiveBigIntegerField(default=1)


class Auction(models.Model):
    class State(TextChoices):
        PENDING = 'pending'
        RUNNING = 'running'
        FINISHED = 'finished'

    token = models.ForeignKey(Token, on_delete=models.CASCADE, related_name='auctions')
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='auctions', null=True)
    start_price = models.DecimalField(max_digits=64, decimal_places=18)
    state = models.CharField(max_length=8, choices=State.choices, default=State.PENDING, db_index=True)


class AuctionBid(models.Model):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name='bids')
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(max_digits=64, decimal_places=18)
    won = models.BooleanField(default=False)


class ClaimableToken(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='claimable_tokens')
    token_id = models.PositiveBigIntegerField()
    claimed = models.BooleanField(default=False)