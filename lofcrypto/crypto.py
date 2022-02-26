import json

from django.conf import settings
from eth_account.messages import encode_defunct
from eth_account.signers.local import LocalAccount
from web3 import Web3, HTTPProvider
from web3.middleware import geth_poa_middleware


with (settings.BASE_DIR / 'contracts' / 'addresses.json').open() as f:
    ADDRESSES = json.load(f)


with (settings.BASE_DIR / 'contracts' / 'interfaces' / 'deposit.abi.json').open() as f:
    DEPOSIT_ABI = json.load(f)


with (settings.BASE_DIR / 'contracts' / 'interfaces' / 'paymentToken.abi.json').open() as f:
    TOKEN_ABI = json.load(f)


with (settings.BASE_DIR / 'contracts' / 'interfaces' / 'nft.abi.json').open() as f:
    NFT_ABI = json.load(f)


with (settings.BASE_DIR / 'contracts' / 'interfaces' / 'storage.abi.json').open() as f:
    STORAGE_ABI = json.load(f)


class Ethereum:
    @property
    def web3(self):
        w3 = Web3(HTTPProvider('https://data-seed-prebsc-2-s1.binance.org:8545/'))
        w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        return w3

    def create_address(self):
        return self.web3.geth.personal.new_account('')

    def create_pk(self):
        acc = self.web3.eth.account.create()  # type: LocalAccount
        return acc.key

    def validate_address(self, address):
        return self.web3.isAddress(address)

    def normalize_address(self, address):
        return self.web3.toChecksumAddress(address)

    def recover_message(self, message: str, signature: str):
        h = encode_defunct(text=message)
        return self.web3.eth.account.recover_message(h, signature=signature)

    def get_deposit_contract(self):
        return self.web3.eth.contract(address=ADDRESSES['deposit'], abi=DEPOSIT_ABI)

    def get_token_contract(self):
        return self.web3.eth.contract(address=ADDRESSES['payment_token'], abi=TOKEN_ABI)

    def get_nft_contract(self):
        return self.web3.eth.contract(address=ADDRESSES['nft'], abi=NFT_ABI)

    def get_storage_contract(self):
        return self.web3.eth.contract(address=ADDRESSES['storage'], abi=STORAGE_ABI)


ethereum = Ethereum()
