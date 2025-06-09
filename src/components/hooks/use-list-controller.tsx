import api from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useListController({
    endpoint,
    defaultOrderBy,
    defaultSortedBy,
    defaultLimit,
    searchFieldsOptions,
    filtersOptions,
    session,
    catchError
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Pegue os valores atuais dos parâmetros
    const orderBy = searchParams.get("orderBy") || defaultOrderBy;
    const sortedBy = searchParams.get("sortedBy") === "desc" ? "desc" : defaultSortedBy;
    const filtersParam = searchParams.get("filters") || "";
    const currentPage = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || defaultLimit;
    const searches = searchParams.get("searches") || "";
    const searchFieldsParams = searchParams.get("searchFields") || "";
    const search =  searchParams.get("searches")?.split(";")[0]?.split(":")[1] || "";

    const [searchFields, setSearchFields] = useState<string[]>(
        searchFieldsParams ? searchFieldsParams.split(",") : searchFieldsOptions.map(f => f.field)
    );
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState<any>(null);
    const [subfilterLabels, setSubfilterLabels] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        getDados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const getDados = useCallback(async () => {
        setLoading(true);
        try {
            const url = `${endpoint}${window.location.search}`;
            const response = await api((session?.user as any)?.accessToken).get(url);
            setData(response.data.data);
            setMeta(response.data.meta?.pagination);
        } catch (error) {
            catchError(error);
        } finally {
            setLoading(false);
        }
    }, [endpoint, session, catchError]);

    const buildQueryString = (params: any = {}) => {
        const q = {
            orderBy,
            sortedBy,
            page: currentPage,
            limit,
            ...params
        };
        let str = `?orderBy=${q.orderBy}&sortedBy=${q.sortedBy}&page=${q.page}&limit=${q.limit}`;

        // Busca
        if (q.textSearch && searchFields.length > 0) {
            const searchesStr = searchFields.map(f => `${f}:${q.textSearch}`).join(";");
            const searchFieldsStr = searchFields.map(f => `${f}:like`).join(";");
            str += `&searches=${searchesStr}&searchFields=${searchFieldsStr}`;
        } else if (!q?.clearSearch && searches && searchFieldsParams) {
            str += `&searches=${searches}&searchFields=${searchFieldsParams}`;
        }

        // Filtros
        if(q?.clearFilters) {

        } else {
            if (q.filters && q.filters !== "all") {
                str += `&filters=${q.filters}`;
            } else if (filtersParam && !q.filters) {
                str += `&filters=${filtersParam}`;
            }
        }

        return str;
    };

    const onClearFilters = () => {
        setSubfilterLabels({});
        router.replace(
            buildQueryString({
                page: 1,
                clearSearch: true,
                clearFilters: true
            })
        );
    }

    const onPageChange = (newPage: number) => {
        router.replace(buildQueryString({ page: newPage + 1 }));
    };

    const onRowsPerPageChange = (limit: number) => {
        router.replace(buildQueryString({ page: 1, limit }));
    };

    const handleOrderChange = (field: string) => {
        router.replace(buildQueryString({ orderBy: field }));
    };

    const handleDirChange = (dir: "asc" | "desc") => {
        router.replace(buildQueryString({ sortedBy: dir }));
    };

    const handleSearchFieldToggle = (field: string) => {
        setSearchFields(prev =>
            prev.includes(field)
                ? prev.filter(f => f !== field)
                : [...prev, field]
        );
    };

    const handleSelectAll = () => {
        setSearchFields(prev =>
            prev.length === searchFieldsOptions.length ? [] : searchFieldsOptions.map(f => f.field)
        );
    };

    const handleSearch = (clear = false, text = "") => {
        if (!clear && text.length > 0 && searchFields.length > 0) {
            router.replace(buildQueryString({ page: 1, textSearch: text }));
        } else {
            router.replace(buildQueryString({ page: 1, clearSearch: true }));
        }
    };

    const handleTabClick = (filter: any, idx: number, event: React.MouseEvent<HTMLElement>) => {
        if (filter.subfilters) return;
        if (filter.label === "Todos") {
            setSubfilterLabels({});
            router.replace(buildQueryString({ filters: "all", page: 1 }));
            return;
        }
        const prev = getActiveFilters();
        const alreadySelected = prev.includes(filter.query);
        const newFilters = alreadySelected
            ? prev.filter(f => f !== filter.query)
            : [...prev, filter.query];
        router.replace(buildQueryString({ filters: newFilters.length ? newFilters.join(";") : "all", page: 1 }));
    };

    const handleSubfilterClick = (subfilter: any, idx: number) => {
        const prev = getActiveFilters();
        const group = filtersOptions[idx];
        const groupQueries = group.subfilters.map((s: any) => s.query);
        const alreadySelected = prev.includes(subfilter.query);
        let newFilters;
        if (alreadySelected) {
            newFilters = prev.filter(f => f !== subfilter.query);
        } else {
            const filtered = prev.filter(f => !groupQueries.includes(f));
            newFilters = [...filtered, subfilter.query];
        }
        router.replace(buildQueryString({ filters: newFilters.length ? newFilters.join(";") : "all", page: 1 }));
        setSubfilterLabels(prevLabels => ({
            ...prevLabels,
            [idx]: alreadySelected ? group.label : subfilter.label
        }));
    };

    const getActiveFilters = () => filtersParam ? filtersParam.split(";").filter(Boolean) : [];

    return {
        search,
        searchFields, setSearchFields,
        data, loading, meta,
        subfilterLabels, filtersParam,
        handleOrderChange, handleDirChange,
        handleSearchFieldToggle, handleSelectAll, handleSearch,
        handleTabClick, handleSubfilterClick,
        getDados,
        orderBy, sortedBy, limit,
        buildQueryString,
        onPageChange,
        onRowsPerPageChange,
        onClearFilters
    };
}
