import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Typography, notification } from 'antd';
import { get } from 'lodash';
import Container from '../../components/Container.jsx';
import { URLS } from '../../constants/url.js';
import { request } from '../../services/api';

const BoostStatsContainer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await request.get(URLS.boost_usage_stats);
      setData(data);
    } catch {
      notification.error({ message: 'Failed to load stats' });
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchStats(); }, []);

  const columns = [
    { title: 'Duration (days)', dataIndex: 'durationDays', key: 'durationDays' },
    { title: 'Usage', dataIndex: 'totalUsage', key: 'totalUsage' },
    { title: 'Income', dataIndex: 'totalIncome', key: 'totalIncome' },
    { title: 'Active Count', dataIndex: 'activeCount', key: 'activeCount' },
  ];

  return (
    <Container>
      <Row gutter={[16,16]}>
        <Col span={24}>
          <Typography.Title level={4}>Boost usage</Typography.Title>
        </Col>
        <Col span={24}>
          <Table loading={loading} rowKey={(r)=>`${get(r,'durationDays')}`} columns={columns} dataSource={get(data,'tariffStats',[])} pagination={false} />
        </Col>
      </Row>
    </Container>
  );
};

export default BoostStatsContainer;


