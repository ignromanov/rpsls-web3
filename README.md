# Rock Paper Scissors Lizard Spock Game

A decentralized Rock Paper Scissors game built on Ethereum using Next.js, TypeScript, and ethers.js.

[🕹️ **Play the Game Now!**](https://rpsls-web3-six.vercel.app/)

<p align="center"><img src="public/images/rpsls.png" alt="Rock Paper Scissors Lizard Spock" width="300" /></p>

## Overview

This Rock Paper Scissors Lizard Spock game allows players to compete against each other in a trustless manner using Ethereum smart contracts. The game uses React for the front-end, TypeScript for type safety, and ethers.js for interacting with Ethereum.

## Recent Updates

1. Implemented RPSV2 - the second version of the game's contract which includes additional events allowing us to determine the game's winner. The player can now select the contract they wish to use and the winner will be displayed accordingly once the game ends.

2. Enhanced protection against phishing of chain and contract by retaining this data for the first player between their moves. This prevents the second player from intentionally substituting the current game's blockchain or contract.

3. Improved the process of saving and restoring the player's secret. At each step of the secret creation process, we try to ensure the data is kept safe by asking the player to save and retain it until the move is revealed. If the secret data isn't found locally during the move reveal, the player is prompted to enter it manually.

4. Added an Anti-Phishing banner to ensure the player is on the correct site and always verifies the address to avoid phishing sites.

## Features

- Trustless gameplay using Ethereum smart contracts
- Secure moves with encryption and local storage

- User-friendly interface built with React and Tailwind CSS
- Responsive design for mobile and desktop
- Timeout system to handle unresponsive players
- Anti-phishing banner for additional security

## How to Play

1. Player 1 starts a new game by selecting their move, the stake amount, and the Ethereum address of Player 2. The move is encrypted and stored locally, while the stake amount and Player 2's address are sent to the smart contract.
2. Player 2 joins the game by selecting their move and sending the same stake amount to the smart contract.
3. Player 1 reveals their move by decrypting it and sending the result to the smart contract.
4. The smart contract determines the winner and sends the combined stake to the winner's Ethereum address.

## Timeouts

- If Player 2 does not join the game within a specified timeout period, Player 1 can claim the stake back.
- If Player 1 does not reveal their move within the timeout period, Player 2 can claim the stake.

## License

This project is licensed under the MIT License.

## Support Me

<a href="https://www.buymeacoffee.com/ignromanov" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
