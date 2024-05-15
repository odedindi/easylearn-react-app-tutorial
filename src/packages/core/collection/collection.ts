export type Sort = 'asc' | 'desc';
export type Sorting = {
    field: string;
    direction: Sort;
}[];

export interface Filters {
    [field: string]: string | number | boolean;
}

// Let's wrap the data in an "entry" holding a recognizable "key", because
// not every entity should be forced to hold a primary key called "id".
// Therefore we need to be able to create a custom and recognizable key, directly after
// a fetch process has been finished.
export interface Entry<Data = any> {
    key: string;
    data: Data;
}

// Furthermore we should support pagination by a "limit" and "offset" param.
// This keeps the door open to reload some entries for every constellation.
export interface CollectionQuery {
    search?: string;
    offset: number;
    limit: number;
    filters: Filters;
    sorting: Sorting;
}

// Furthermore we should provide a collection information object holding at least all params
// of the query itself.
// With this we store the information for which filters, sorting and pagination params the delivered entries
// were received. This should normally correspond with the params of the query, but HAS NOT TO!
export interface CollectionInfo extends CollectionQuery {
    totalCount: number;
    filteredCount: number;
}

// To display useful information we should support things like "isFetching" in the
// state of a collection provider. With this we e.g. could show a loader icon or so.
export interface CollectionProviderState<Data extends unknown> {
    key: string;
    isFetching: boolean;
    hasInitialFetchBeenDone: boolean;
    entries: Entry<Data>[];
    latestQueryInfo?: CollectionInfo;
}

export type EntriesOperation = 'append' | 'replace';
// Let's provide a reusable default query
export const defaultQuery: CollectionQuery = {
    offset: 0,
    limit: 10,
    filters: {},
    sorting: [],
};

export interface CollectionProvider<Data extends unknown> extends CollectionProviderState<Data> {
    fetch: (_query?: CollectionQuery, _op?: EntriesOperation) => Promise<void>;
}

export const createQuery = <Data = unknown>(provider: CollectionProvider<Data>): CollectionQuery => ({
    ...defaultQuery,
    ...(provider.latestQueryInfo ?? {}),
});

// Let's create a query example with a default query object
// createQuery<{}>({
//     key: 'string',
//     isFetching: false,
//     hasInitialFetchBeenDone: false,
//     entries: [],
//     fetch: async (_query, _op) => await Promise.resolve({}),
//     latestQueryInfo: {
//         search: 'string',
//         offset: 0,
//         limit: 10,
//         filters: {},
//         sorting: [],
//         totalCount: 0,
//         filteredCount: 0,
//     },
// });
