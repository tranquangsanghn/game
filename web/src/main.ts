import './styles.css';
import { GiaoDien } from './giao-dien';

const goc = document.getElementById('app')!;
const gd = new GiaoDien(goc);
gd.khoiDong();

// Bấm Đóng: trong iframe thì báo trang cha đóng khung game; chạy độc lập (không có trang cha) thì quay về màn bắt đầu
gd.onDong = () => {
  if (window.parent !== window) window.parent.postMessage('chicken-shooting-game:dong', '*');
  else window.location.reload();
};
