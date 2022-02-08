import { Box, HStack, Link, Text } from "@chakra-ui/layout";
import NextLink from "next/link";
import React, { VFC } from "react";
import { getOmmitedAddress } from "utils/getOmittedAddress";
import { ConnectButton } from "../Button/ConnectButton";

type Props = {
  isConnected: boolean;
  accountAddress?: string;
  requestToConnect: () => void;
};

export const Header: VFC<Props> = ({
  isConnected,
  accountAddress,
  requestToConnect,
}) => {
  return (
    <Box as="header" p="16px 34px">
      <HStack justifyContent="space-between" alignItems="center">
        <HStack alignItems="center">
          <Text fontSize="22px" fontWeight="bold" mr="30px">
            NFT Verifier
          </Text>

          {/* <HStack gap="20px">
            <NextLink href="/page1">
              <Link fontSize="18px">Link1</Link>
            </NextLink>
            <NextLink href="/page2">
              <Link fontSize="18px">Link2</Link>
            </NextLink>
          </HStack> */}
        </HStack>

        <Box>
          {isConnected && accountAddress ? (
            <div>{getOmmitedAddress(accountAddress)}</div>
          ) : (
            <ConnectButton onClick={requestToConnect} />
          )}
        </Box>
      </HStack>
    </Box>
  );
};
