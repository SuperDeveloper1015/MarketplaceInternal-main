import logging

from admin_actions.admin import ActionsModelAdmin
from constance import config
from django.contrib import admin, messages
from django.shortcuts import redirect

from app.models import Profile, WithdrawRequest, Artwork
from lofcrypto.crypto import ethereum


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = 'id', 'address', 'name', 'email', 'balance_bnb', 'balance_lof', 'verified',
    list_display_links = 'id', 'address',


@admin.register(WithdrawRequest)
class WithdrawRequestAdmin(ActionsModelAdmin):
    list_display = 'id', 'profile', 'amount', 'currency', 'status', 'datetime',
    date_hierarchy = 'datetime'
    list_filter = 'status',
    actions_row = actions_detail = 'confirm_wr', 'reject_wr',

    def confirm_wr(self, request, pk):
        wr = WithdrawRequest.objects.get(pk=pk)
        if wr.status is not None:
            messages.error(request, 'This request is already processed')
            return redirect('admin:app_withdrawrequest_changelist')

        try:
            gas_price = ethereum.web3.eth.gasPrice
            if wr.currency == 'bnb':
                tx = {
                    'from': config.MASTER_ADDRESS,
                    'to': wr.address,
                    'value': int(wr.amount * 10**18),
                    'gas': 21000,
                    'gasPrice': gas_price,
                    'nonce': ethereum.web3.eth.getTransactionCount(config.MASTER_ADDRESS),
                }
            elif wr.currency == 'lof':
                tx = ethereum.get_token_contract().functions.transfer(wr.address, int(wr.amount * 10**18)).buildTransaction({
                    'from': config.MASTER_ADDRESS,
                    'gasPrice': gas_price,
                    'nonce': ethereum.web3.eth.getTransactionCount(config.MASTER_ADDRESS),
                })
            else:
                messages.error(request, 'Invalid withdraw request currency')
                return redirect('admin:app_withdrawrequest_changelist')
            signed = ethereum.web3.eth.account.sign_transaction(tx, config.MASTER_PK)
            txid = ethereum.web3.eth.send_raw_transaction(signed.rawTransaction)
            messages.success(request, 'Transaction sent, txid: {}'.format(txid.hex()))
            wr.status = True
            wr.txid = txid.hex()
            wr.save(update_fields=('status', 'txid'))
        except Exception as e:
            logging.exception(e)
            messages.error(request, 'An error has occurred: {}. See logs for more info'.format(e))
        return redirect('admin:app_withdrawrequest_changelist')
    confirm_wr.short_description = 'Confirm'

    def reject_wr(self, request, pk):
        wr = WithdrawRequest.objects.get(pk=pk)
        if wr.status is not None:
            messages.error(request, 'This request is already processed')
            return redirect('admin:app_withdrawrequest_changelist')

        if wr.currency == 'bnb':
            wr.profile.balance_bnb += wr.amount
        elif wr.currency == 'lof':
            wr.profile.balance_lof += wr.amount
        else:
            messages.error(request, 'Invalid withdraw request currency')
            return redirect('admin:app_withdrawrequest_changelist')

        wr.profile.save()
        wr.status = False
        wr.save()

        messages.success(request, 'Request was successfully rejected')
        return redirect('admin:app_withdrawrequest_changelist')
    reject_wr.short_description = 'Reject'


@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    list_display = 'title', 'creator', 'moderation_passed', 'minted',
