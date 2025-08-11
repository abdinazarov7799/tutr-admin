import React, {useEffect, useState} from 'react';
import Container from "../../components/Container.jsx";
import {Button, DatePicker, Modal, Pagination, Popconfirm, Row, Space, Table, Tag, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../hooks/api/useDeleteQuery.js";
import CreateEditCategories from "./components/CreateEditCategories.jsx";
import { request } from "../../services/api";
import dayjs from "dayjs";

const CategoriesContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [params, setParams] = useState({});

    const [list, setList] = useState({content: [], totalElements: 0, totalPages: 0});
    const [isLoading, setIsLoading] = useState(false);

    const fetchList = async () => {
        setIsLoading(true)
        try {
            const payload = { page, size: 10, ...params };
            const {data} = await request.post(URLS.categories_filter, payload)
            setList({
                content: get(data,'content',[]),
                totalElements: get(data,'totalElements',0),
                totalPages: get(data,'totalPages',0),
            })
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => { fetchList() }, [page, JSON.stringify(params)])

    const { mutate } = useDeleteQuery({ listKeyId: KEYS.categories_list });
    const useDelete = (id) => { mutate({url: URLS.categories_delete(id)}) }

    const onChangeParams = (name, value) => {
        setPage(0)
        setParams(prevState => ({...prevState, [name]: value}));
    }

    const columns = [
        {
            title: t("Name UZ"),
            dataIndex: "nameUz",
            key: "nameUz"
        },
        {
            title: t("Name RU"),
            dataIndex: "nameRu",
            key: "nameRu"
        },
        {
            title: t("Name EN"),
            dataIndex: "nameEn",
            key: "nameEn"
        },
        {
            title: t("Course Type"),
            dataIndex: "courseTypeName",
            key: "courseTypeName"
        },
        {
            title: t("Parent"),
            dataIndex: "parentName",
            key: "parentName",
        },
        {
            title: t("Active"),
            dataIndex: "active",
            key: "active",
            render: (active) => active ? <Tag color="green">{t('Active')}</Tag> : <Tag color="red">{t('Inactive')}</Tag>
        },
        {
            title: t("Edit / Delete"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data, index) => (
                <Space key={index}>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setIsEditModalOpen(true)
                        setSelected(data)
                    }} />
                    <Popconfirm
                        title={t("Delete")}
                        description={t("Are you sure to delete?")}
                        onConfirm={() => useDelete(get(data,'id'))}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button danger icon={<DeleteOutlined />}/>
                    </Popconfirm>
                </Space>
            )
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Button
                        icon={<PlusOutlined />}
                        type={"primary"}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        {t("New")}
                    </Button>
                    <DatePicker
                        allowClear
                        placeholder={t("Dan")}
                        format="YYYY-MM-DD"
                        value={get(params, 'from') ? dayjs(get(params, 'from')) : null}
                        onChange={(date) => onChangeParams('from', date)}
                    />
                    <DatePicker
                        allowClear
                        placeholder={t("Gacha")}
                        format="YYYY-MM-DD"
                        value={get(params, 'to') ? dayjs(get(params, 'to')) : null}
                        onChange={(date) => onChangeParams('to', date)}
                    />
                </Space>

                <Table
                    columns={columns}
                    dataSource={get(list,'content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />

                <Row justify={"space-between"} style={{marginTop: 10}}>
                    <Typography.Title level={4}>
                        {t("Miqdori")}: {get(list,'totalElements')} {t("ta")}
                    </Typography.Title>
                    <Pagination
                        current={page+1}
                        onChange={(page) => setPage(page - 1)}
                        total={get(list,'totalPages') * 10 }
                        showSizeChanger={false}
                    />
                </Row>
            </Space>
            <Modal
                title={t('Create')}
                open={isCreateModalOpenCreate}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
            >
                <CreateEditCategories setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditCategories
                    selected={selected}
                    setIsModalOpen={setIsEditModalOpen}
                />
            </Modal>
        </Container>
    );
};

export default CategoriesContainer;
