import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Circle,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Progress,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from '@chakra-ui/react';
import { StyledChart } from 'components/chart/StyledChart';
import {
  FiActivity,
  FiArrowDownRight,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiCloud,
  FiCode,
  FiDatabase,
  FiGlobe,
  FiZap,
} from 'react-icons/fi';

const requests = [
  { method: 'GET', path: '/v1/projects', status: '200 OK', time: '84 ms', color: 'green' },
  { method: 'POST', path: '/v1/events', status: '201 Created', time: '126 ms', color: 'green' },
  { method: 'GET', path: '/v1/analytics', status: '200 OK', time: '97 ms', color: 'green' },
  { method: 'GET', path: '/v1/unknown', status: '404 Not Found', time: '42 ms', color: 'red' },
];

const integrations = [
  { name: 'REST API', detail: 'api.example.com', icon: FiGlobe, status: 'Connected', color: 'cyan' },
  { name: 'Database', detail: 'PostgreSQL connection', icon: FiDatabase, status: 'Connected', color: 'purple' },
  { name: 'Webhook events', detail: 'Event delivery endpoint', icon: FiZap, status: 'Needs setup', color: 'orange' },
];

export function ExampleDashboardView() {
  return (
    <VStack align="stretch" spacing={6} pb={10}>
      <Flex justify="space-between" align={{ base: 'start', md: 'center' }} gap={4} wrap="wrap">
        <Box>
          <HStack spacing={2} mb={2}>
            <Badge colorScheme="cyan" variant="subtle" px={2} py={1} rounded="full">WORKSPACE OVERVIEW</Badge>
            <Text color="gray.500" fontSize="xs">DEMO DATA</Text>
          </HStack>
          <Heading size="xl" letterSpacing="-0.04em">Good to see you, developer.</Heading>
          <Text color="gray.500" mt={2}>A clear view of your APIs, services, and activity.</Text>
        </Box>
        <HStack bg="rgba(34,197,94,0.08)" border="1px solid" borderColor="rgba(34,197,94,0.2)" px={3} py={2} rounded="xl">
          <Circle size="8px" bg="green.400" />
          <Text fontSize="sm" color="green.300" fontWeight="600">Systems operational</Text>
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing={4}>
        <Metric title="API requests" value="24,892" change="+12.8%" icon={FiActivity} positive />
        <Metric title="Success rate" value="99.94%" change="+0.4%" icon={FiCheckCircle} positive />
        <Metric title="Avg. response" value="118 ms" change="-18 ms" icon={FiClock} positive />
        <Metric title="Connected services" value="08" change="2 need setup" icon={FiCloud} />
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', xl: 'minmax(0, 1.65fr) minmax(280px, 1fr)' }} gap={4}>
        <Card variant="outline" borderColor="whiteAlpha.100" bg="whiteAlpha. [0.03]">
          <CardHeader>
            <Flex justify="space-between" align="start" gap={3}>
              <Box>
                <Heading size="md">Request activity</Heading>
                <Text color="gray.500" fontSize="sm" mt={1}>API traffic over the last 7 days</Text>
              </Box>
              <Badge variant="outline" colorScheme="cyan">Last 7 days</Badge>
            </Flex>
          </CardHeader>
          <CardBody pt={0}>
            <HStack align="baseline" spacing={3} mb={2}>
              <Heading size="2xl" letterSpacing="-0.04em">24.9k</Heading>
              <HStack color="green.300" fontSize="sm" fontWeight="600">
                <Icon as={FiArrowUpRight} />
                <Text>12.8%</Text>
              </HStack>
            </HStack>
            <StyledChart
              options={{
                chart: { toolbar: { show: false }, background: 'transparent', foreColor: '#8b95a7' },
                colors: ['#22D3EE'],
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 3 },
                grid: { borderColor: 'rgba(148,163,184,0.12)', strokeDashArray: 4 },
                xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], axisBorder: { show: false }, axisTicks: { show: false } },
                yaxis: { labels: { formatter: (value: number) => value + 'k' } },
                tooltip: { theme: 'dark' },
              }}
              series={[{ name: 'Requests', data: [2.8, 3.6, 3.1, 4.5, 3.9, 5.2, 6.1] }]}
              height={250}
              type="area"
            />
          </CardBody>
        </Card>

        <Card variant="outline" borderColor="whiteAlpha.100">
          <CardHeader>
            <Heading size="md">Service health</Heading>
            <Text color="gray.500" fontSize="sm" mt={1}>Latest checks across your workspace</Text>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" spacing={5}>
              <HealthRow name="API gateway" value="99.99%" detail="Uptime this month" />
              <HealthRow name="Database" value="99.95%" detail="Uptime this month" />
              <HealthRow name="Webhook delivery" value="98.70%" detail="Successful deliveries" />
            </VStack>
            <Box mt={6} p={3} rounded="xl" bg="whiteAlpha. [0.04]" border="1px solid" borderColor="whiteAlpha.100">
              <HStack spacing={3}>
                <Circle size="36px" bg="cyan.400" color="gray.900">
                  <Icon as={FiCode} boxSize={4} />
                </Circle>
                <Box>
                  <Text fontWeight="600" fontSize="sm">Built for your stack</Text>
                  <Text color="gray.500" fontSize="xs">Bring your own API and integrations.</Text>
                </Box>
              </HStack>
            </Box>
          </CardBody>
        </Card>
      </Grid>

      <Grid templateColumns={{ base: '1fr', xl: 'minmax(0, 1.2fr) minmax(300px, 0.8fr)' }} gap={4}>
        <Card variant="outline" borderColor="whiteAlpha.100">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="md">Recent API requests</Heading>
                <Text color="gray.500" fontSize="sm" mt={1}>A sample of activity from your endpoints</Text>
              </Box>
              <Badge colorScheme="gray">Sample</Badge>
            </Flex>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" spacing={0} divider={<Box borderBottom="1px solid" borderColor="whiteAlpha.100" />}>
              {requests.map((request) => (
                <Flex key={request.path} py={3} gap={3} align="center" wrap="wrap">
                  <Badge colorScheme={request.method === 'POST' ? 'purple' : 'cyan'} minW="52px" textAlign="center">{request.method}</Badge>
                  <Text fontFamily="mono" fontSize="sm" flex={1} minW="120px">{request.path}</Text>
                  <Badge colorScheme={request.color} variant="subtle">{request.status}</Badge>
                  <Text color="gray.500" fontSize="xs" minW="52px" textAlign="right">{request.time}</Text>
                </Flex>
              ))}
            </VStack>
          </CardBody>
        </Card>

        <Card variant="outline" borderColor="whiteAlpha.100">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="md">Integrations</Heading>
                <Text color="gray.500" fontSize="sm" mt={1}>Services in your workspace</Text>
              </Box>
              <Icon as={FiCloud} color="cyan.300" boxSize={5} />
            </Flex>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" spacing={3}>
              {integrations.map((integration) => (
                <HStack key={integration.name} p={3} border="1px solid" borderColor="whiteAlpha.100" rounded="xl" spacing={3}>
                  <Circle size="40px" bg={integration.color + '.500'} color="white" bgOpacity={0.15}>
                    <Icon as={integration.icon} boxSize={5} />
                  </Circle>
                  <Box flex={1} minW={0}>
                    <Text fontWeight="600" fontSize="sm">{integration.name}</Text>
                    <Text color="gray.500" fontSize="xs" noOfLines={1}>{integration.detail}</Text>
                  </Box>
                  <Badge colorScheme={integration.status === 'Connected' ? 'green' : 'orange'}>{integration.status}</Badge>
                </HStack>
              ))}
            </VStack>
            <Text color="gray.500" fontSize="xs" mt={4}>Example widgets only. Connect your own data source when configuring Dashly.</Text>
          </CardBody>
        </Card>
      </Grid>
    </VStack>
  );
}

