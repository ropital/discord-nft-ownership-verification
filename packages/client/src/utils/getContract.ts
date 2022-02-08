import { ethers } from "ethers";
const ERC721 = import("../contracts/CryptoCocoA.json");

const ERC721Address = process.env.NEXT_PUBLIC_ERC721_ADDRESS || "";

export const getNFTContract = async (signer: ethers.Signer) => {
  const erc721 = await ERC721;
  const contract = new ethers.Contract(ERC721Address, erc721.abi, signer);
  return contract;
};
