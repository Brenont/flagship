import React from 'react';
import { storiesOf } from '@storybook/react';
import { object } from '@storybook/addon-knobs';
import { CMSBannerCarousel } from '../src/components/CMSBannerCarousel';

import { CoreContentManagementSystemProvider } from '@brandingbrand/fsengage';

const provider = new CoreContentManagementSystemProvider({
  propertyId: '443',
  environment: 1,
});

const defaultCarouselProps = {
  height: 200,
  showArrow: true,
};

const containerStyle = { padding: 0 };
const imageContainerStyle = { padding: 0 };

storiesOf('CMSBannerCarousel', module).add('basic usage', () => (
  <CMSBannerCarousel
    cmsProviderManagementConfig={provider}
    cmsProviderGroup="Shop"
    cmsProviderSlot="Banner-Carousel"
    carouselProps={object('carouselProps', defaultCarouselProps)}
    style={object('containerStyle', containerStyle)}
    imageContainerStyle={object('imageContainerStyle', imageContainerStyle)}
  />
));
