import React, { useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Pagination, Row, Space, Switch, Table, Typography, Popconfirm } from 'antd';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container.jsx';
import { KEYS } from '../../constants/key.js';
import { URLS } from '../../constants/url.js';
import useGetAllQuery from '../../hooks/api/useGetAllQuery.js';
import useDeleteQuery from '../../hooks/api/useDeleteQuery.js';
import usePostQuery from '../../hooks/api/usePostQuery.js';
import usePatchQuery from '../../hooks/api/usePatchQuery.js';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const BoostPricesContainer = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useGetAllQuery({ key: KEYS.boost_prices_list, url: URLS.boost_prices_list });
  const { mutate: createMutate, isLoading: isSaving } = usePostQuery({ listKeyId: KEYS.boost_prices_list });
  const { mutate: patchMutate } = usePatchQuery({ listKeyId: KEYS.boost_prices_list });
  const { mutate: remove } = useDeleteQuery({ listKeyId: KEYS.boost_prices_list });

  const onDelete = (id) => remove({ url: URLS.boost_prices_delete(id) });
  const onActivate = (record, activate) => patchMutate({ url: URLS.boost_prices_activate(get(record, 'id'), activate), attributes: {} });

  const onFinish = (values) => {
    if (selected) {
      patchMutate({ url: URLS.boost_prices_patch(get(selected, 'id')), attributes: values });
    } else {
      createMutate({ url: URLS.boost_prices_create, attributes: values });
    }
    setOpen(false);
    setSelected(null);
  };

  const columns = useMemo(() => [
    { title: t('ID'), dataIndex: 'id', key: 'id', width: 80 },
    { title: t('Duration Days'), dataIndex: 'durationDays', key: 'durationDays' },
    { title: t('Price'), dataIndex: 'price', key: 'price' },
    { title: t('Sort Order'), dataIndex: 'sortOrder', key: 'sortOrder' },
    {
      title: t('Active'), dataIndex: 'active', key: 'active', render: (active, record) => (
        <Switch checked={!!active} onChange={(val) => onActivate(record, val)} />
      )
    },
    {
      title: t('Actions'), key: 'actions', width: 120, render: (_, record) => (
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
      )
    }
  ], [t]);

  return (
    <Container>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelected(null); setOpen(true); }}>
          {t('Create')}
        </Button>
        <Table rowKey={(r) => get(r, 'id')} columns={columns} loading={isLoading} dataSource={get(data, 'data', [])} pagination={false} />

        <Modal title={selected ? t('Edit') : t('Create')} open={open} onCancel={() => setOpen(false)} footer={null}>
          <Form layout="vertical" onFinish={onFinish} initialValues={selected || { active: true }}>
            <Form.Item label={t('Duration Days')} name="durationDays" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label={t('Price')} name="price" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label={t('Sort Order')} name="sortOrder">
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

export default BoostPricesContainer;


