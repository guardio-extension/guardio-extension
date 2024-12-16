import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';
import { Button, Flex, Form, Input, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import Link from 'antd/es/typography/Link';

const Newtab = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [isPhishing, setIsPhishing] = useState(null);

  const onFinish = async () => {
    const { url } = form.getFieldsValue();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/check-url', { url });

      // Extract the percentage and phishing status from the response
      const percentageValue = parseFloat(
        res.data.confidence.match(/\d+\.\d+/g)[0]
      );
      setPercentage(percentageValue);

      // Set the phishing status
      setIsPhishing(res.data.is_phishing);

      console.log("data", res.data);

      // If the site is not phishing and the percentage is high enough, redirect
      if (!res.data.is_phishing && percentageValue >= 50) {
        setTimeout(() => {
          window.open(form.getFieldValue('url'), '_self');
          setLoading(null);
          setPercentage(null);
          setIsPhishing(null);
          form.resetFields();
        }, 4000);
      } else {
        // If phishing or percentage is below 50, just show the warning
        setLoading(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(null);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Typography.Title level={3}>Guardio</Typography.Title>
      </header>
      <Flex
        vertical
        align="center"
        style={{
          width: '100%',
        }}
      >
        <Form
          layout="horizontal"
          form={form}
          style={{
            width: '100%',
            maxWidth: '840px',
            padding: '0 20px',
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="url"
            rules={[
              {
                pattern: new RegExp(
                  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/
                ),
                message: 'Please enter a valid URL.',
                validateTrigger: 'onSubmit',
              },
              {
                required: true,
                message: 'Please enter a URL.',
                validateTrigger: 'onSubmit',
              },
            ]}
          >
            <Space.Compact
              style={{
                width: '100%',
              }}
            >
              <Input
                placeholder="https://www.example.com"
                variant="filled"
                style={{
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                  background: 'white',
                }}
                size="large"
              />
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                disabled={loading}
                onClick={() => {
                  const url = form.getFieldValue('url');
                  if (url && !url.startsWith('http') && !url.startsWith('https')) {
                    form.setFieldsValue({ url: `http://${url}` });
                  }
                }}
              >
                <SearchOutlined />
              </Button>
            </Space.Compact>
          </Form.Item>
        </Form>
        <Flex vertical>
          {percentage !== null && (
            <>
              <Flex vertical>
                {isPhishing ? (
                  <>
                    <Typography.Text type="danger">
                      Warning: This website might be a phishing website! Confidence: {percentage.toFixed(2)}% 
                    </Typography.Text>
                    <Link
                      href={form.getFieldValue('url')}
                      onClick={() => {
                        setPercentage(null);
                        setIsPhishing(null);
                        form.resetFields();
                      }}
                      underline
                    >
                      Proceed anyway
                    </Link>
                  </>
                ) : (
                  <>
                    <Typography.Text type="secondary">
                      This website appears to be legitimate. Confidence: {percentage.toFixed(2)}%
                    </Typography.Text>
                    <Typography.Text>
                      Redirecting you to the website...
                    </Typography.Text>
                  </>
                )}
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </div>
  );
};

export default Newtab;
