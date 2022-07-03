import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
export type Action = {};
export type Actions = {};
export type Dispatch = (action: Action) => void;

export type State = {
    config: TStoreFrontConfig;
};
