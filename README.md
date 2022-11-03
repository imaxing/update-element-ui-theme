# 更简单的方式更新 ElementUi 主题色

#### Installtion

```bash
npm i update-element-ui-theme
```

#### Usage

```js
import updateElementUiTheme from "update-element-ui-theme";

updateElementUiTheme({
  theme: "#222", // 要修改的主题色
  themeName: "--my-theme", // 要同步更新的 css 变量名称
});
```

### live demo

[![Edit update-element-ui-theme](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/element-ui-theme-set-example-4d61d?fontsize=14&hidenavigation=1&theme=dark)
