import React from 'react';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { ShareButton } from '../src/components/ShareButton/ShareButton';

storiesOf('ShareButton', module)
  .add('share url', () => (
    <ShareButton
      content={{
        title: text('Share Text', 'Test Share Text'),
        url: text('Share URL', 'https://brandingbrand.github.io/flagship/storybook'),
      }}
    />
  ))
  .add('share message', () => (
    <ShareButton
      content={{
        title: text('Share Text', 'Test Share Text'),
        message: text('Share Message', 'Test Share Message'),
      }}
    />
  ));
