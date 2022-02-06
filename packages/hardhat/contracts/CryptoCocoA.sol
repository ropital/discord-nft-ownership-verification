pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Base64.sol";

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract CryptoCocoA is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenId;

    string private baseURI;

    constructor() ERC721("CryptoCocoA", "COCOA") {
        baseURI = "ipfs://";
    }

    function mint(string memory cid) public onlyOwner {
        string memory image = string(abi.encodePacked(baseURI, cid));
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{ "name": "CryptoCocoA #',
                        Strings.toString(tokenId.current()),
                        '", "description": "A NFT-powered Crypto CocoA", ',
                        '"traits": [], ',
                        '"image": "',
                        image,
                        '"}'
                    )
                )
            )
        );

        string memory tokenURI = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        _safeMint(msg.sender, tokenId.current());
        _setTokenURI(tokenId.current(), tokenURI);

        tokenId.increment();
    }
}
