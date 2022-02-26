#!/bin/bash

abi-types-generator ./interfaces/deposit.abi.json --output ../frontend/src/utils/contracts
abi-types-generator ./interfaces/paymentToken.abi.json --output ../frontend/src/utils/contracts
