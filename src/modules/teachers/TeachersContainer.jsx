import React, { useEffect, useMemo, useState } from 'react';
import { Input, Pagination, Row, Space, Table, Typography, notification } from 'antd';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container.jsx';
import { URLS } from '../../constants/url.js';
import { request } from '../../services/api';

const TeachersContainer = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ size: 10 });
  const [list, setList] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('filterDTO', JSON.stringify({
        fullName: get(filters,'fullName'),
        phone: get(filters,'phone'),
        language: get(filters,'language'),
        active: get(filters,'active'),
      }));
      params.append('page', page);
      params.append('size', get(filters,'size',10));
      const { data } = await request.get(`${URLS.teachers_list}?${params.toString()}`);
      setList({ content: get(data,'content',[]), totalElements: get(data,'totalElements',0), totalPages: get(data,'totalPages',0) });
    } catch {
      notification.error({ message: 'Failed to load teachers' });
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchList(); }, [page, JSON.stringify(filters)]);

  const columns = useMemo(()=>[
    { title: t('ID'), dataIndex: 'id', key: 'id', width: 80 },
    { title: t('Full name'), dataIndex: 'fullName', key: 'fullName' },
    { title: t('Phone'), dataIndex: 'phone', key: 'phone' },
    { title: t('Language'), dataIndex: 'language', key: 'language' },
    { title: t('Active'), dataIndex: 'active', key: 'active', render: (a)=> a? t('Yes'): t('No') },
  ], [t]);

  return (
    <Container>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space>
          <Input placeholder={t('Full name')} allowClear value={get(filters,'fullName','')} onChange={(e)=> setFilters(s=>({...s,fullName:get(e,'target.value')}))} />
          <Input placeholder={t('Phone')} allowClear value={get(filters,'phone','')} onChange={(e)=> setFilters(s=>({...s,phone:get(e,'target.value')}))} />
        </Space>
        <Table rowKey={(r)=>get(r,'id')} columns={columns} loading={loading} dataSource={get(list,'content',[])} pagination={false} />
        <Row justify="space-between" style={{ marginTop: 10 }}>
          <Typography.Title level={5}>{t('Total')}: {get(list,'totalElements',0)}</Typography.Title>
          <Pagination current={page+1} onChange={(p)=>setPage(p-1)} total={get(list,'totalPages',0)*10} showSizeChanger={false} />
        </Row>
      </Space>
    </Container>
  );
};

export default TeachersContainer;


