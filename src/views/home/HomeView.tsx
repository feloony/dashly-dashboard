import { Box, Flex, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Card, CardBody, CardHeader, Icon } from '@chakra-ui/react';
import { FiCloud, FiCode, FiLayers } from 'react-icons/fi';
import { useColors } from 'theme';

const features = [
  {
    title: 'Bring your own APIs',
    description: 'Connect the services and data sources that power your workflow.',
    icon: FiCloud,
  },
  {
    title: 'Composable widgets',
    description: 'Build a dashboard from reusable cards, charts, and activity panels.',
    icon: FiLayers,
  },
  {
    title: 'Made for developers',
    description: 'Fork the code, customize the theme, and deploy your own instance.',
    icon: FiCode,
  },
];

export function HomeView() {
  const { globalBg, textColorSecondary, brand } = useColors();

  return (
    <Flex w="full" direction="column" gap={8} bg={globalBg} py={{ base: 4, lg: 8 }}>
      <VStack align="start" spacing={4}>
        <Text color="cyan.300" fontSize="sm" fontWeight="700" letterSpacing="0.14em">
          OPEN-SOURCE DASHBOARD STARTER
        </Text>
        <Heading
          fontSize={{ base: '4xl', xl: '6xl' }}
          lineHeight="1.04"
          letterSpacing="-0.055em"
        >
          Your services.
          <Box as="span" display="block" color={brand}>One dashboard.</Box>
        </Heading>
        <Text color={textColorSecondary} fontSize={{ base: 'md', xl: 'lg' }} maxW="560px" lineHeight="1.8">
          Dashly gives you a polished starting point for building your own API and service dashboard.
          Make it yours, connect your stack, and deploy it where you want.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, '3sm': 2, xl: 1 }} gap={3}>
        {features.map((feature) => (
          <Card key={feature.title} variant="outline" borderColor="whiteAlpha.200" bg="whiteAlpha.50">
            <CardHeader pb={2}>
              <Icon as={feature.icon} color="cyan.300" boxSize={5} />
              <Text mt={3} fontWeight="700">{feature.title}</Text>
            </CardHeader>
            <CardBody pt={0}>
              <Text color={textColorSecondary} fontSize="sm" lineHeight="1.7">
                {feature.description}
              </Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Text color={textColorSecondary} fontSize="xs">
        React · TypeScript · Vite · Chakra UI
      </Text>
    </Flex>
  );
}
