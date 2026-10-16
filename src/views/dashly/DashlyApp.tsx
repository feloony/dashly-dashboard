import {
  Badge, Box, Button, Card, CardBody, Divider, Flex, FormControl, FormLabel,
  Grid, Heading, HStack, Icon, Input, Select, SimpleGrid, Spinner, Stat, StatLabel,
  StatNumber, Text, Textarea, VStack, useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FiActivity, FiBox, FiCloud, FiCode, FiDatabase, FiLayers, FiPlus, FiRefreshCw, FiSettings, FiTrash2, FiZap } from 'react-icons/fi';

type Connection = {
  id: string; name: string; baseUrl: string; authType: 'none' | 'bearer' | 'basic';
  username?: string; headers?: string; createdAt: number;
};
type Widget = { id: string; title: string; connectionId: string; path: string; dataPath: string; };
type Workspace = { id: string; name: string; };
type Payload = { data?: unknown; error?: string; loading?: boolean; updatedAt?: number };
const STORAGE = { connections: 'dashly.connections.v1', widgets: 'dashly.widgets.v1', workspaces: 'dashly.workspaces.v1', active: 'dashly.active-workspace.v1', backend: 'dashly.backend-url.v1' };
const id = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const read = <T,>(key: string, fallback: T): T => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } };
const getPath = (data: unknown, path: string): unknown => path.trim() ? path.split('.').reduce<unknown>((value, key) => value != null && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined, data) : data;
const pretty = (value: unknown) => typeof value === 'string' ? value : JSON.stringify(value, null, 2) ?? String(value);

