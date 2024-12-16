import React, { useEffect, useState } from 'react';
import { Flex, Result, Typography } from 'antd';
import axios from 'axios';

const PageSafety = ({ url }) => {
  const [percentage, setPercentage] = useState(null);
  const [isPhishing, setIsPhishing] = useState(null);

  console.log("url", url);

  useEffect(() => {
    if (url) {
      const getPrediction = async () => {
        try {
          const res = await axios.post('http://localhost:5000/api/check-url', {
            url,
          });

          // Extract percentage and is_phishing from the response
          const percentageValue = parseFloat(res.data.confidence.match(/\d+\.\d+/g)[0]);
          const phishingStatus = res.data.is_phishing;

          setPercentage(percentageValue);
          setIsPhishing(phishingStatus);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      getPrediction();
    }
  }, [url]);

  const renderResult = () => {
    if (isPhishing === null || percentage === null) {
      return <Typography.Title level={5}>Loading...</Typography.Title>;
    }

    if (isPhishing) {
      return (
        <Typography.Title level={5}>
          <Result
            status="error"
            title="This page may be a phishing website."
            subTitle={`Confidence: ${percentage.toFixed(2)}%`}
          />
        </Typography.Title>
      );
    } else {
      // If not phishing, revert to percentage-based logic
      if (percentage < 50) {
        return (
          <Typography.Title level={5}>
            <Result
              status="error"
              title="This page is not safe."
              subTitle={`Confidence: ${percentage.toFixed(2)}%`}
            />
          </Typography.Title>
        );
      } else {
        return (
          <Typography.Title level={5}>
            <Result
              status="success"
              title="This page is safe."
              subTitle={`Confidence: ${percentage.toFixed(2)}%`}
            />
          </Typography.Title>
        );
      }
    }
  };

  return (
    <Flex vertical align="center">
      <Typography.Title level={5}>Current Page:</Typography.Title>
      <Typography.Text>{url}</Typography.Text>
      {renderResult()}
    </Flex>
  );
};

export default PageSafety;
