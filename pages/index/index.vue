<template>
  <view id="view"></view>
</template>

<script setup name="index">
import { onMounted, onBeforeUnmount } from 'vue';
import { showLoading, handleShowToast } from '@/common/utils/util';

let webviewObj = null;
let currentWebview = null;
const createWebview = () => {
  // #ifdef APP-PLUS
  webviewObj = plus.webview.create('', 'webview', { plusrequire: 'none' });
  webviewObj.loadURL('/static/html/index.html');
  webviewObj.addEventListener(
    'loading',
    res => {
      showLoading(true);
    },
    false
  );
  webviewObj.addEventListener(
    'loaded',
    e => {
      showLoading(false);
      webviewObj.show();
    },
    false
  );
  webviewObj.addEventListener(
    'error',
    e => {
      showLoading(false);
      handleShowToast('加载页面失败');
    },
    false
  );

  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  currentWebview = currentPage.$getAppWebview();
  currentWebview.append(webviewObj);

  setTimeout(() => {
    webviewObj?.checkRenderedContent(
      {},
      res => {
        const { deviceOrientation } = uni.getSystemInfoSync();
        sendMessage({ deviceOrientation });
        getDeviceOrientation();
      },
      err => {
        handleShowToast('数据传输失败');
      }
    );
  }, 200);
  // #endif
};

function getDeviceOrientation() {
  uni.onWindowResize(res => {
    const { deviceOrientation } = res;
    sendMessage({ deviceOrientation });
  });
}

let timer = null;
const sendMessage = content => {
  // #ifdef APP-PLUS
  clearTimeout(timer);
  setTimeout(() => {
    let data = { content };
    let jsCode = `setContent(${JSON.stringify(data)})`;
    let webview = plus.webview.getWebviewById('webview');
    webview.evalJS(jsCode);
  }, 200);
  // #endif
};

const closeWebview = () => {
  clearTimeout(timer);
  webviewObj && webviewObj?.close();
  currentWebview = null;
};

onMounted(() => {
  createWebview();
});

onBeforeUnmount(() => {
  closeWebview();
});
</script>

<style lang="less" scoped></style>
