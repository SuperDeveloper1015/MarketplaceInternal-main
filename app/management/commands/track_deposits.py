import logging
import time
from decimal import Decimal

from constance import config
from django.core.management import BaseCommand
from django.db import transaction

from lofcrypto.crypto import ethereum
from app.models import internal_options as io, Profile, Artwork, Token, Auction, ClaimableToken


class Command(BaseCommand):
    def handle(self, *args, **options):
        io.deposits_last_block = ethereum.web3.eth.blockNumber

        while True:
            try:
                with transaction.atomic():
                    deposit_contract = ethereum.get_deposit_contract()
                    nft_contract = ethereum.get_nft_contract()
                    storage_contract = ethereum.get_storage_contract()

                    to_block = ethereum.web3.eth.blockNumber
                    if not io.deposits_last_block:
                        io.deposits_last_block = to_block

                    if io.deposits_last_block < to_block:
                        logging.warning('Last remembered block: {}, current last: {}'.format(io.deposits_last_block, to_block))
                        if to_block - io.deposits_last_block > 1000:
                            to_block = io.deposits_last_block + 1000
                        from_block = io.deposits_last_block + 1
                        logging.warning('  Checking blocks {} ~ {}'.format(from_block, to_block))

                        addresses = set(Profile.objects.filter(_wallet_address__isnull=False).values_list('_wallet_address', flat=True))
                        gas_price = ethereum.web3.eth.gasPrice

                        for block_num in range(from_block, to_block + 1):
                            block = ethereum.web3.eth.getBlock(block_num, True)
                            for tx in block.transactions:
                                if tx.to in addresses and tx.value > gas_price * 21000:
                                    profile = Profile.objects.filter(_wallet_address=tx.to).first()
                                    if not profile:
                                        continue
                                    value = Decimal(tx.value) / 10 ** 18
                                    profile.balance_bnb += value
                                    profile.save(update_fields=('balance_bnb',))
                                    logging.warning('    Deposit {:.18f} BNB to {} (profile #{})'.format(value, tx.to, profile.pk))
                                    tx = {
                                        'from': tx.to,
                                        'to': config.MASTER_ADDRESS,
                                        'value': tx.value - gas_price * 21000,
                                        'gas': 21000,
                                        'gasPrice': gas_price,
                                        'nonce': ethereum.web3.eth.getTransactionCount(tx.to),
                                    }
                                    signed = ethereum.web3.eth.account.sign_transaction(tx, profile.wallet_pk)
                                    # txid = ethereum.web3.eth.send_raw_transaction(signed.rawTransaction)
                                    # logging.warning('      Collected: txid {}'.format(txid.hex()))

                        evts = deposit_contract.events.Deposit().getLogs(fromBlock=from_block, toBlock=to_block)
                        for evt in evts:
                            profile_id = evt.args.profileId
                            value = Decimal(evt.args.value) / 10**18
                            profile = Profile.objects.filter(pk=profile_id).first()
                            if not profile:
                                continue
                            profile.balance_lof += value
                            profile.save(update_fields=('balance_lof',))
                            logging.warning('    Deposit {:.18f} LOF to profile #{}'.format(value, profile.pk))

                        evts = nft_contract.events.Mint().getLogs(fromBlock=from_block, toBlock=to_block)
                        for evt in evts:
                            uuid = evt.args.artworkUuid[:16].hex()
                            tokens = evt.args.tokens
                            try:
                                artwork = Artwork.objects.get(uuid=uuid)
                                artwork.minted = True
                                artwork.save(update_fields=('minted',))
                                Token.objects.bulk_create([Token(artwork=artwork, token_id=tid, copy=i) for i, tid in enumerate(tokens, 1)])
                                logging.warning('    Minted tokens for artwork #{}'.format(artwork.pk))
                            except Artwork.DoesNotExist:
                                logging.warning('Artwork {} does not exist'.format(uuid))

                        evts = storage_contract.events.Stored().getLogs(fromBlock=from_block, toBlock=to_block)
                        for evt in evts:
                            token_id = evt.args.tokenId
                            try:
                                auction = Auction.objects.get(token__token_id=token_id, state=Auction.State.PENDING)
                                auction.state = Auction.State.RUNNING
                                auction.save()
                                logging.warning('    Auction #{} started'.format(auction.pk))
                            except Auction.DoesNotExist:
                                pass

                        evts = storage_contract.events.Withdrawn().getLogs(fromBlock=from_block, toBlock=to_block)
                        for evt in evts:
                            token_id = evt.args.tokenId
                            ClaimableToken.objects.filter(token_id=token_id, claimed=False).update(claimed=True)
                            logging.warning('    Token #{} claimed'.format(token_id))

                        evts = nft_contract.events.Transfer().getLogs(fromBlock=from_block, toBlock=to_block)
                        for evt in evts:
                            token_id = evt.args.tokenId
                            transfer_to = evt.args.to
                            if transfer_to != storage_contract.address:
                                Token.objects.filter(token_id=token_id).update(owner=transfer_to)
                                logging.warning('    Token #{} transfer to {}'.format(token_id, transfer_to))

                        io.deposits_last_block = to_block
                        if ethereum.web3.eth.blockNumber != to_block:
                            continue
            except KeyboardInterrupt:
                logging.warning('Stopping...')
                return
            except Exception as e:
                logging.exception(e)
                time.sleep(5)

            time.sleep(.3)
