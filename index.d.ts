declare module "wikibase-edit" {
  export interface WikibaseError extends Error {
    statusCode: number;
    context?: any;
    body?: {
      error: {
        code: string;
        info: string;
        messages?: Array<{ name: string }>;
      };
    };
  }

  interface SuccessResponse {
    success: number;
  }

  interface EntityIdResponse extends SuccessResponse {
    entity: {
      id: string;
      lastrevid: number;
    };
  }

  interface SnakBase {
    snaktype: "value" | "novalue" | "somevalue";
    property: string;
    datatype: string;
  }

  interface DataValue {
    datavalue?: {
      type: string;
      value: any;
    };
  }

  type Snak = SnakBase & DataValue;

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

  export interface QualifierData {
    property: string;
    value: any;
    hash?: string;
  }

  export interface ReferenceData {
    hash?: string;
    snaks: Record<string, any[]>;
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

  export interface Claim {
    id: string;
    mainsnak: Snak;
    type: "statement";
    rank: "normal" | "preferred" | "deprecated";
    qualifiers?: Record<string, Qualifier[]>;
    references?: Reference[];
  }

  export type Qualifier = Snak & { hash: string };

  export interface Reference {
    hash: string;
    snaks: Record<string, Array<Snak & { property: string }>>;
    "snaks-order": string[];
  }

  export interface EntityResponse extends SuccessResponse {
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
  }

  export interface ClaimResponse extends SuccessResponse {
    claim: Claim;
  }

  export interface WikibaseEditAPI {
    entity: {
      create: (params: EntityEdit) => Promise<EntityResponse>;
      edit: (params: EntityEdit) => Promise<EntityResponse>;
      merge: (params: { from: string; to: string }) => Promise<
        {
          from: { id: string; lastrevid: number };
          to: { id: string; lastrevid: number };
        } & SuccessResponse
      >;
      delete: (params: { id: string }) => Promise<SuccessResponse>;
    };
    label: {
      set: (params: {
        id: string;
        language: string;
        value: string;
      }) => Promise<EntityIdResponse>;
    };
    description: {
      set: (params: {
        id: string;
        language: string;
        value: string;
      }) => Promise<EntityIdResponse>;
    };
    alias: Record<
      "add" | "remove" | "set",
      (params: {
        id: string;
        language: string;
        value: string | string[];
      }) => Promise<EntityIdResponse>
    >;
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
      ) => Promise<SuccessResponse>;
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
      }) => Promise<SuccessResponse>;
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
      }) => Promise<SuccessResponse>;
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
