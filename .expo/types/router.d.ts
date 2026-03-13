/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/calendario`; params?: Router.UnknownInputParams; } | { pathname: `/classificacao`; params?: Router.UnknownInputParams; } | { pathname: `/educacao-fisica`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/inscricao`; params?: Router.UnknownInputParams; } | { pathname: `/modalidades`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/calendario`; params?: Router.UnknownOutputParams; } | { pathname: `/classificacao`; params?: Router.UnknownOutputParams; } | { pathname: `/educacao-fisica`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/inscricao`; params?: Router.UnknownOutputParams; } | { pathname: `/modalidades`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/calendario${`?${string}` | `#${string}` | ''}` | `/classificacao${`?${string}` | `#${string}` | ''}` | `/educacao-fisica${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/inscricao${`?${string}` | `#${string}` | ''}` | `/modalidades${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/calendario`; params?: Router.UnknownInputParams; } | { pathname: `/classificacao`; params?: Router.UnknownInputParams; } | { pathname: `/educacao-fisica`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/inscricao`; params?: Router.UnknownInputParams; } | { pathname: `/modalidades`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
