import { Flex, Heading, SimpleGrid } from '@chakra-ui/layout';
import { Card, CardBody, CardFooter, CardHeader, Icon } from '@chakra-ui/react';
import { config } from 'config/common';
import { MdMessage } from 'react-icons/md';
import { useColorsExtend } from 'theme';
import { useSettingsStore } from 'stores';
import { languages, names } from 'config/translations/provider';
import { SelectField } from 'components/forms/SelectField';
import { common } from 'config/translations/common';
import { home } from 'config/translations/home';

export function HomeView() {
  const [lang, setLang] = useSettingsStore((s) => [s.lang, s.setLang]);
  const t = home.useTranslations();
  const { globalBg, textColorSecondary, brand } = useColorsExtend(
    { brand: 'cyan.400' },
    { brand: 'cyan.400' }
  );

  return (
    <Flex w="full" direction="column" gap={3} bg={globalBg}>
      <Flex direction="column">
        <Heading
          fontSize={{ base: '3xl', '2xl': '5xl' }}
          bgGradient={`linear(to-l, blue.200, ${brand})`}
          bgClip="text"
        >
          {t['next gen discord bot']}
        </Heading>
        <Heading fontSize={{ base: '5xl', xl: '7xl' }}>{config.name}</Heading>
      </Flex>

      <SelectField
        value={{ label: names[lang], value: lang }}
        onChange={(e) => setLang(e.value)}
        options={languages.map(({ name, key }) => ({ label: name, value: key }))}
        placeholder={<common.T text="select lang" />}
      />

      <SimpleGrid columns={{ base: 1, '3sm': 2, xl: 3 }} mt="2rem" gap={2}>
        <Card>
          <CardHeader fontSize="2xl" fontWeight="600" pb={1}>
            {t['welcome messages']}
          </CardHeader>
          <CardBody py={0} color={textColorSecondary}>
            {t['welcome messages description']}
          </CardBody>
          <CardFooter>
            <Icon as={MdMessage} />
          </CardFooter>
        </Card>
      </SimpleGrid>
    </Flex>
  );
}
