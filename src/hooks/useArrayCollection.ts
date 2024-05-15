import { useCallback, useEffect, useRef, useState } from 'react';
import {
    CollectionProvider,
    CollectionProviderState,
    CollectionQuery,
    defaultQuery,
    EntriesOperation,
    Entry,
} from '@packages/core/collection/collection';
import { createUniqueId } from '@utils/createUniqueId';

interface EntriesToShowConfig<Data = unknown> {
    currentEntries: Entry<Data>[];
    availableEntries: Entry<Data>[];
    query?: CollectionQuery;
    op?: EntriesOperation;
}

export interface ArrayCollectionProviderProps<Data = unknown> {
    dataArray: Data[];
    createEntryKey: (_data: Data) => string;
}

const getPaginatedEntries = <Data extends unknown>(entries: Entry<Data>[], query: CollectionQuery) =>
    entries.slice(query.offset, query.offset + query.limit);

const createEntriesToShow = <Data extends unknown>({
    availableEntries,
    currentEntries,
    op,
    query = defaultQuery,
}: EntriesToShowConfig<Data>): Entry<Data>[] => {
    // todo: support filtering (not part of the tutorial yet)
    // todo: support sorting (not part of the tutorial yet)
    const paginatedEntries = getPaginatedEntries(availableEntries, query);
    const entriesToShow =
        op === 'append' && currentEntries?.length ? [...currentEntries, ...paginatedEntries] : paginatedEntries;
    return entriesToShow;
};

export const useArrayCollection = <Data extends unknown>({
    createEntryKey,
    dataArray,
}: ArrayCollectionProviderProps<Data>): CollectionProvider<Data> => {
    const [state, setState] = useState<CollectionProviderState<Data>>({
        key: createUniqueId(),
        isFetching: false,
        entries: [],
        hasInitialFetchBeenDone: false,
    });

    const availableEntriesRef = useRef<Entry<Data>[]>(
        dataArray.map((data) => ({
            key: createEntryKey(data),
            data,
        }))
    );
    useEffect(() => {
        availableEntriesRef.current = dataArray.map((data) => ({
            key: createEntryKey(data),
            data,
        }));
        setState((prevState) => ({
            ...prevState,
            entries: createEntriesToShow({
                availableEntries: availableEntriesRef.current,
                query: prevState.latestQueryInfo,
                currentEntries: prevState.entries,
            }),
            hasInitialFetchBeenDone: true,
        }));
    }, [setState, availableEntriesRef, state, dataArray, createEntryKey]);
    const fetch = useCallback(async (query: CollectionQuery = defaultQuery, op: EntriesOperation = 'replace') => {
        setState((prevState) => ({
            ...prevState,
            entries: createEntriesToShow({
                availableEntries: availableEntriesRef.current,
                query,
                currentEntries: prevState.entries,
                op,
            }),
            hasInitialFetchBeenDone: true,
        }));
    }, []);

    return { ...state, fetch };
};
