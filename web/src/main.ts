import './styles.css';
import { GiaoDien } from './giao-dien';

const goc = document.getElementById('app')!;
const gd = new GiaoDien(goc);
gd.khoiDong();

// Khi chạy trong iframe: bấm Đóng thì báo trang cha đóng khung game
gd.onDong = () => {
  if (window.parent !== window) window.parent.postMessage('chicken-shooting-game:dong', '*');
};
