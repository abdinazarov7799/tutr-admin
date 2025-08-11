import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, Pagination, Row, Space, Switch, Table, Typography, notification, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container.jsx';
import { URLS } from '../../constants/url.js';
import { request } from '../../services/api';

const CoursesContainer = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ size: 10 });
  const [list, setList] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const payload = { page, size: get(filters, 'size', 10), ...filters };
      const { data } = await request.post(URLS.courses_filter, payload);
      setList({
        content: get(data, 'content', []),
        totalElements: get(data, 'totalElements', 0),
        totalPages: get(data, 'totalPages', 0),
      });
    } catch {
      notification.error({ message: 'Failed to load courses' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, [page, JSON.stringify(filters)]);

  const onActivate = async (record, activate) => {
    try { await request.patch(URLS.courses_activate(get(record,'id'), activate)); fetchList(); }
    catch { notification.error({ message: 'Failed to update' }); }
  };

  const columns = useMemo(() => [
    { title: t('ID'), dataIndex: 'id', key: 'id', width: 80 },
    { title: t('Title'), dataIndex: 'title', key: 'title' },
    { title: t('Type'), dataIndex: 'courseTypeName', key: 'courseTypeName' },
    { title: t('Format'), dataIndex: 'courseFormatName', key: 'courseFormatName' },
    { title: t('Category'), dataIndex: 'categoryName', key: 'categoryName' },
    { title: t('Teacher'), dataIndex: 'teacherName', key: 'teacherName' },
    { title: t('Rate'), dataIndex: 'rate', key: 'rate', width: 100 },
    {
      title: t('Active'), dataIndex: 'active', key: 'active', width: 120,
      render: (active, record) => <Switch checked={!!active} onChange={(val) => onActivate(record, val)} />
    },
    {
      title: t('Actions'), key: 'actions', width: 140, render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Popconfirm
            title={t('Delete')}
            description={t('Are you sure to delete?')}
            okText={t('Yes')}
            cancelText={t('No')}
            onConfirm={async () => {
              try { await request.delete(URLS.courses_delete(get(r,'id'))); fetchList(); }
              catch { notification.error({ message: 'Failed to delete' }); }
            }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ], [t]);

  return (
    <Container>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space>
          <Input placeholder={t('Title')} allowClear value={get(filters,'title','')} onChange={(e)=> setFilters(s=>({...s,title:get(e,'target.value')}))} />
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

export default CoursesContainer;


