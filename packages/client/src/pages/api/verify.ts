import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { Client, Intents } from "discord.js";
const ERC721 = import("../../contracts/CryptoCocoA.json");

const client = new Client();

const contractAddress = process.env.NEXT_PUBLIC_ERC721_ADDRESS || "";
const discordToken = process.env.NEXT_PUBLIC_DISCORD_TOKEN || "";
const projectId = process.env.NEXT_PUBLIC_INFURA_APP_KEY || "";
const network = process.env.NEXT_PUBLIC_NETWORK || "rinkeby";
const guildId = "919137865798127617";
const cocoaRole = "940442097583009833";
const message = "Have a good dapp dev!";

const provider = new ethers.providers.InfuraWebSocketProvider(
  network,
  projectId
) as Provider;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const clientMessage = req.query.mes as string;
  const userId = req.query.user as string;
  await client.login(discordToken);

  const address = ethers.utils.verifyMessage(message, clientMessage);
  if (!address) {
    res.status(400).json({ message: "Signed message is incorrect." });
    return;
  }

  const erc721 = await ERC721;
  const contract = new ethers.Contract(contractAddress, erc721.abi, provider);
  const result = await contract.balanceOf(address);
  if (result.toNumber() === 0) {
    res.status(400).json({ message: "You do not own any CryptoCocoA." });
    return;
  }

  try {
    const guild = await client.guilds.fetch(guildId);
    const user = await guild?.members.fetch(userId);
    await user.roles.add(cocoaRole);
    res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(400).json({ message: "Something went wrong." });
  }
}
