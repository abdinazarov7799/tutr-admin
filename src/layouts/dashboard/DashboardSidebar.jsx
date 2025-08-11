import {Button, Menu, theme} from "antd";
import {get} from "lodash";
import React from "react";
import Sider from "antd/es/layout/Sider";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";

const DashboardSidebar = ({collapsed,setCollapsed}) => {
    const { t } = useTranslation();
    const location = useLocation()
    const navigate = useNavigate()

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const items = [
      {
        label: t('Rewards') ,
        key: '/rewards',
      },
      {
        label: t('Courses') ,
        key: '/courses',
      },
      {
        label: t('Course Types') ,
        key: '/course-types',
      },
      {
        label: t('Course Formats') ,
        key: '/course-formats',
      },
      {
        label: t('Categories') ,
        key: '/categories',
      },
      {
        label: t('Boost Prices') ,
        key: '/boost-prices',
      },
      {
        label: t('Course Reviews') ,
        key: '/course-reviews',
      },
      {
        label: t('Statistics') ,
        key: 'stats',
        children: [
          { label: t('Boost Usage'), key: '/boost-stats' },
        ],
      },
    ]

  return(
      <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={{
              position: 'fixed',
              left: 24,
              top: 24,
              bottom: 24,
              scrollbarWidth: 'none',
              padding: 16,
              background: colorBgContainer,
              borderRadius: 20,
          }}
      >
          <Button
              style={{
                  position: 'absolute',
                  top: 72,
                  right: -15,
                  borderRadius: 999,
                  border: 'transparent',
                  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
              }}
              icon={collapsed ? <RightOutlined/> : <LeftOutlined/>}
              onClick={() => setCollapsed(prevState => !prevState)}
          >

          </Button>
          <div style={{height:'100%',overflowY:'auto'}}>
              <Menu
                  mode="inline"
                  theme="light"
                  style={{padding: 5,border: 'none'}}
                  onSelect={(event) => {navigate(get(event,'key','/'))}}
                  items={items}
                  selectedKeys={[get(location,'pathname','')]}
              />
          </div>

      </Sider>
  )
}
export default DashboardSidebar
