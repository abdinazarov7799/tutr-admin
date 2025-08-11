import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, Pagination, Row, Space, Table, Typography, notification } from 'antd';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container.jsx';
import { URLS } from '../../constants/url.js';
import { request } from '../../services/api';

const CourseReviewsContainer = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ size: 10 });
  const [list, setList] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const payload = { page, size: get(filters, 'size', 10), ...filters };
      const { data } = await request.post(URLS.course_reviews_filter, payload);
      setList({
        content: get(data, 'content', []),
        totalElements: get(data, 'totalElements', 0),
        totalPages: get(data, 'totalPages', 0),
      });
    } catch (e) {
      notification.error({ message: 'Failed to load reviews' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, [page, JSON.stringify(filters)]);

  const columns = useMemo(() => [
    { title: t('ID'), dataIndex: 'id', key: 'id', width: 80 },
    { title: t('Course'), dataIndex: 'courseTitle', key: 'courseTitle' },
    { title: t('Student'), dataIndex: 'studentName', key: 'studentName' },
    { title: t('Rating'), dataIndex: 'rating', key: 'rating', width: 120 },
    { title: t('Comment'), dataIndex: 'comment', key: 'comment' },
    {
      title: t('Actions'), key: 'actions', width: 120, render: (_, record) => (
        <Space>
          <Popconfirm
            title={t('Delete')}
            description={t('Are you sure to delete?')}
            okText={t('Yes')}
            cancelText={t('No')}
            onConfirm={async () => {
              try { await request.delete(URLS.course_reviews_delete(get(record, 'id'))); fetchList(); }
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
          <Input
            placeholder={t('Course Title')}
            allowClear
            value={get(filters, 'courseTitle', '')}
            onChange={(e) => setFilters((s) => ({ ...s, courseTitle: get(e, 'target.value') }))}
          />
          <Input
            placeholder={t('Student Name')}
            allowClear
            value={get(filters, 'studentName', '')}
            onChange={(e) => setFilters((s) => ({ ...s, studentName: get(e, 'target.value') }))}
          />
        </Space>

        <Table rowKey={(r) => get(r, 'id')} columns={columns} loading={loading} dataSource={get(list, 'content', [])} pagination={false} />

        <Row justify="space-between" style={{ marginTop: 10 }}>
          <Typography.Title level={5}>
            {t('Total')}: {get(list, 'totalElements', 0)}
          </Typography.Title>
          <Pagination current={page + 1} onChange={(p) => setPage(p - 1)} total={get(list, 'totalPages', 0) * 10} showSizeChanger={false} />
        </Row>
      </Space>
    </Container>
  );
};

export default CourseReviewsContainer;


