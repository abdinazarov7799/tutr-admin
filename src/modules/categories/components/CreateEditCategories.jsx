import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import { KEYS } from "../../../constants/key.js";
import { URLS } from "../../../constants/url.js";
import { Button, Form, Input } from "antd";
import { get } from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";

const CreateEditCategories = ({ selected, setIsModalOpen }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.categories_list,
    });
    const { mutate: mutateEdit, isLoading: isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.categories_list,
    });

    useEffect(() => {
        form.setFieldsValue({
            nameUz: get(selected, "nameUz"),
            nameRu: get(selected, "nameRu"),
            nameEn: get(selected, "nameEn"),
            courseTypeId: get(selected, "courseTypeId"),
            parentId: get(selected, "parentId"),
            active: get(selected, "active", true),
        });
    }, [selected]);

    const onFinish = (values) => {
        if (selected) {
            mutateEdit({ url: URLS.categories_patch(get(selected, 'id')), attributes: values }, { onSuccess: () => setIsModalOpen(false) });
        } else {
            mutate({ url: URLS.categories_create, attributes: values }, { onSuccess: () => setIsModalOpen(false) });
        }
    };

    return (
        <Form
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            form={form}
        >
            <Form.Item label={t('Name UZ')} name="nameUz" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label={t('Name RU')} name="nameRu" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label={t('Name EN')} name="nameEn" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label={t('Course Type ID')} name="courseTypeId">
                <Input type="number" />
            </Form.Item>
            <Form.Item label={t('Parent ID')} name="parentId">
                <Input type="number" />
            </Form.Item>
            <Form.Item label={t('Active')} name="active" valuePropName="checked">
                <input type="checkbox" />
            </Form.Item>

            <Form.Item>
                <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={isLoading || isLoadingEdit}
                >
                    {selected ? t("Edit") : t("Create")}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateEditCategories;