export function DashlyApp() {
  const toast = useToast();
  const [page, setPage] = useState(0);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => read(STORAGE.workspaces, [{ id: 'default', name: 'My workspace' }]));
  const [activeWorkspace, setActiveWorkspace] = useState(() => localStorage.getItem(STORAGE.active) || 'default');
  const [connections, setConnections] = useState<Connection[]>(() => read(STORAGE.connections, []));
  const [widgets, setWidgets] = useState<Widget[]>(() => read(STORAGE.widgets, []));
  const [backendUrl, setBackendUrl] = useState(() => localStorage.getItem(STORAGE.backend) || import.meta.env.VITE_API_ENDPOINT || '');
  const [connectionName, setConnectionName] = useState('');
  const [baseUrl, setBaseUrl] = useState(() => localStorage.getItem(STORAGE.backend) || import.meta.env.VITE_API_ENDPOINT || '');
  const [authType, setAuthType] = useState<Connection['authType']>('none');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [headers, setHeaders] = useState('{\n  "Accept": "application/json"\n}');
  const [widgetTitle, setWidgetTitle] = useState('');
  const [widgetConnection, setWidgetConnection] = useState('');
  const [widgetPath, setWidgetPath] = useState('/');
  const [widgetDataPath, setWidgetDataPath] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [results, setResults] = useState<Record<string, Payload>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE.connections, JSON.stringify(connections)); }, [connections]);
  useEffect(() => { localStorage.setItem(STORAGE.widgets, JSON.stringify(widgets)); }, [widgets]);
  useEffect(() => { localStorage.setItem(STORAGE.workspaces, JSON.stringify(workspaces)); }, [workspaces]);
  useEffect(() => { localStorage.setItem(STORAGE.active, activeWorkspace); }, [activeWorkspace]);
  const currentConnections = useMemo(() => connections.filter((connection) => (connection as Connection & { workspaceId?: string }).workspaceId === activeWorkspace || !(connection as Connection & { workspaceId?: string }).workspaceId), [connections, activeWorkspace]);
  const currentWidgets = useMemo(() => widgets.filter((widget) => (widget as Widget & { workspaceId?: string }).workspaceId === activeWorkspace || !(widget as Widget & { workspaceId?: string }).workspaceId), [widgets, activeWorkspace]);

  const addConnection = () => {
    if (!connectionName.trim() || !baseUrl.trim()) return toast({ title: 'Name and base URL are required', status: 'warning' });
    let parsed: URL;
    try { parsed = new URL(baseUrl.trim()); } catch { return toast({ title: 'Enter a valid absolute URL', status: 'error' }); }
    if (!['https:', 'http:'].includes(parsed.protocol)) return toast({ title: 'Only HTTP and HTTPS URLs are supported', status: 'error' });
    try { JSON.parse(headers || '{}'); } catch { return toast({ title: 'Default headers must be valid JSON', status: 'error' }); }
    const connection: Connection & { workspaceId: string } = { id: id(), name: connectionName.trim(), baseUrl: baseUrl.trim().replace(/\/+$/, ''), authType, username, headers, createdAt: Date.now(), workspaceId: activeWorkspace };
    setConnections((items) => [...items, connection]);
    if (authType !== 'none' && token) sessionStorage.setItem(`dashly.auth.${connection.id}`, token);
    setConnectionName(''); setBaseUrl(''); setToken(''); setUsername(''); setAuthType('none'); setShowAddConnection(false);
    toast({ title: 'Integration added', status: 'success' });
  };

  const removeConnection = (connection: Connection) => {
    setConnections((items) => items.filter((item) => item.id !== connection.id));
    setWidgets((items) => items.filter((item) => item.connectionId !== connection.id));
    sessionStorage.removeItem(`dashly.auth.${connection.id}`);
    setResults((items) => { const next = { ...items }; Object.keys(next).forEach((key) => { if (key.startsWith(connection.id + ':')) delete next[key]; }); return next; });
  };

  const requestWidget = async (widget: Widget) => {
    const connection = currentConnections.find((item) => item.id === widget.connectionId);
    if (!connection) return setResults((items) => ({ ...items, [widget.id]: { error: 'Choose a valid integration.' } }));
    setBusy((items) => ({ ...items, [widget.id]: true }));
    setResults((items) => ({ ...items, [widget.id]: { ...items[widget.id], loading: true, error: undefined } }));
    try {
      const path = widget.path.trim();
      const url = new URL(path, connection.baseUrl + '/');
      const base = new URL(connection.baseUrl);
      if (url.origin !== base.origin) throw new Error('Widget endpoint must stay on the integration base URL origin.');
      const parsedHeaders = JSON.parse(connection.headers || '{}') as Record<string, string>;
      const requestHeaders = new Headers({ Accept: 'application/json', ...parsedHeaders });
      const secret = sessionStorage.getItem(`dashly.auth.${connection.id}`);
      if (secret && connection.authType === 'bearer') requestHeaders.set('Authorization', `Bearer ${secret}`);
      if (secret && connection.authType === 'basic') requestHeaders.set('Authorization', `Basic ${btoa(`${connection.username || ''}:${secret}`)}`);
      const response = await fetch(url.toString(), { headers: requestHeaders, credentials: 'omit' });
      if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
      const data: unknown = await response.json();
      const selected = getPath(data, widget.dataPath);
      setResults((items) => ({ ...items, [widget.id]: { data: selected, updatedAt: Date.now() } }));
    } catch (error) {
      setResults((items) => ({ ...items, [widget.id]: { error: error instanceof Error ? error.message : 'Request failed' } }));
    } finally {
      setBusy((items) => ({ ...items, [widget.id]: false }));
    }
  };

  const addWidget = () => {
    if (!widgetTitle.trim() || !widgetConnection || !widgetPath.trim()) return toast({ title: 'Title, integration, and endpoint path are required', status: 'warning' });
    const widget: Widget & { workspaceId: string } = { id: id(), title: widgetTitle.trim(), connectionId: widgetConnection, path: widgetPath.trim(), dataPath: widgetDataPath.trim(), workspaceId: activeWorkspace };
    setWidgets((items) => [...items, widget]); setWidgetTitle(''); setWidgetPath('/'); setWidgetDataPath(''); setShowAddWidget(false); setPage(2);
    toast({ title: 'Widget created', status: 'success' });
    void requestWidget(widget);
  };

  const saveBackend = () => {
    const trimmed = backendUrl.trim().replace(/\/+$/, '');
    if (trimmed) { try { new URL(trimmed); } catch { return toast({ title: 'Backend URL must be absolute', status: 'error' }); } }
    localStorage.setItem(STORAGE.backend, trimmed); setBackendUrl(trimmed); if (trimmed) setBaseUrl(trimmed);
    toast({ title: 'Backend configuration saved', description: 'This is a base URL setting only; connect an integration to fetch API data.', status: 'success' });
  };

  const nav = [
    { label: 'Overview', icon: FiActivity }, { label: 'Integrations', icon: FiCloud },
    { label: 'Widgets', icon: FiLayers }, { label: 'Settings', icon: FiSettings },
  ];

  return (
    <Flex minH="100vh" bg="#0B0D12" color="#F8FAFC" direction={{ base: 'column', lg: 'row' }}>
      <Box w={{ base: 'full', lg: '250px' }} flexShrink={0} bg="#10141D" borderRight="1px solid" borderColor="whiteAlpha.100" p={5}>
        <HStack spacing={3} mb={8}>
          <Flex align="center" justify="center" w="42px" h="42px" rounded="xl" bg="cyan.400" color="#081018"><Icon as={FiLayers} boxSize={6} /></Flex>
          <Box><Heading size="md" letterSpacing="-0.04em">Dashly</Heading><Text color="gray.500" fontSize="xs">API workspace</Text></Box>
        </HStack>
        <Text color="gray.500" fontSize="xs" fontWeight="700" letterSpacing="0.12em" mb={3}>WORKSPACE</Text>
        <Select value={activeWorkspace} onChange={(e) => setActiveWorkspace(e.target.value)} bg="#171D28" borderColor="whiteAlpha.200" mb={6} aria-label="Select workspace">
          {workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}
        </Select>
        <VStack align="stretch" spacing={1}>
          {nav.map((item, index) => <Button key={item.label} justifyContent="flex-start" leftIcon={<Icon as={item.icon} />} variant="ghost" color={page === index ? 'cyan.200' : 'gray.400'} bg={page === index ? 'whiteAlpha.100' : 'transparent'} _hover={{ bg: 'whiteAlpha.100', color: 'white' }} onClick={() => setPage(index)}>{item.label}</Button>)}
        </VStack>
        <Divider borderColor="whiteAlpha.100" my={6} />
        <HStack color="gray.500" fontSize="xs"><Icon as={FiCode} /><Text>React · TypeScript · Vite</Text></HStack>
      </Box>

      <Box flex="1" minW={0} p={{ base: 4, md: 8, xl: 10 }}>
        <Flex justify="space-between" align={{ base: 'start', md: 'center' }} gap={4} wrap="wrap" mb={8}>
          <Box>
            <Text color="cyan.300" fontSize="xs" fontWeight="700" letterSpacing="0.14em" mb={2}>DASHLY WORKSPACE</Text>
            <Heading size="xl" letterSpacing="-0.04em">{nav[page].label}</Heading>
            <Text color="gray.500" mt={2}>{page === 0 ? 'A live overview of your connected services.' : page === 1 ? 'Connect REST APIs and configure request authentication.' : page === 2 ? 'Build data widgets from your own API endpoints.' : 'Configure your workspace and default backend.'}</Text>
          </Box>
          <HStack><Badge colorScheme="cyan" variant="subtle" px={3} py={2} rounded="full">LOCAL CONFIG</Badge><Button leftIcon={<Icon as={FiPlus} />} colorScheme="cyan" onClick={() => page === 1 ? setShowAddConnection(!showAddConnection) : page === 2 ? setShowAddWidget(!showAddWidget) : (setPage(1), setShowAddConnection(true))}>{page === 2 ? 'Add widget' : 'Add integration'}</Button></HStack>
        </Flex>

        {page === 0 && <VStack align="stretch" spacing={6}>
          <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing={4}>
            <Metric label="Integrations" value={String(currentConnections.length)} icon={FiCloud} />
            <Metric label="Widgets" value={String(currentWidgets.length)} icon={FiLayers} />
            <Metric label="Successful fetches" value={String(currentWidgets.filter((widget) => results[widget.id]?.data !== undefined).length)} icon={FiActivity} />
            <Metric label="Needs attention" value={String(currentWidgets.filter((widget) => !!results[widget.id]?.error).length)} icon={FiZap} />
          </SimpleGrid>
          <Flex justify="space-between" align="center"><Box><Heading size="md">Your widgets</Heading><Text color="gray.500" fontSize="sm" mt={1}>Data is fetched directly from your configured API endpoints.</Text></Box><Button variant="outline" borderColor="whiteAlpha.200" leftIcon={<Icon as={FiPlus} />} onClick={() => { setPage(2); setShowAddWidget(true); }}>Create widget</Button></Flex>
          {currentWidgets.length ? <WidgetGrid widgets={currentWidgets} connections={currentConnections} results={results} busy={busy} onRefresh={requestWidget} onRemove={(widget) => setWidgets((items) => items.filter((item) => item.id !== widget.id))} /> : <EmptyState icon={FiLayers} title="Your dashboard starts here" text="Connect an API, then create a widget using an endpoint that returns JSON." action="Browse integrations" onAction={() => setPage(1)} />}
          <Card bg="#10141D" border="1px solid" borderColor="whiteAlpha.100" rounded="2xl"><CardBody><HStack align="start" spacing={4}><Icon as={FiCode} color="cyan.300" boxSize={6} mt={1}/><Box><Heading size="sm">Built to be extended</Heading><Text color="gray.400" fontSize="sm" mt={2} lineHeight="1.7">Use the integration configuration and widget model as a starting point for provider-specific adapters. For private deployments, route secret-bearing requests through a trusted backend.</Text></Box></HStack></CardBody></Card>
        </VStack>}

        {page === 1 && <VStack align="stretch" spacing={5}>
          {showAddConnection && <Card bg="#10141D" border="1px solid" borderColor="cyan.800" rounded="2xl"><CardBody><Heading size="md" mb={5}>New integration</Heading><SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Field label="Integration name"><Input value={connectionName} onChange={(e) => setConnectionName(e.target.value)} placeholder="Production API" /></Field>
            <Field label="Base URL"><Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.example.com" /></Field>
            <Field label="Authentication"><Select value={authType} onChange={(e) => setAuthType(e.target.value as Connection['authType'])}><option value="none">No authentication</option><option value="bearer">Bearer token</option><option value="basic">HTTP Basic</option></Select></Field>
            {authType === 'basic' && <Field label="Username"><Input value={username} onChange={(e) => setUsername(e.target.value)} /></Field>}
            {authType !== 'none' && <Field label={authType === 'bearer' ? 'Bearer token' : 'Password'}><Input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Kept in this browser session only" /></Field>}
            <Field label="Default headers (JSON)"><Textarea value={headers} onChange={(e) => setHeaders(e.target.value)} fontFamily="mono" fontSize="sm" rows={3} /></Field>
          </SimpleGrid><HStack mt={5}><Button colorScheme="cyan" onClick={addConnection}>Save integration</Button><Button variant="ghost" onClick={() => setShowAddConnection(false)}>Cancel</Button></HStack><Text color="orange.200" fontSize="xs" mt={4}>Browser-side API calls require the provider to allow CORS. Do not use this for high-value secrets or privileged production credentials.</Text></CardBody></Card>}
          {currentConnections.length ? <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>{currentConnections.map((connection) => <Card key={connection.id} bg="#10141D" border="1px solid" borderColor="whiteAlpha.100" rounded="2xl"><CardBody><Flex justify="space-between" gap={3}><HStack align="start" spacing={3}><Flex w="44px" h="44px" rounded="xl" bg="cyan.900" color="cyan.200" align="center" justify="center"><Icon as={FiCloud} boxSize={5}/></Flex><Box minW={0}><Heading size="sm">{connection.name}</Heading><Text color="gray.500" fontSize="sm" mt={1} noOfLines={1}>{connection.baseUrl}</Text><HStack mt={3}><Badge colorScheme={connection.authType === 'none' ? 'gray' : 'purple'}>{connection.authType === 'none' ? 'No auth' : connection.authType === 'bearer' ? 'Bearer token' : 'Basic auth'}</Badge><Badge colorScheme="green">Configured</Badge></HStack></Box></HStack><Button aria-label="Remove integration" variant="ghost" color="red.300" onClick={() => removeConnection(connection)}><Icon as={FiTrash2}/></Button></Flex><Divider borderColor="whiteAlpha.100" my={4}/><Text color="gray.500" fontSize="xs">{currentWidgets.filter((widget) => widget.connectionId === connection.id).length} widgets use this integration</Text><Button mt={3} size="sm" variant="outline" borderColor="whiteAlpha.200" onClick={() => { setWidgetConnection(connection.id); setPage(2); setShowAddWidget(true); }}>Create widget</Button></CardBody></Card>)}</SimpleGrid> : <EmptyState icon={FiCloud} title="No integrations yet" text="Add a base URL to connect your first REST API." action="Add integration" onAction={() => setShowAddConnection(true)} />}
        </VStack>}

        {page === 2 && <VStack align="stretch" spacing={5}>
          {showAddWidget && <Card bg="#10141D" border="1px solid" borderColor="cyan.800" rounded="2xl"><CardBody><Heading size="md" mb={5}>Configure widget</Heading><SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Field label="Widget title"><Input value={widgetTitle} onChange={(e) => setWidgetTitle(e.target.value)} placeholder="Account details" /></Field>
            <Field label="Integration"><Select value={widgetConnection} onChange={(e) => setWidgetConnection(e.target.value)} placeholder="Choose integration">{currentConnections.map((connection) => <option key={connection.id} value={connection.id}>{connection.name}</option>)}</Select></Field>
            <Field label="Endpoint path"><Input value={widgetPath} onChange={(e) => setWidgetPath(e.target.value)} placeholder="/v1/account" /></Field>
            <Field label="JSON data path (optional)"><Input value={widgetDataPath} onChange={(e) => setWidgetDataPath(e.target.value)} placeholder="data.account or leave blank" /></Field>
          </SimpleGrid><HStack mt={5}><Button colorScheme="cyan" onClick={addWidget} isDisabled={!currentConnections.length}>Create and fetch</Button><Button variant="ghost" onClick={() => setShowAddWidget(false)}>Cancel</Button></HStack><Text color="gray.500" fontSize="xs" mt={3}>The endpoint must return JSON. A data path such as <code>data.account.name</code> selects a nested value.</Text></CardBody></Card>}
          {currentWidgets.length ? <WidgetGrid widgets={currentWidgets} connections={currentConnections} results={results} busy={busy} onRefresh={requestWidget} onRemove={(widget) => setWidgets((items) => items.filter((item) => item.id !== widget.id))} /> : <EmptyState icon={FiLayers} title="No widgets configured" text="Widgets call an endpoint from one of your integrations and display the returned JSON data." action="Create widget" onAction={() => setShowAddWidget(true)} />}
        </VStack>}

        {page === 3 && <VStack align="stretch" spacing={5}>
          <Card bg="#10141D" border="1px solid" borderColor="whiteAlpha.100" rounded="2xl"><CardBody><Heading size="md" mb={2}>Backend & environment</Heading><Text color="gray.500" fontSize="sm" mb={5}>Set a default backend URL for your own deployment. Integrations remain separately configurable.</Text><FormControl><FormLabel>Default backend URL</FormLabel><Input value={backendUrl} onChange={(e) => setBackendUrl(e.target.value)} placeholder="https://api.yourdomain.com" /></FormControl><Button mt={4} colorScheme="cyan" onClick={saveBackend}>Save backend URL</Button><Text color="gray.500" fontSize="xs" mt={3}>This stores the URL locally and does not automatically create authentication routes or a backend server.</Text></CardBody></Card>
          <Card bg="#10141D" border="1px solid" borderColor="whiteAlpha.100" rounded="2xl"><CardBody><Heading size="md" mb={2}>Workspaces</Heading><Text color="gray.500" fontSize="sm" mb={4}>Separate your integration and widget sets by project.</Text><HStack><Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} placeholder="New workspace name" /><Button colorScheme="cyan" onClick={() => { if (!workspaceName.trim()) return; const workspace = { id: id(), name: workspaceName.trim() }; setWorkspaces((items) => [...items, workspace]); setActiveWorkspace(workspace.id); setWorkspaceName(''); }}>Create</Button></HStack><VStack align="stretch" mt={4} spacing={2}>{workspaces.map((workspace) => <HStack key={workspace.id} justify="space-between" p={3} rounded="lg" bg="whiteAlpha.50"><Text>{workspace.name}</Text>{workspace.id === activeWorkspace ? <Badge colorScheme="cyan">Active</Badge> : <Button size="xs" variant="ghost" onClick={() => setActiveWorkspace(workspace.id)}>Switch</Button>}</HStack>)}</VStack></CardBody></Card>
          <Card bg="#10141D" border="1px solid" borderColor="orange.900" rounded="2xl"><CardBody><Heading size="sm" color="orange.200">Security notes</Heading><Text color="gray.400" fontSize="sm" mt={2} lineHeight="1.8">Integration definitions and workspace metadata are stored in localStorage. API credentials are held in sessionStorage and cleared when the browser session ends. Browser storage is not a secure vault. For production, implement a server-side proxy, provider OAuth, secret storage, and server-enforced access controls.</Text></CardBody></Card>
        </VStack>}
        <Text color="gray.600" fontSize="xs" mt={10}>Dashly is a starter template. Widget data comes from configured endpoints and may be unavailable when an API blocks browser CORS requests.</Text>
      </Box>
    </Flex>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <FormControl><FormLabel>{label}</FormLabel>{children}</FormControl>; }
