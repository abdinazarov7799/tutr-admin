import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Space,
  Switch,
  Table,
  Typography,
  notification,
  Popconfirm
} from 'antd';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container.jsx';
import { URLS } from '../../constants/url.js';
import { request } from '../../services/api';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const RewardsContainer = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ size: 10 });
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const payload = { page, size: get(filters, 'size', 10), ...filters };
      const { data } = await request.post(URLS.rewards_filter, payload);
      setList({
        content: get(data, 'content', []),
        totalElements: get(data, 'totalElements', 0),
        totalPages: get(data, 'totalPages', 0),
      });
    } catch (e) {
      notification.error({ message: 'Failed to load rewards' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, [page, JSON.stringify(filters)]);

  const onActivate = async (record, activate) => {
    try {
      await request.post(URLS.rewards_activate(get(record, 'id'), activate));
      fetchList();
    } catch (e) {
      notification.error({ message: 'Failed to update' });
    }
  };

  const onDelete = async (id) => {
    try {
      await request.delete(URLS.rewards_delete(id));
      fetchList();
    } catch (e) {
      notification.error({ message: 'Failed to delete' });
    }
  };

  const onFinish = async (values) => {
    try {
      setIsSaving(true);
      if (selected) {
        await request.patch(URLS.rewards_patch(get(selected, 'id')), values);
      } else {
        await request.post(URLS.rewards_create, values);
      }
      setOpen(false);
      setSelected(null);
      fetchList();
    } catch (e) {
      notification.error({ message: 'Failed to save' });
    } finally {
      setIsSaving(false);
    }
  };

  const columns = useMemo(() => [
    { title: t('ID'), dataIndex: 'id', key: 'id', width: 80 },
    { title: t('Name UZ'), dataIndex: 'nameUz', key: 'nameUz' },
    { title: t('Name RU'), dataIndex: 'nameRu', key: 'nameRu' },
    { title: t('Name EN'), dataIndex: 'nameEn', key: 'nameEn' },
    { title: t('Required Subscriptions'), dataIndex: 'requiredSubscriptions', key: 'requiredSubscriptions', width: 180 },
    { title: t('Required Months'), dataIndex: 'requiredMonths', key: 'requiredMonths', width: 160 },
    { title: t('Priority'), dataIndex: 'priority', key: 'priority', width: 120 },
    {
      title: t('Active'),
      dataIndex: 'active',
      key: 'active',
      width: 120,
      render: (active, record) => (
        <Switch checked={!!active} onChange={(val) => onActivate(record, val)} />
      ),
    },
    {
      title: t('Actions'),
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => { setSelected(record); setOpen(true); }} />
          <Popconfirm
            title={t('Delete')}
            description={t('Are you sure to delete?')}
            okText={t('Yes')}
            cancelText={t('No')}
            onConfirm={() => onDelete(get(record, 'id'))}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ], [t]);

  return (
    <Container>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelected(null); setOpen(true); }}>
            {t('Create')}
          </Button>
          <Input
            placeholder={t('Name UZ')}
            allowClear
            value={get(filters, 'nameUz', '')}
            onChange={(e) => setFilters((s) => ({ ...s, nameUz: get(e, 'target.value') }))}
          />
          <Input
            placeholder={t('Name RU')}
            allowClear
            value={get(filters, 'nameRu', '')}
            onChange={(e) => setFilters((s) => ({ ...s, nameRu: get(e, 'target.value') }))}
          />
          <Input
            placeholder={t('Name EN')}
            allowClear
            value={get(filters, 'nameEn', '')}
            onChange={(e) => setFilters((s) => ({ ...s, nameEn: get(e, 'target.value') }))}
          />
        </Space>

        <Table
          rowKey={(r) => get(r, 'id')}
          columns={columns}
          loading={loading}
          dataSource={get(list, 'content', [])}
          pagination={false}
        />

        <Row justify="space-between" style={{ marginTop: 10 }}>
          <Typography.Title level={5}>
            {t('Total')}: {get(list, 'totalElements', 0)}
          </Typography.Title>
          <Pagination
            current={page + 1}
            onChange={(p) => setPage(p - 1)}
            total={get(list, 'totalPages', 0) * 10}
            showSizeChanger={false}
          />
        </Row>

        <Modal title={selected ? t('Edit') : t('Create')} open={open} onCancel={() => setOpen(false)} footer={null}>
          <Form layout="vertical" onFinish={onFinish} initialValues={selected || { active: true }}>
            <Form.Item label={t('Name UZ')} name="nameUz" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={t('Name RU')} name="nameRu" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={t('Name EN')} name="nameEn" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={t('Required Subscriptions')} name="requiredSubscriptions" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label={t('Required Months')} name="requiredMonths" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label={t('Priority')} name="priority" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label={t('Active')} name="active" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSaving} block>
                {selected ? t('Save') : t('Create')}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </Container>
  );
};

export default RewardsContainer;


