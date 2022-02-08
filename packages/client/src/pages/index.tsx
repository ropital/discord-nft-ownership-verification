import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link,
  useToast,
} from "@chakra-ui/react";
import { Header } from "components/Header/Header";
import { useWalletContext } from "context/WalletProvider";
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

      if (res.toNumber() === 0) {
        toast({
          status: "error",
          title: "CryproCocoAを所有していません。購入する必要があります。",
        });
        setIsVerifing(false);
        setIsVerified(false);
        return;
      }

      const message = await wallet.signer.signMessage("Have a good dapp dev!");
      const result = await fetch(`/api/verify?&mes=${message}&user=${user.id}`);
      if (result.status === 200) {
        setIsVerified(true);
        setIsVerifing(false);
        toast({
          status: "success",
          title: "Success!",
        });
      } else {
        const data = await result.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error);
      setIsVerifing(false);
      if (error instanceof Error) {
        toast({
          status: "error",
          title: "Error",
          description: error.message,
        });
      }
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
        {wallet.isConnected && !isVerified && (
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
        {isVerified && (
          <Link
            target="_blank"
            rel="noreferrer"
            href={process.env.NEXT_PUBLIC_DISCORD_CHANNEL_URL}
            mt="20px"
          >
            <Button>Move to the discord channel</Button>
          </Link>
        )}
        {!isVerified && (
          <Link
            target="_blank"
            rel="noreferrer"
            textDecoration="underline"
            href={process.env.NEXT_PUBLIC_OPENSEA_COLLECTION_URL}
            mt="20px"
          >
            Buy from OpenSea
          </Link>
        )}
      </Flex>
    </Box>
  );
};

export default Home;
