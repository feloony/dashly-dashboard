import { Icon } from '@chakra-ui/react';
import { MdMessage } from 'react-icons/md';
import { FeaturesConfig } from './types';
import { useWelcomeMessageFeature } from './example/WelcomeMessageFeature';

/**
 * Only expose a feature that has a real configuration form.
 * The backend must implement the matching feature endpoints as well.
 */
export const features: FeaturesConfig = {
  'welcome-message': {
    name: 'Welcome Message',
    description: 'Send a message when a new member joins the server.',
    icon: <Icon as={MdMessage} w={5} h={5} />,
    useRender: useWelcomeMessageFeature,
  },
};
