export const showLoading = (flag = true, title = '加载中', mask = true) => {
  if (flag) {
    uni.showLoading({
      title,
      mask,
    });
  } else {
    uni.hideLoading();
  }
};

export const handleShowToast = (title, position = 'center', duration = 1500) => {
  uni.hideToast();
  uni.showToast({
    title,
    position,
    duration,
    icon: 'none',
  });
};