function Metric({ label, value, icon }: { label: string; value: string; icon: typeof FiActivity }) { return <Card bg="#10141D" border="1px solid" borderColor="whiteAlpha.100" rounded="2xl"><CardBody><Flex justify="space-between" align="center"><Stat><StatLabel color="gray.500">{label}</StatLabel><StatNumber fontSize="3xl" letterSpacing="-0.04em">{value}</StatNumber></Stat><Flex w="42px" h="42px" rounded="xl" bg="cyan.900" color="cyan.200" align="center" justify="center"><Icon as={icon} boxSize={5}/></Flex></Flex></CardBody></Card>; }
function EmptyState({ icon, title, text, action, onAction }: { icon: typeof FiBox; title: string; text: string; action: string; onAction: () => void }) { return <Card bg="#10141D" border="1px dashed" borderColor="whiteAlpha.200" rounded="2xl"><CardBody py={12}><VStack textAlign="center" spacing={3}><Flex w="56px" h="56px" align="center" justify="center" rounded="2xl" bg="whiteAlpha.100" color="cyan.200"><Icon as={icon} boxSize={6}/></Flex><Heading size="md">{title}</Heading><Text color="gray.500" maxW="440px">{text}</Text><Button mt={2} colorScheme="cyan" variant="outline" onClick={onAction}>{action}</Button></VStack></CardBody></Card>; }
function WidgetGrid({ widgets, connections, results, busy, onRefresh, onRemove }: { widgets: Widget[]; connections: Connection[]; results: Record<string, Payload>; busy: Record<string, boolean>; onRefresh: (widget: Widget) => void; onRemove: (widget: Widget) => void }) {
  return <Grid templateColumns={{ base: '1fr', xl: 'repeat(2, minmax(0, 1fr))' }} gap={4}>{widgets.map((widget) => { const result = results[widget.id]; const connection = connections.find((item) => item.id === widget.connectionId); return <Card key={widget.id} bg="#10141D" border="1px solid" borderColor="whiteAlpha.100" rounded="2xl" minW={0}><CardBody><Flex justify="space-between" gap={3} mb={4}><Box minW={0}><Heading size="sm">{widget.title}</Heading><Text color="gray.500" fontSize="xs" mt={1} noOfLines={1}>{connection?.name ?? 'Missing integration'} · {widget.path}</Text></Box><HStack><Button aria-label="Refresh widget" size="sm" variant="ghost" onClick={() => onRefresh(widget)} isLoading={!!busy[widget.id]}><Icon as={FiRefreshCw}/></Button><Button aria-label="Delete widget" size="sm" variant="ghost" color="red.300" onClick={() => onRemove(widget)}><Icon as={FiTrash2}/></Button></HStack></Flex>{result?.error ? <Box bg="red.900" p={3} rounded="lg"><Text color="red.200" fontSize="sm">{result.error}</Text></Box> : result?.data !== undefined ? <Box bg="#0B0D12" border="1px solid" borderColor="whiteAlpha.100" p={3} rounded="lg" maxH="300px" overflow="auto"><Text as="pre" fontFamily="mono" fontSize="xs" whiteSpace="pre-wrap" overflowWrap="anywhere">{pretty(result.data)}</Text></Box> : <VStack py={8} color="gray.500"><Icon as={FiDatabase} boxSize={6}/><Text fontSize="sm">{result?.loading ? 'Fetching API data…' : 'No data fetched yet'}</Text>{result?.loading && <Spinner size="sm" color="cyan.300"/>}</VStack>}<HStack justify="space-between" mt={3}><Badge colorScheme={result?.error ? 'red' : result?.data !== undefined ? 'green' : 'gray'}>{result?.error ? 'Request failed' : result?.data !== undefined ? 'Live response' : 'Not loaded'}</Badge><Text color="gray.600" fontSize="xs">{result?.updatedAt ? new Date(result.updatedAt).toLocaleTimeString() : ''}</Text></HStack></CardBody></Card>; })}</Grid>;
}
