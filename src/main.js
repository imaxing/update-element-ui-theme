/**
 * 获取elementui css 代码
 * @param {*} url
 * @returns
 */
const getCSSString = (url) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      xhr.readyState === 4 && xhr.status === 200 && resolve(xhr.responseText);
    };
    xhr.open("GET", url);
    xhr.send();
  });
};

/**
 * 替换style
 * @param {*} style
 * @param {*} oldCluster
 * @param {*} newCluster
 * @returns
 */
const updateStyle = (style, oldCluster, newCluster) => {
  let newStyle = style;
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index]);
  });
  return newStyle;
};

const getThemeCluster = (theme) => {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    if (tint === 0) {
      return [red, green, blue].join(",");
    } else {
      red += Math.round(tint * (255 - red));
      green += Math.round(tint * (255 - green));
      blue += Math.round(tint * (255 - blue));
      red = red.toString(16);
      green = green.toString(16);
      blue = blue.toString(16);
      return `#${red}${green}${blue}`;
    }
  };
  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    red = Math.round((1 - shade) * red);
    green = Math.round((1 - shade) * green);
    blue = Math.round((1 - shade) * blue);
    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);
    return `#${red}${green}${blue}`;
  };
  const clusters = [theme];
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
  }
  clusters.push(shadeColor(theme, 0.1));
  return clusters;
};

export default async (options) => {
  const {
    theme,
    elementUiCdn = "https://unpkg.com/element-ui/lib/theme-chalk/index.css",
    originTheme = "#409EFF",
  } = options;
  let chalk = "";
  document.documentElement.style.setProperty(
    options.themeName || "--primary-theme",
    theme
  );
  const themeCluster = getThemeCluster(theme.replace("#", ""));
  const originalCluster = getThemeCluster(originTheme.replace("#", ""));
  chalk = await getCSSString(elementUiCdn);
  const newStyle = updateStyle(chalk, originalCluster, themeCluster);
  let styleTag = document.getElementById("chalk-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.setAttribute("id", "chalk-style");
    document.head.appendChild(styleTag);
  }
  styleTag.innerText = newStyle;
  Array.from(document.querySelectorAll("style"))
    .filter(
      (style) =>
        new RegExp(theme, "i").test(style.innerText) &&
        !/Chalk Variables/.test(style.innerText)
    )
    .forEach((style) => {
      const { innerText } = style;
      if (typeof innerText !== "string") return;
      style.innerText = updateStyle(innerText, originalCluster, themeCluster);
    });
};
