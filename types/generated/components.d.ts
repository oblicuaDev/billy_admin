import type { Schema, Attribute } from '@strapi/strapi';

export interface ConfigTonos extends Schema.Component {
  collectionName: 'components_config_tonos';
  info: {
    displayName: 'Tonos';
    icon: 'bell';
  };
  attributes: {
    amigable: Attribute.Component<'config.tono'>;
    formal: Attribute.Component<'config.tono'>;
    exigente: Attribute.Component<'config.tono'>;
    con_plantilla: Attribute.Component<'config.tono'>;
  };
}

export interface ConfigTono extends Schema.Component {
  collectionName: 'components_config_tono';
  info: {
    displayName: 'Tono';
    icon: 'bell';
  };
  attributes: {
    canales: Attribute.Component<'config.canales'>;
    active: Attribute.Boolean & Attribute.DefaultTo<false>;
    filters: Attribute.JSON & Attribute.DefaultTo<[]>;
  };
}

export interface ConfigCanales extends Schema.Component {
  collectionName: 'components_config_canales';
  info: {
    displayName: 'Canales';
    icon: 'channels';
  };
  attributes: {
    email: Attribute.Boolean & Attribute.DefaultTo<false>;
    sms: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'config.tonos': ConfigTonos;
      'config.tono': ConfigTono;
      'config.canales': ConfigCanales;
    }
  }
}
