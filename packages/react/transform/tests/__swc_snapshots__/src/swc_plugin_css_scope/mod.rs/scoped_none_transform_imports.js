import './foo.css';
import styles from './bar.css';
import * as styles2 from '@fancy-ui/main.css';
import { clsA, clsB } from './baz.module.css';
const jsx = <view className={`foo ${styles.bar} ${styles2.baz} ${clsA} ${clsB}`}/>;