function Metric({ title, value, change, icon, positive }: { title: string; value: string; change: string; icon: any; positive?: boolean }) {
  return (
    <Card variant="outline" borderColor="whiteAlpha.100">
      <CardBody>
        <Flex justify="space-between" align="start">
          <Text color="gray.500" fontSize="sm">{title}</Text>
          <Circle size="38px" bg="cyan.400" color="cyan.200" bgOpacity={0.12}>
            <Icon as={icon} boxSize={5} />
          </Circle>
        </Flex>
        <Stat mt={3}>
          <StatNumber fontSize="2xl" letterSpacing="-0.04em">{value}</StatNumber>
          <StatHelpText mb={0} mt={2}>
            <HStack spacing={1} color={positive ? 'green.300' : 'orange.300'} fontSize="xs">
              <Icon as={positive ? FiArrowUpRight : FiArrowDownRight} />
              <Text>{change}</Text>
              <Text color="gray.500">vs. previous period</Text>
            </HStack>
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );
}

function HealthRow({ name, value, detail }: { name: string; value: string; detail: string }) {
  const progress = parseFloat(value);
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontSize="sm" fontWeight="600">{name}</Text>
        <Text fontSize="sm" fontWeight="600">{value}</Text>
      </Flex>
      <Progress value={progress} size="xs" colorScheme="cyan" rounded="full" bg="whiteAlpha.100" />
      <Text color="gray.500" fontSize="xs" mt={1}>{detail}</Text>
    </Box>
  );
}
