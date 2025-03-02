// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { root, useCallback, useState } from '@lynx-js/react';
import './index.css';
function App() {
  const [status, setstatus] = useState('fail');
  const handleTap = useCallback(() => {
    setstatus('success');
  }, [setstatus]);
  return (
    <>
      <image
        bindtap={handleTap}
        id='img'
        style='height:200px;width:200px;'
        src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAEmElEQVR42u3dv0sjexTG4TcigooWVqKFoCAWahDzN4SIhdjGSizSRMFCsdBOULE2ES1EC8UiEJJCK8VOUIsEBH+AFpJoQC3EISFKssXisuy9y3VuHM/MnPfplpWZ840fZjKjcTzlcrkMUqtKegCSxQCUYwDKMQDlGIByDEA5BqAcA1COASjHAJRjAMpVSw9QicvLS1xfXyObzSKbzSKTyaBYLGJzc1N6NMdwXACGYSCZTCIWi+Hi4uIf/+/1eqVHdBTHBJDL5bC2toZ4PI5isfjXr/N4PNKjOortA8jlclhfX0csFsP7+/t/fj1/um2OrQM4PDzE9PQ0CoWC9CiuZdsAVldXsbKyIj2G69kygKmpKezv70uPoYLt7gNEo1F+87+RrQI4Pj5GJBKRHkMV2wSQyWQwOTlZ8XZ4GWiObQKYm5vD6+trxdvhZaA5tghgb28PJycn0mOoJB5APp/H0tKS9BhqiQewu7uLp6cn6THUEg8gmUxKj6CaaAC3t7e4urqSfg1UEw0gkUh8+TZ5GWiOaACpVOrLt8nLQHPETwEkSyyAfD6Px8dH6fWrJxbAzc2NJdvlewBzxAKw6tqf7wHMEQvg7e1Neu0EwQBKpZL02gk2uBNIshiAcmIBVFVZs2teBZgjFoBV79Z5FWAOTwHKMQDlGIByDEA5BqAcA1COASjHAJRjAMoxAOUYgHIMQDkGoBwDUI4BKMcAlGMAyjEA5RiAcgxAOQagHANQjgEoxwCUYwDKiQVg1Ue4+Kljc1z30TAGYA5PAcoxAOUYgHIMQDkGoBwDUM519wH45+fMcd19AP75WXNcdwR4fn6WWpIjue4IAPx8/iB9jivfBB4cHEiP4BiuDCCRSODl5UV6DEdwZQCGYfARtJ/kygAAYGdnhw+j/ATXXQV8KJVKGB8ft+zBFG7hyquAD4ZhIBgM4vT0VGqZtufaI8AHwzAwOjqKaDQqtVRbc/UR4HeRSAR+vx/b29s4Pz+XWrbtVIvtuPr7d31/f4+FhYVf/+7t7UVPTw8aGxulXgYAQCAQQHt7u8i+xQKora2V2vUv6XQa6XRaegx0dnaKBSB2CmhoaJDaNf1GLIC2tjbptRMEA6ivr0dTU5P0+m1B8jE3oncCu7u7JXdvG5KPuRENwOfzSe6eIByA3++XXr96ogG0trbC6/VKvwaqif80MBgMSo+gmngAAwMDaGlpkR5DLfEAPB4PJiYmpMdQSzwAABgcHERXV5f0GCrZIgAAWFxcRE1NjfQY6tgmgI6ODszOzkqPIULtncA/DQ8PIxwOS4/x7dTeCfw3oVBIXQQ8AvwhFAphZmZGegwVbBkAAIyMjGBrawvNzc3So1iOp4C/6OvrQzwex9DQkPQormXrAICfvzcwPz+PjY0NBAIB6XEswfcAn+Dz+bC8vIyjoyOMjY2hrq5OeqQvI3kK8JQl916hs7MzpFIp3N3d4eHhAYVCQXqk/yUcDqO/v19k344OgCrnmFMAWYMBKMcAlGMAyjEA5RiAcgxAOQagHANQjgEoxwCUYwDKMQDlGIByDEA5BqAcA1COASjHAJT7AbZgLzItONF0AAAAAElFTkSuQmCC'
      />

      <view id='result' style='height:50px;width:50px;' class={status} />
    </>
  );
}
root.render(<App></App>);
