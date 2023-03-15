
替换依赖包中 react-animated-router文件夹 下的 animate.css 中内容

@charset "UTF-8";

.animated-router {
  /** START: 自定义进出场动画 **/
  /** END **/
}

.animated-router-container {
  /* 动画容器节点 */
}

.animated-router-in-transition {
  /* 页面动画中 */
  position: relative;
  width: 100%;
  overflow: hidden;
}

.animated-router-forward-enter {
  transform: translate(-100%);
  opacity: 0;
}

.animated-router-forward-enter-active {
  transform: translate(0);
  opacity: 1;
}

.animated-router-forward-exit {
  opacity: 0.5;
}

.animated-router-forward-exit-active {
  opacity: 0;
}

.animated-router-backward-enter {
  transform: translate(-100%);
  opacity: 0;

}

.animated-router-backward-enter-active {
  transform: translate(0);
  opacity: 1;
}

.animated-router-backward-exit {
  opacity: 0.5;
}

.animated-router-backward-exit-active {
  opacity: 0;
}

.animated-router-forward-enter-active,
.animated-router-forward-exit-active,
.animated-router-backward-enter-active,
.animated-router-backward-exit-active {
  transition: all 0.5s cubic-bezier(0, 1, 0.75, 1);
}

.animated-router-forward-exit,
.animated-router-backward-exit {
  position: absolute !important;
  width: 100%;
  top: 0;
  left: 0;
}
