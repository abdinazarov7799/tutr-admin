import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Select, Spin, notification } from 'antd';
import { debounce } from 'lodash';
import { get } from 'lodash';
import { useQueryClient } from 'react-query';
import { request } from '../services/api';

const defaultTransform = (item) => ({
  label: get(item, 'title') ?? get(item, 'label') ?? get(item, 'name'),
  value: get(item, 'id'),
});

export default function AsyncSelect({
  apiPath,
  customFetch,
  transformOption = defaultTransform,
  mode,
  value,
  onClear,
  ...rest
}) {
  const queryClient = useQueryClient();
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const pageRef = useRef(1);

  const fetchDefault = useCallback(
    async ({ search = '', page = 1 }) => {
      if (!apiPath) return { data: [], total: 0 };
      const params = { pageNumber: page, pageSize: 20, searchFts: search };
      const responseData = await queryClient.fetchQuery(
        [apiPath, search, page],
        async () => {
          const res = await request.get(apiPath, { params });
          return get(res, 'data', {});
        }
      );
      const list = Array.isArray(responseData)
        ? responseData
        : get(responseData, 'content', []);
      const totalElements = get(responseData, 'totalElements', list.length);
      return { data: list, total: totalElements };
    },
    [apiPath, queryClient]
  );

  const doFetch = customFetch ?? fetchDefault;

  const loadOptions = useCallback(
    async (searchTerm, page) => {
      setLoading(true);
      try {
        const res = await doFetch({ search: searchTerm, page });
        const mapped = res.data
          .map(transformOption)
          .filter(o => o && o.value !== undefined && o.label !== undefined);
        setOptions(prev => {
          const merged = page === 1 ? mapped : [...prev, ...mapped];
          const seen = new Set();
          return merged.filter(opt => {
            if (seen.has(opt.value)) return false;
            seen.add(opt.value);
            return true;
          });
        });
        setTotal(res.total);
      } catch (err) {
        notification.error({
          message: "Ma'lumot yuklashda xato",
          description: get(err, 'message') || "Noma'lum xato yuz berdi",
        });
      } finally {
        setLoading(false);
      }
    },
    [doFetch, transformOption]
  );

  const debouncedSearch = useMemo(
    () => debounce((val) => setSearch(val), 400),
    []
  );
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    pageRef.current = 1;
    setOptions([]);
    loadOptions(search, 1);
  }, [search, loadOptions]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10 && options.length < total && !loading) {
      pageRef.current += 1;
      loadOptions(search, pageRef.current);
    }
  };

  const handleClear = () => {
    setSearch('');
    pageRef.current = 1;
    setOptions([]);
    loadOptions('', 1);
    onClear?.();
  };

  useEffect(() => {
    if (mode === 'multiple' && Array.isArray(value)) {
      const missing = value.filter(v => !options.some(o => o.value === v));
      if (missing.length && !loading) {
        (async () => {
          setLoading(true);
          try {
            const res = await doFetch({ search: '', page: 1 });
            const found = get(res, 'data', []).filter((item) => missing.includes(get(item, 'id')));
            const opts = found.map(transformOption);
            setOptions(prev => {
              const seen = new Set(prev.map(o => o.value));
              return [...prev, ...opts.filter(o => !seen.has(o.value))];
            });
          } catch (err) {
            notification.error({
              message: 'Qiymatlarni yuklashda xato',
              description: get(err, 'message'),
            });
          } finally {
            setLoading(false);
          }
        })();
      }
    }
  }, [value, mode, options, doFetch, transformOption, loading]);

  return (
      <Select
        mode={mode}
        showSearch
        filterOption={false}
        options={options}
        value={value ?? undefined}
        notFoundContent={loading ? <Spin size="small" /> : null}
        onSearch={debouncedSearch}
        onPopupScroll={handleScroll}
        onClear={handleClear}
        loading={loading}
        allowClear
        style={{ width: '100%' }}
        {...rest}
      />
  );
}
