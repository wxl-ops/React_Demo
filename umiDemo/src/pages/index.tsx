import styles from './index.less';
import { Button } from 'antd';
import { Button as V2Button } from 'antd-mobile-v2';
import { Button as V5Button } from 'antd-mobile';
// import img from '../assets/images/718255.jpg';
export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <p id={styles.demo}>样式的测试</p>
      <Button type="primary">主要按钮</Button>
      <V2Button type="primary">v2</V2Button>
      <V5Button color="primary">v5</V5Button>
      {/* <img src={require('../assets/images/718255.jpg')} alt="" /> */}
      {/* <img src={img} alt="" /> */}
      {/* <img src="../assets/images/718255.jpg" alt="" /> */}
      <img src="/img/718255.jpg" alt="" />
    </div>
  );
}
