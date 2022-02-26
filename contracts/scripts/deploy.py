import json

from brownie import accounts, PaymentToken, Deposit, Contract, NFT, TokenStorage


def main():
    try:
        with open('addresses.json', 'r') as f:
            addresses = json.load(f)
    except:
        addresses = {}

    deployer = accounts.load('deployer')
    # pt: Contract = PaymentToken.deploy({'from': deployer})
    # addresses['payment_token'] = pt.address
    # deposit: Contract = Deposit.deploy(pt.address, deployer.address, {'from': deployer})ft'])
    # addresses['deposit'] = deposit.address
    # pt.mint(deployer.address, '1000000000000000000000000', {'from': deployer})
    # nft: Contract = NFT.deploy('http://localhost:32955/_meta/', {'from': deployer})
    # addresses['nft'] = nft.address
    storage: Contract = TokenStorage.deploy(addresses['nft'], {'from': deployer})
    addresses['storage'] = storage.address

    with open('addresses.json', 'w') as f:
        json.dump(addresses, f)

    # with open('interfaces/paymentToken.abi.json', 'w') as f:
    #     json.dump(pt.abi, f)
    #
    # with open('interfaces/deposit.abi.json', 'w') as f:
    #     json.dump(deposit.abi, f)
    #
    # with open('interfaces/nft.abi.json', 'w') as f:
    #     json.dump(nft.abi, f)

    with open('interfaces/storage.abi.json', 'w') as f:
        json.dump(storage.abi, f)

    # PaymentToken.publish_source(pt)
    # Deposit.publish_source(deposit)
    # NFT.publish_source(nft)
    TokenStorage.publish_source(storage)
