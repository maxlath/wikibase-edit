declare module "wikibase-edit" {
  export interface WikibaseEditConfig {
    instance?: string;
    wgScriptPath?: string;
    anonymous?: boolean;
    credentials?: {
      username?: string;
      password?: string;
      oauth?: {
        consumer_key: string;
        consumer_secret: string;
        token: string;
        token_secret: string;
      };
    };
    userAgent?: string;
    bot?: boolean;
    maxlag?: number;
    baserevid?: number;
    summary?: string;
    tags?: string | string[];
    properties?: Record<string, string>;
  }

  export interface EntityEdit {
    id?: string;
    type?: "item" | "property";
    datatype?: string;
    labels?: Record<string, string | { value: string; remove?: boolean }>;
    descriptions?: Record<string, string | { value: string; remove?: boolean }>;
    aliases?: Record<string, string[] | { value: string[]; remove?: boolean }>;
    claims?: Record<string, ClaimData | ClaimData[]>;
    sitelinks?: Record<string, string | { title: string; badges?: string[] }>;
    summary?: string;
    baserevid?: number;
  }

  export interface ClaimData {
    id?: string;
    type?: string;
    rank?: "normal" | "preferred" | "deprecated";
    value?: any;
    qualifiers?: Record<string, QualifierData[]>;
    references?: ReferenceData[];
    remove?: boolean;
    snaktype?: "value" | "novalue" | "somevalue";
  }

  export interface QualifierData {
    property: string;
    value: any;
    hash?: string;
  }

  export interface ReferenceData {
    hash?: string;
    snaks: Record<string, any[]>;
  }

  export interface EntityResponse {
    entity: {
      id: string;
      type: "item" | "property";
      labels?: Record<string, { language: string; value: string }>;
      descriptions?: Record<string, { language: string; value: string }>;
      aliases?: Record<string, { language: string; value: string }[]>;
      claims?: Record<string, Claim[]>;
      sitelinks?: Record<
        string,
        { site: string; title: string; badges: string[] }
      >;
      lastrevid: number;
    };
    success: number;
  }

  export interface Claim {
    id: string;
    mainsnak: {
      snaktype: "value" | "novalue" | "somevalue";
      property: string;
      datatype: string;
      datavalue?: {
        type: string;
        value: any;
      };
    };
    type: "statement";
    rank: "normal" | "preferred" | "deprecated";
    qualifiers?: Record<string, Qualifier[]>;
    references?: Reference[];
  }

  export interface Qualifier {
    hash: string;
    snaktype: "value" | "novalue" | "somevalue";
    property: string;
    datatype: string;
    datavalue?: {
      type: string;
      value: any;
    };
  }

  export interface Reference {
    hash: string;
    snaks: Record<
      string,
      {
        property: string;
        snaktype: string;
        datavalue: {
          type: string;
          value: any;
        };
      }[]
    >;
    "snaks-order": string[];
  }

  export interface ClaimResponse {
    claim: Claim;
    success: number;
  }

  export interface WikibaseEditAPI {
    entity: {
      create: (params: EntityEdit) => Promise<EntityResponse>;
      edit: (params: EntityEdit) => Promise<EntityResponse>;
      merge: (params: { from: string; to: string }) => Promise<{
        from: { id: string; lastrevid: number };
        to: { id: string; lastrevid: number };
        success: number;
      }>;
      delete: (params: { id: string }) => Promise<{ success: number }>;
    };
    label: {
      set: (params: {
        id: string;
        language: string;
        value: string;
      }) => Promise<{
        entity: { id: string; lastrevid: number };
        success: number;
      }>;
    };
    description: {
      set: (params: {
        id: string;
        language: string;
        value: string;
      }) => Promise<{
        entity: { id: string; lastrevid: number };
        success: number;
      }>;
    };
    alias: {
      add: (params: {
        id: string;
        language: string;
        value: string | string[];
      }) => Promise<{
        entity: { id: string; lastrevid: number };
        success: number;
      }>;
      remove: (params: {
        id: string;
        language: string;
        value: string | string[];
      }) => Promise<{
        entity: { id: string; lastrevid: number };
        success: number;
      }>;
      set: (params: {
        id: string;
        language: string;
        value: string | string[];
      }) => Promise<{
        entity: { id: string; lastrevid: number };
        success: number;
      }>;
    };
    claim: {
      create: (params: {
        id: string;
        property: string;
        value: any;
        qualifiers?: Record<string, any[]>;
        references?: ReferenceData[];
      }) => Promise<ClaimResponse>;
      remove: (
        params: { guid: string } | { id: string; property: string; value: any },
      ) => Promise<{
        success: number;
      }>;
      update: (params: {
        guid: string;
        property: string;
        oldValue: any;
        newValue: any;
      }) => Promise<ClaimResponse>;
      move: (params: {
        guid?: string;
        propertyClaimsId?: string;
        id: string;
        property: string;
      }) => Promise<ClaimResponse[]>;
    };
    qualifier: {
      set: (params: {
        guid: string;
        hash?: string;
        property: string;
        value: any;
      }) => Promise<ClaimResponse>;
      remove: (params: {
        guid: string;
        hash: string | string[];
      }) => Promise<{ success: number }>;
      update: (params: {
        guid: string;
        property: string;
        oldValue: any;
        newValue: any;
      }) => Promise<ClaimResponse>;
      move: (params: {
        guid: string;
        oldProperty: string;
        newProperty: string;
        hash?: string;
      }) => Promise<{ claim: Claim }>;
    };
    reference: {
      set: (params: {
        guid: string;
        hash?: string;
        snaks: Record<string, any[]>;
      }) => Promise<ClaimResponse>;
      remove: (params: {
        guid: string;
        hash: string | string[];
      }) => Promise<{ success: number }>;
    };
    sitelink: {
      set: (params: {
        id: string;
        site: string;
        title: string;
        badges?: string[];
      }) => Promise<EntityResponse>;
    };
    badge: {
      add: (params: {
        id: string;
        site: string;
        badges: string[];
      }) => Promise<EntityResponse>;
      remove: (params: {
        id: string;
        site: string;
        badges: string[];
      }) => Promise<EntityResponse>;
    };
    getAuthData: (config?: Partial<WikibaseEditConfig>) => Promise<{
      token: string;
      cookie: string;
    }>;
  }

  export default function wikibaseEdit(
    config?: WikibaseEditConfig,
  ): WikibaseEditAPI;
}
