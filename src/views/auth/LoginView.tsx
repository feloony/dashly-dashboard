import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Button, Text } from '@chakra-ui/react';
import { BsDiscord } from 'react-icons/bs';
import { Box, Center, Flex, Grid, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useColors } from 'theme';
import { HomeView } from 'views/home/HomeView';
import CloudSvg from 'assets/Cloud.svg';
import { bot } from 'api/bot';
import { auth } from 'config/translations/auth';

export function LoginView() {
  const t = auth.useTranslations();

  return (
    <AuthLayout>
      <FormControl>
        <FormLabel>{t['login description']}</FormLabel>
        {bot ? (
          <a href={`${bot}/auth/discord`} target="_self">
            <Button leftIcon={<BsDiscord />}>{t.login}</Button>
          </a>
        ) : (
          <Text color="red.400">
            Dashboard API is not configured. Set VITE_API_ENDPOINT in the deployment environment.
          </Text>
        )}
      </FormControl>
    </AuthLayout>
  );
}

function AuthLayout({ children }: { children: ReactNode }) {
  const t = auth.useTranslations();
  const { globalBg, brand } = useColors();

  return (
    <Grid
      position="relative"
      templateColumns={{ base: '1fr', lg: '1fr 1fr', xl: '1fr 1.2fr' }}
      h="full"
    >
      <Center
        pos="relative"
        bg={brand}
        bgImg={CloudSvg}
        bgRepeat="no-repeat"
        bgPosition="bottom"
        flexDirection="column"
        gap={4}
        py={10}
      >
        <Heading color="white" fontSize="8xl">{t.login}</Heading>
        <Box pos="relative" p={10} bg={globalBg} rounded="lg">
          {children}
        </Box>
      </Center>
      <Flex direction="column" bg={globalBg} p={30}>
        <HomeView />
      </Flex>
    </Grid>
  );
}
