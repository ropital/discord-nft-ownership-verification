import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Header } from "components/Header/Header";
import { useWalletContext } from "context/WalletProvider";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

type DiscordUser = {
  id: string;
  username: string;
  avatar: string;
};

const Home: NextPage = () => {
  const wallet = useWalletContext();
  const toast = useToast();
  const [isVerifing, setIsVerifing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [user, setUser] = useState<DiscordUser>();

  console.log("wallet", wallet);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [
      fragment.get("access_token"),
      fragment.get("token_type"),
    ];

    if (!accessToken) return;

    const result = await fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    });
    const res = await result.json();
    setUser({
      ...res,
      avatar: `https://cdn.discordapp.com/avatars/${res.id}/${res.avatar}.png`,
    });
  };

  const verify = async () => {
    if (
      !wallet.accountAddress ||
      !wallet.nftContract ||
      !wallet.signer ||
      !user
    )
      return;

    try {
      setIsVerifing(true);
      const res = await wallet.nftContract.balanceOf(wallet.accountAddress);

      if (res.toNumber() === 0) return;

      setIsVerified(true);
      setIsVerifing(false);
      const message = await wallet.signer.signMessage("Have a good dapp dev!");
      const result = await fetch(`/api/verify?&mes=${message}&user=${user.id}`);
      console.log(await result.json());
    } catch (error) {
      console.log(error);
      setIsVerifing(false);
    }
  };

  return (
    <Box>
      <Header {...wallet} />
      <Flex
        pt="70px"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
      >
        {user && (
          <Center flexDir="column">
            <Heading as="h2">Hello! {user.username}</Heading>
            <Avatar src={user.avatar} size="2xl" />
          </Center>
        )}

        {!wallet.isConnected && (
          <Button
            mt="30px"
            w="300px"
            h="60px"
            fontSize="26px"
            onClick={wallet.requestToConnect}
          >
            Connect wallet
          </Button>
        )}
        {wallet.isConnected && (
          <Button
            mt="30px"
            w="300px"
            h="60px"
            fontSize="26px"
            onClick={verify}
            isLoading={isVerifing}
          >
            Verify
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Home;
