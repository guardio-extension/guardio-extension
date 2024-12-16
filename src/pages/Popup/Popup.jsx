import React, { useEffect, useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import { Flex, Typography } from 'antd';
import PageSafety from '../../containers/PageSafety/PageSafety';

const Popup = () => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchTabUrl = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });
        const baseUrl = new URL(tab.url).origin;
        setUrl(baseUrl);
      } catch (error) {
        console.error('Error fetching tab URL:', error);
      }
    };
    fetchTabUrl();
  }, []);

  return (
    <>
      <div className="App">
        <header>
          <Flex align="center">
            <img src={logo} className="App-logo" alt="logo" />
            <Typography.Title level={3}>Guardio</Typography.Title>
          </Flex>
        </header>
        <PageSafety url={url} />
      </div>
    </>
  );
};

export default Popup;
