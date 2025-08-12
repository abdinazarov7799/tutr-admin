import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Pagination, Row, Space, Table, Typography, notification } from 'antd';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container.jsx';
import { URLS } from '../../constants/url.js';
import { request } from '../../services/api';

const LanguageContainer = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [list, setList] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', 10);
      if (search) params.append('search', search);
      const { data } = await request.get(`${URLS.language_get_all}?${params.toString()}`);
      setList({ content: get(data,'content',[]), totalElements: get(data,'totalElements',0), totalPages: get(data,'totalPages',0) });
    } catch { notification.error({ message: 'Failed to load languages' }); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchList(); }, [page, search]);

  const onCreate = async (values) => {
    try {
      setSaving(true);
      await request.post(URLS.language_create_with_key, [values]);
      setOpen(false);
      fetchList();
    } catch { notification.error({ message: 'Failed to save' }); }
    finally { setSaving(false); }
  };

  const columns = useMemo(()=>[
    { title: t('Key'), dataIndex: 'key', key: 'key' },
    { title: t('Primary Lang'), dataIndex: 'primaryLang', key: 'primaryLang' },
  ], [t]);

  return (
    <Container>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space>
          <Input.Search placeholder={t('Search')} allowClear onSearch={setSearch} onChange={(e)=> setSearch(get(e,'target.value'))} />
          <Button type="primary" onClick={()=> setOpen(true)}>{t('Create key')}</Button>
        </Space>

        <Table rowKey={(r)=>get(r,'id')} columns={columns} loading={loading} dataSource={get(list,'content',[])} pagination={false} />
        <Row justify="space-between" style={{ marginTop: 10 }}>
          <Typography.Title level={5}>{t('Total')}: {get(list,'totalElements',0)}</Typography.Title>
          <Pagination current={page+1} onChange={(p)=>setPage(p-1)} total={get(list,'totalPages',0)*10} showSizeChanger={false} />
        </Row>

        <Modal title={t('Create translation key')} open={open} onCancel={()=> setOpen(false)} footer={null}>
          <Form layout="vertical" onFinish={onCreate}>
            <Form.Item label={t('Key')} name="key" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label={t('Uzbek')} name="textUz"><Input /></Form.Item>
            <Form.Item label={t('Russian')} name="textRu"><Input /></Form.Item>
            <Form.Item label={t('Korean')} name="textKr"><Input /></Form.Item>
            <Form.Item><Button type="primary" htmlType="submit" loading={saving} block>{t('Create')}</Button></Form.Item>
          </Form>
        </Modal>
      </Space>
    </Container>
  );
};

export default LanguageContainer;


