import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getNFTContract } from "utils/getContract";
import { checkMetaMaskInstalled } from "utils/metamask";

export type UseWalletReturns = {
  provider?: ethers.providers.Web3Provider;
  signer?: ethers.providers.JsonRpcSigner;
  accountAddress?: string;
  nftContract?: ethers.Contract;
  isConnected: boolean;
  requestToConnect: () => Promise<void>;
};

export const useWallet = (): UseWalletReturns => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [accountAddress, setAccountAddress] = useState<string>();
  const [nftContract, setNftContract] = useState<ethers.Contract>();

  useEffect(() => {
    init();

    window.ethereum.on("accountsChanged", function (accounts: string[]) {
      if (accounts.length) {
        setAccountAddress(accounts[0]);
      } else {
        setAccountAddress("");
        setIsConnected(false);
      }
    });
  }, []);

  const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    if (!checkMetaMaskInstalled()) {
      alert("Please install metamask");
    }

    const accounts = await provider.listAccounts();
    if (accounts.length) {
      setIsConnected(true);
      setAccountAddress(accounts[0]);
    }

    const signer = provider.getSigner(0);
    setSigner(signer);

    const nftContract = await getNFTContract(signer as ethers.Signer);
    setNftContract(nftContract);
  };

  const requestToConnect = async () => {
    if (!provider) throw new Error("Provider is not initialized");

    const accounts = await provider.send("eth_requestAccounts", []);
    if (accounts.length) {
      setAccountAddress(accounts[0]);
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  return {
    accountAddress,
    provider,
    nftContract,
    signer,
    isConnected,
    requestToConnect,
  };
};
