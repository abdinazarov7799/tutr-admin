import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {Button, Form, Input, Select} from "antd";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";
import { URLS } from "../../../constants/url.js";

const CreateEditAdmin = ({itemData,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const { mutate, isLoading } = usePostQuery({ listKeyId: KEYS.admins_list });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({ listKeyId: KEYS.admins_list });

    useEffect(() => {
        form.setFieldsValue({
            ...itemData
        });
    }, [itemData]);

    const onFinish = (values) => {
        if (itemData){
            mutateEdit(
                { url: URLS.admin_patch(get(itemData,'id')), attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.admin_create, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }
    };

    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
                <Form.Item
                    label={t("Username")}
                    name="username"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Password")}
                    name="password"
                    rules={[{required: true,}]}
                >
                    <Input.Password />
                </Form.Item>

            <Form.Item label={t("Role")} name="role" rules={[{required: true}]}>
                <Select
                    placeholder={t("Role")}
                    options={[
                        { value: 'SUPER_ADMIN', label: t('SUPER_ADMIN') },
                        { value: 'ADMIN', label: t('ADMIN') },
                        { value: 'TEACHER', label: t('TEACHER') },
                        { value: 'STUDENT', label: t('STUDENT') },
                    ]}
                />
            </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditAdmin;
